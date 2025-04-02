import React, { useState } from "react"; // Import React and useState hook
import "./AddGroupExpense.css"; // Import the component's CSS file for styling

/**
 * Component for adding a group expense.
 * 
 * @param {Object} props - Props passed to the component.
 * @param {string} props.groupId - The ID of the group where the expense is added.
 * @param {Function} props.onAdd - Function to handle adding the expense.
 */
function AddGroupExpense({ groupId, onAdd }) {
  // State to store the expense details
  const [expense, setExpense] = useState({
    amount: "",        // Expense amount
    category: "",      // Expense category
    date: "",         // Date of the expense
    description: "",  // Optional description
  });

  // Predefined list of expense categories
  const categories = ["Food", "Travel", "Bills", "Entertainment", "Other"];

  /**
   * Handles input changes and updates the corresponding field in the state.
   * @param {Event} e - The input change event.
   */
  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  /**
   * Handles form submission to add the expense.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate required fields
    if (!expense.amount || !expense.category || !expense.date) {
      alert("Amount, category, and date are required!"); // Show alert if any required field is missing
      return;
    }

    // Call the `onAdd` function (if provided) with the expense data and groupId
    onAdd?.({ ...expense, groupId });

    // Reset the form fields after submission
    setExpense({ amount: "", category: "", date: "", description: "" });
  };

  return (
    <div className="expense-container">
      <h4>Add Group Expense</h4>
      <form onSubmit={handleSubmit}>
        {/* Input for the expense amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
          required
          className="expense-input"
        />

        {/* Dropdown to select the expense category */}
        <select
          name="category"
          value={expense.category}
          onChange={handleChange}
          required
          className="expense-input"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Input for selecting the expense date */}
        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
          required
          className="expense-input"
        />

        {/* Input for adding an optional description */}
        <input
          type="text"
          name="description"
          placeholder="Description (optional)"
          value={expense.description}
          onChange={handleChange}
          className="expense-input"
        />

        {/* Button to submit the form */}
        <button type="submit" className="expense-button">
          Add Expense to Group
        </button>
      </form>
    </div>
  );
}

export default AddGroupExpense; // Export the component for use in other parts of the application
