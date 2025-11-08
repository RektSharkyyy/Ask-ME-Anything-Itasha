import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// API to register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.json({ success: false, message: "User ALready exists" })
        }

        const user = await User.create({ name, email, password })

        const token = generateToken(user._id)
        res.json({ success: true, token })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// API to user login
export const loginUser = async (req, res) =>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email})
        if (user){
            const isMatch = await bcrypt.compare(password, user.password)

            if (isMatch) {
                const token = generateToken(user._id)
                return res.json({ success: true, token })
            }
        }
        return res.json({success:false, message:"Invalid email or password"})
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// API to gey user data
export const getUser = async (req, res) =>{
    try {
        const user = req.user;
        return res.json({success:true, user})
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}