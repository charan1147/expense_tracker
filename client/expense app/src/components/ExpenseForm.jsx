// Import necessary hooks and functions from React and API
import { useState, useEffect } from "react";
import { addExpense, updateExpense } from "../api/Expenses"; // Import API functions to add and update expenses
import "./ExpenseForm.css"; // Import the corresponding CSS file for styling

// ExpenseForm component receives two props:
// - onComplete: A function to execute when the expense is successfully added/updated
// - initialData: If editing an expense, it contains the existing data; otherwise, it's an empty object
const ExpenseForm = ({ onComplete, initialData = {} }) => {
  // Define the initial state for the expense form
  const [expense, setExpense] = useState({
    category: "", // Stores the selected category
    amount: "", // Stores the amount entered by the user
    description: "", // Stores the description of the expense
    date: "", // Stores the date of the expense
  });

  // Predefined categories for selection in the dropdown
  const categories = ["Food", "Travel", "Bills", "Entertainment", "Other"];

  // useEffect runs when the component mounts or when initialData changes
  // It pre-fills the form when editing an existing expense
  useEffect(() => {
    if (initialData._id) {
      setExpense({
        category: initialData.category || "", // Use existing category or empty string
        amount: initialData.amount || "", // Use existing amount or empty string
        description: initialData.description || "", // Use existing description or empty string
        date: initialData.date ? initialData.date.split("T")[0] : "", // Format date for input field (YYYY-MM-DD)
      });
    }
  }, [initialData]); // Runs only when initialData changes

  // Handles changes to the input fields and updates the state accordingly
  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  // Handles form submission for adding or updating an expense
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh on form submission

    // Validate that all fields are filled
    if (Object.values(expense).some((val) => !val)) {
      alert("All fields are required!"); // Show alert if any field is empty
      return;
    }

    try {
      if (initialData._id) {
        // If the expense has an ID, update it (edit mode)
        await updateExpense(initialData._id, expense);
        alert("Expense updated successfully"); // Notify user of success
      } else {
        // Otherwise, add a new expense (add mode)
        await addExpense(expense);
        alert("Expense added successfully"); // Notify user of success
        setExpense({ category: "", amount: "", description: "", date: "" }); // Reset form after submission
      }

      onComplete?.(); // Call onComplete callback if provided
    } catch (error) {
      // Handle API errors
      alert(`Failed to ${initialData._id ? "update" : "add"} expense`);
      console.error("Expense error:", error); // Log the error for debugging
    }
  };

  return (
    <div className="expense-form">
      <h3>{initialData._id ? "Edit Expense" : "Add an Expense"}</h3> {/* Change title based on edit/add mode */}
      <form onSubmit={handleSubmit}>
        {/* Dropdown for selecting expense category */}
        <select name="category" value={expense.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Input field for entering the expense amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
          required
        />

        {/* Input field for entering the expense description */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={expense.description}
          onChange={handleChange}
          required
        />

        {/* Input field for selecting the expense date */}
        <input type="date" name="date" value={expense.date} onChange={handleChange} required />

        {/* Submit button, changes text based on edit/add mode */}
        <button type="submit">{initialData._id ? "Update" : "Submit"}</button>
      </form>
    </div>
  );
};

export default ExpenseForm; // Export the component for use in other parts of the app
