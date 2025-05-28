import express from "express";
import {
  getallChats,
  getGeminiReply,
  updatePromptAndReply,
  deletePromptAndReply,
} from "../controllers/geminiController.js";
import { protectRoute } from "../middleware/auth.js";

const geminiRouter = express.Router();

// Create (generate new reply)
geminiRouter.post('/chat', protectRoute, getGeminiReply);

// Read (get all chat history)
geminiRouter.get('/getchats', protectRoute, getallChats);

// Update a specific prompt and regenerate its response
geminiRouter.patch('/updatechat', protectRoute, updatePromptAndReply);

// Delete a specific prompt and its response
geminiRouter.delete('/deletechat', protectRoute, deletePromptAndReply);

export default geminiRouter;
