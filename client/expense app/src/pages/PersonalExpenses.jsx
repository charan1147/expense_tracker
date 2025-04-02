import React, { useState, useEffect } from "react";
import { getExpenses, deleteExpense } from "../api/Expenses"; // Import API functions for fetching and deleting expenses
import ExpenseForm from "../components/ExpenseForm"; // Import form component for adding/editing expenses
import "./PersonalExpenses.css"; // Import CSS for styling

const PersonalExpenses = () => {
  // State to store the list of expenses
  const [expenses, setExpenses] = useState([]);

  // State to track the expense being edited
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch expenses when the component mounts
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Function to fetch expenses from the API
  const fetchExpenses = async () => {
    try {
      const res = await getExpenses(); // Call API to get expenses
      setExpenses(res.data.data); // Update state with fetched expenses
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  // Function to reset editing state and refresh the expenses list after an update
  const handleComplete = () => {
    setEditingExpense(null);
    fetchExpenses();
  };

  // Function to set the expense to be edited
  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  // Function to delete an expense
  const handleDelete = async (id) => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id); // Call API to delete the expense
        fetchExpenses(); // Refresh the list after deletion
      } catch (err) {
        console.error("Error deleting expense:", err);
      }
    }
  };

  return (
    <div className="expenses-container">
      <h2>Personal Expenses</h2>

      {/* Render ExpenseForm component for adding/editing expenses */}
      <ExpenseForm onComplete={handleComplete} initialData={editingExpense || {}} />

      {/* Render list of expenses if there are any */}
      {expenses.length > 0 ? (
        <ul className="expenses-list">
          {expenses.map((expense) => (
            <li key={expense._id} className="expense-item">
              {/* Display expense details */}
              <span>
                {expense.amount} - {expense.category} - {expense.date.split("T")[0]} - 
                {expense.description || "No description"}
              </span>
              <div className="expense-actions">
                {/* Edit button */}
                <button onClick={() => handleEdit(expense)} className="edit-btn">
                  Edit
                </button>
                {/* Delete button */}
                <button onClick={() => handleDelete(expense._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses found.</p> // Message when no expenses are available
      )}
    </div>
  );
};

export default PersonalExpenses;
