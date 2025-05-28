import axios from "axios";
import Chat from "../models/Chat.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// CREATE OR UPDATE CHAT
export const getGeminiReply = async (req, res) => {
  const { prompt, fullName, chatId } = req.body;
  const userId = req.user.id;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY not set in environment." });
  }

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required and must be a non-empty string." });
  }

  try {
    // 1. Get reply from Gemini API
    const response = await axios.post(endpoint, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const reply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(502).json({
        error: "Gemini API did not return a valid reply.",
        details: response.data,
      });
    }

    // 2. Find existing chat if chatId provided
    let chat = null;

    if (chatId) {
      chat = await Chat.findOne({ chatId, userId });
    }

    // 3. Create new chat if not found
    if (!chat) {
      chat = new Chat({
        chatId: `chat_${Date.now()}`,
        fullName: fullName || req.user.fullName || "Anonymous",
        userId,
        messages: [],
      });
    }

    // 4. Append prompt + reply
    chat.messages.push(
      { role: "user", content: prompt, timestamp: new Date() },
      { role: "model", content: reply, timestamp: new Date() }
    );

    await chat.save();

    return res.status(200).json({ reply, chatId: chat.chatId });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Failed to fetch response from Gemini API",
      details: error.response?.data || error.message,
    });
  }
};

// GET ALL CHAT SESSIONS FOR USER
export const getallChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({ userId }).select("chatId messages");

    return res.status(200).json({ success: true, chats });
  } catch (error) {
    console.error("Get Chats Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE A PROMPT IN SPECIFIC CHAT SESSION
export const updatePromptAndReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId, oldPrompt, newPrompt } = req.body;

    if (!chatId || !oldPrompt || !newPrompt) {
      return res.status(400).json({ error: "chatId, oldPrompt, and newPrompt are required." });
    }

    const chat = await Chat.findOne({ chatId, userId });

    if (!chat || chat.messages.length < 2) {
      return res.status(404).json({ error: "Chat session not found or empty." });
    }

    const index = chat.messages.findIndex(
      (msg, i) =>
        msg.role === "user" &&
        msg.content === oldPrompt &&
        chat.messages[i + 1]?.role === "model"
    );

    if (index === -1) {
      return res.status(404).json({ error: "Prompt not found." });
    }

    // Get new Gemini reply for the updated prompt
    const response = await axios.post(endpoint, {
      contents: [{ role: "user", parts: [{ text: newPrompt }] }],
    });

    const newReply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!newReply) {
      return res.status(502).json({
        error: "Gemini API did not return a valid reply.",
        details: response.data,
      });
    }

    // Update messages
    chat.messages[index].content = newPrompt;
    chat.messages[index].timestamp = new Date();
    chat.messages[index + 1].content = newReply;
    chat.messages[index + 1].timestamp = new Date();

    await chat.save();

    return res.status(200).json({
      success: true,
      updatedPrompt: chat.messages[index],
      updatedReply: chat.messages[index + 1],
    });
  } catch (error) {
    console.error("Update Prompt Error:", error.message);
    res.status(500).json({
      error: "Failed to update prompt and reply",
      details: error.message,
    });
  }
};

// DELETE ENTIRE CHAT SESSION (BY chatId)
export const deletePromptAndReply = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.body;

    if (!chatId) {
      return res.status(400).json({ error: "chatId is required." });
    }

    const chat = await Chat.findOne({ chatId, userId });

    if (!chat) {
      return res.status(404).json({ error: "Chat session not found." });
    }

    // Delete the entire chat session
    await Chat.deleteOne({ chatId, userId });

    return res.status(200).json({
      success: true,
      message: `Chat session '${chatId}' has been deleted.`,
    });
  } catch (error) {
    console.error("Delete Chat Error:", error.message);
    res.status(500).json({
      error: "Failed to delete chat session",
      details: error.message,
    });
  }
};

