import express from "express";
import {
  personalAddExpense,
  personalGetExpensesAll,
  personalGetExpenseById,
  personalUpdateExpense,
  personalDeleteExpense,
  getAllExpenses,
} from "../controllers/expenseController.js";
import { protect } from "../middlewares/authMiddleware.js"; // Assuming routes are protected

const router = express.Router();

// ✅ Add a new expense (Protected)
router.post("/", protect, personalAddExpense);

// ✅ Get all personal expenses (Protected)
router.get("/", protect, personalGetExpensesAll);

// ✅ Get a single personal expense by ID (Protected)
router.get("/:id", protect, personalGetExpenseById);

// ✅ Update a personal expense by ID (Protected)
router.put("/:id", protect, personalUpdateExpense);

// ✅ Delete a personal expense by ID (Protected)
router.delete("/:id", protect, personalDeleteExpense);

// ✅ Admin: Get all expenses (Admin-only functionality)
router.get("/admin/all", protect, getAllExpenses);

export default router;
