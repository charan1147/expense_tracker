import express from "express";
import { registerUser, loginUser, logoutUser,getMe } from "../controllers/authController.js"
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Route to register a new user
router.post("/register", registerUser);

// Route to log in a user
router.post("/login", loginUser);

// Route to log out a user
router.post("/logout", logoutUser);

router.get('/me', protect, getMe);

export default router;
