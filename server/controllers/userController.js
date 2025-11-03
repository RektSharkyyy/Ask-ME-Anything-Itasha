import  jwt  from "jsonwebtoken";
import User from "../models/user.js";

// Generate JWT
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:'30d'
    })
}

// API to register user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({email})

        if(userExists){
            return res.json({success: false, message: "User ALready exists"})
        }

        const user = await User.create({name, email, password })

        const token = generateToken(user._id)
        res.json({success:true, token})
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}


// API to user login
