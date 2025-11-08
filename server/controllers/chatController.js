import Chat from "../models/Chat.js"


// API controller for creating a new chat
export const createChat = async (req, res) => {
    try {
        const userId = req.user._id

        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        }

        await Chat.create(chatData)
        res.json({success:true, message:"Chat Created"})
    } catch (error) {
        res.json({success:false, message:error.message})
    }    
}

//  API controller for getting all the chats
export const getChat = async (req, res) => {
    try {
        const userId = req.user._id
        const chats = await Chat.find({userId}).sort({updatedAt: -1})

        res.json({success:true,chats})
    } catch (error) {
        res.json({success:false, message:error.message})
    }    
}

// APi controller for deleting a chat
export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id
        const {chatId} = req.body

        await Chat.deleteOne({_id: chatId, userId})

        res.json({success:true, message:"chat deleted"})
    } catch (error) {
        res.json({success:false, message:error.message})
    }    
}