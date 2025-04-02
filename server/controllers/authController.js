import { generateToken, clearToken } from "../config/genrateToken.js";
import User from "../models/User.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({ username, email, password });

    generateToken(user._id, res);

    res.status(201).json({ success: true, user: { id: user._id, username, email } });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({ success: true, user: { id: user._id, username: user.username, email } });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  clearToken(res);
  res.status(200).json({ success: true, message: "Logged out" });
};

// Get Current User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v -createdAt -updatedAt");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
