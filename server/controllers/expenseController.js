import Expense from "../models/Expense.js";

// Create a new personal expense
export const personalAddExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    if (!amount || !category || !date || isNaN(amount)) {
      return res.status(400).json({ 
        success: false, 
        message: "Valid amount, category, and date are required" 
      });
    }

    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      category,
      date: new Date(date),
      description
    });

    res.status(201).json({ success: true, data: expense });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Get all personal expenses (sorted by date)
export const personalGetExpensesAll = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });

    if (!expenses.length) {
      return res.status(404).json({ success: false, message: "No expenses found" });
    }

    res.status(200).json({ success: true, data: expenses });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Get a single personal expense by ID
export const personalGetExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, data: expense });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Update a personal expense
export const personalUpdateExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    if (amount && isNaN(amount)) {
      return res.status(400).json({ success: false, message: "Amount must be a number" });
    }

    const updatedFields = { ...(amount && { amount }), ...(category && { category }), ...(date && { date: new Date(date) }), ...(description && { description }) };

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updatedFields,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, data: expense });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Delete a personal expense
export const personalDeleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, message: "Expense deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Get all expenses (Admin feature)
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("userId", "username email");

    if (!expenses.length) {
      return res.status(404).json({ success: false, message: "No expenses found" });
    }

    res.status(200).json({ success: true, data: expenses });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};
