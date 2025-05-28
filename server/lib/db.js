import mongoose from "mongoose";

// Function to connect with MongoDB
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

  await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
};
export default connectDB