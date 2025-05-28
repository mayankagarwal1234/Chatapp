import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


// Sign Up a new User
export const signup = async (req, res) => {
    try {
        const { fullName, email, password, bio } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ success: false, msg: "All fields are required" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ success: false, msg: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio,
        });

        // Generate JWT token
        const token = generateToken(newUser._id);

        // Send success response (omit password)
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            userData: newUser
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({
            success: false,
            msg: "Server error during signup",
            error: error.message,
        });
    }
};

// User Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });
        if (!userData) {
             res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
             res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);

        res.json({
            success: true,
            userData,
            token,
            message: "Logged in Successfully",
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ success: false, msg: "Server error", error: error.message });
    }
};

// Check Auth Controller
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;
        const userId = req.user._id;
        let updatedUser;

        if (profilePic) {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url , bio, fullName }, { new: true });
        }
        else {
             updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true });
        }

        res.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Update profile error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

