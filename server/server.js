import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan"; // For request logging
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js"; // Central error handler
import userRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/personalExpenseRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
try {
  connectDB();
} catch (error) {
  console.error("Database connection failed:", error.message);
  process.exit(1); // Exit process with failure
}

// Middleware
app.use(morgan("dev")); // Log incoming requests in development
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow frontend origin
    credentials: true, // Enable cookies for CORS requests
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes); // Protect specific routes in expenseRoutes itself
app.use("/api/groups", groupRoutes); // Protect specific routes in groupRoutes itself

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "API is healthy", timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler); // Use custom error handler

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
