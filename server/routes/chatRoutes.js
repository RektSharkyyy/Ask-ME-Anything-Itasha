import express from "express"
import { createChat } from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";
import { deleteChat, getChat } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get('/create',protect, createChat)
chatRouter.get('/get',protect, getChat)
chatRouter.post('/delete',protect, deleteChat)

export default chatRouter