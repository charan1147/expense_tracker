import Expense from "../models/Expense.js"; // Import the Expense model

// Create a new personal expense
export const personalAddExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body; // Extract expense details from request body

    // Validate required fields
    if (!amount || !category || !date || isNaN(amount)) {
      return res.status(400).json({ 
        success: false, 
        message: "Valid amount, category, and date are required" 
      });
    }

    // Create and save the new expense to the database
    const expense = await Expense.create({
      userId: req.user.id, // Associate expense with the logged-in user
      amount,
      category,
      date: new Date(date), // Convert date string to a Date object
      description
    });

    res.status(201).json({ success: true, data: expense }); // Return created expense

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Get all personal expenses sorted by date
export const personalGetExpensesAll = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 }); // Retrieve expenses sorted by date (newest first)

    if (!expenses.length) {
      return res.status(404).json({ success: false, message: "No expenses found" });
    }

    res.status(200).json({ success: true, data: expenses }); // Return list of expenses

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Get a single personal expense by ID
export const personalGetExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id }); // Find expense by ID and user ID

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, data: expense }); // Return the found expense

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Update a personal expense
export const personalUpdateExpense = async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;

    // Validate amount if provided
    if (amount && isNaN(amount)) {
      return res.status(400).json({ success: false, message: "Amount must be a number" });
    }

    // Prepare updated fields dynamically
    const updatedFields = { 
      ...(amount && { amount }),
      ...(category && { category }),
      ...(date && { date: new Date(date) }),
      ...(description && { description })
    };

    // Find and update the expense
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Ensure the user owns the expense
      updatedFields,
      { new: true } // Return updated expense
    );

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, data: expense }); // Return updated expense

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Delete a personal expense
export const personalDeleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); // Ensure user owns the expense before deletion

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, message: "Expense deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};

// Admin: Get all expenses from all users
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("userId", "username email"); // Retrieve all expenses with user details

    if (!expenses.length) {
      return res.status(404).json({ success: false, message: "No expenses found" });
    }

    res.status(200).json({ success: true, data: expenses }); // Return all expenses

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: " + error.message });
  }
};