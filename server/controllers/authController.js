// Import necessary modules and functions
import { generateToken, clearToken } from "../config/genrateToken.js"; // Token handling functions
import User from "../models/User.js"; // User model

// ------------------------ REGISTER USER ------------------------
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Extract user input from request body

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if the email is already registered
    if (await User.findOne({ email })) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    // Create a new user in the database
    const user = await User.create({ username, email, password });

    // Generate a JWT token and set it in cookies
    generateToken(user._id, res);

    // Respond with user details (excluding password)
    res.status(201).json({ success: true, user: { id: user._id, username, email } });

  } catch (error) {
    // Handle server errors
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------------ LOGIN USER ------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract login credentials

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Find user by email and retrieve password field explicitly (if it's not selected by default in the schema)
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and if the provided password matches the stored hash
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate a JWT token and set it in cookies
    generateToken(user._id, res);

    // Respond with user details
    res.status(200).json({ success: true, user: { id: user._id, username: user.username, email } });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------ LOGOUT USER ------------------------
export const logoutUser = (req, res) => {
  // Clear the JWT token by removing the cookie
  clearToken(res);

  // Respond with a success message
  res.status(200).json({ success: true, message: "Logged out" });
};

// ------------------------ GET CURRENT USER ------------------------
export const getMe = async (req, res) => {
  try {
    // Retrieve the user from the database using the ID from req.user (set from authentication middleware)
    const user = await User.findById(req.user.id).select("-password -__v -createdAt -updatedAt");
    
    // If user not found, return a 404 error
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Respond with the user details
    res.status(200).json({ success: true, user });

  } catch (error) {
    // Handle server errors
    res.status(500).json({ success: false, message: error.message });
  }
};
