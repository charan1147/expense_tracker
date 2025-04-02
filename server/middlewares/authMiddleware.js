import jwt from "jsonwebtoken"; // Import the 'jsonwebtoken' package for handling JWT authentication.
import User from "../models/User.js"; // Import the 'User' model to fetch user details from the database.

// Middleware function to protect routes by verifying JWT tokens.
export const protect = async (req, res, next) => {
  try {
    // Get the token from cookies
    const token = req.cookies.jwt;

    // If no token is found, return a 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized - No token" });
    }

    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database using the decoded user ID
    // Exclude the password field for security purposes
    const user = await User.findById(decoded.userId).select("-password");

    // If the user does not exist, return a 401 Unauthorized response
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Attach the user details (excluding the password) to the request object
    req.user = { id: user._id, username: user.username, email: user.email };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle errors that occur during token verification
    res.status(401).json({
      success: false,
      message: error.name === "TokenExpiredError" 
        ? "Session expired. Please log in again."  // If the token is expired, prompt the user to log in again.
        : "Invalid token"  // If the token is invalid, return an error message.
    });
  }
};
