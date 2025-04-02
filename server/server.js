import express from "express"; // Import Express.js framework
import dotenv from "dotenv"; // Import dotenv to manage environment variables
import cookieParser from "cookie-parser"; // Parse cookies from incoming requests
import cors from "cors"; // Enable CORS (Cross-Origin Resource Sharing)
import morgan from "morgan"; // Middleware for logging HTTP requests
import connectDB from "./config/db.js"; // Database connection function
import errorHandler from "./middlewares/errorHandler.js"; // Central error-handling middleware
import userRoutes from "./routes/authRoutes.js"; // User authentication routes
import expenseRoutes from "./routes/personalExpenseRoutes.js"; // Personal expense routes
import groupRoutes from "./routes/groupRoutes.js"; // Group expense routes

dotenv.config(); // Load environment variables from .env file
const app = express(); // Create an Express application
const PORT = process.env.PORT || 5000; // Use the port from .env, or default to 5000

// Connect to the database
try {
  connectDB(); // Call function to establish MongoDB connection
} catch (error) {
  console.error("Database connection failed:", error.message); // Log any connection errors
  process.exit(1); // Exit process with failure status code
}

// Middleware
app.use(morgan("dev")); // Log HTTP requests in a concise 'dev' format
app.use(express.json()); // Parse incoming JSON payloads
app.use(cookieParser()); // Parse cookies from incoming requests
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow frontend URL specified in .env
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Routes
app.use("/api/users", userRoutes); // Handle authentication and user-related routes
app.use("/api/expenses", expenseRoutes); // Handle personal expenses
app.use("/api/groups", groupRoutes); // Handle group expenses

// Default route (root)
app.get("/", (req, res) => {
  res.send("API is running..."); // Simple response to verify API is online
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "API is healthy", timestamp: new Date() }); // Returns API health status
});

// Error handling middleware (must be placed after all routes)
app.use(errorHandler); // Handles errors thrown by the application

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log message when server starts
});
