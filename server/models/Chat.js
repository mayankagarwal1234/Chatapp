import mongoose from "mongoose";

// Sub-schema for each message
const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },       
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Chat session schema — one per conversation
const ChatSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, unique: true }, // Unique session ID
    fullName: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [chatMessageSchema],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
