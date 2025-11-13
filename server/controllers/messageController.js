import axios from "axios"
import Chat from "../models/Chat.js"
import User from "../models/user.js"
import imagekit from "../configs/imageKit.js"
import openai from "../configs/openai.js"

// Text-based AI chat message controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id

        // check credits
        if (req.user.credits < 1) {
            return res.json({ success: false, message: "You don't have enough credits to use this feature!" })
        }

        const { chatId, prompt } = req.body

        const chat = await Chat.findOne({ userId, _id: chatId })
        if (!chat) {
            return res.json({ success: false, message: "Chat not found" })
        }

        // Push user message
        chat.messages.push({
            role: "user",
            content: prompt,
            timeStamp: Date.now(), // <-- match schema
            isImage: false
        })

        // Generate AI reply
        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                { role: "user", content: prompt }
            ]
        })

        const reply = {
            ...choices[0].message,
            timeStamp: Date.now(), // <-- match schema
            isImage: false
        }

        // Push AI reply to chat and save
        chat.messages.push(reply)
        await chat.save()

        // Deduct user credits
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })

        // Send response after all operations
        return res.json({ success: true, reply })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Image generation message controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        // check credits
        if (req.user.credits < 2) {
            return res.json({ success: false, message: "You don't have enough credits to use this feature!" })
        }

        const { prompt, chatId, isPublished } = req.body

        const chat = await Chat.findOne({ userId, _id: chatId })
        if (!chat) {
            return res.json({ success: false, message: "Chat not found" })
        }

        // Push user message
        chat.messages.push({
            role: "user",
            content: prompt,
            timeStamp: Date.now(),
            isImage: false
        })

        // Generate image via ImageKit
        const encodedPrompt = encodeURIComponent(prompt)
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/itasha/${Date.now()}.png?tr=w-800,h-800`

        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" })
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`

        // Upload to ImageKit
        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "itasha"
        })

        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timeStamp: Date.now(),
            isImage: true,
            isPublished
        }

        // Push AI reply to chat and save
        chat.messages.push(reply)
        await chat.save()

        // Deduct user credits
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })

        // Send response after all operations
        return res.json({ success: true, reply })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}