import React, { useState, useEffect } from "react";
import { getExpenses, deleteExpense } from "../api/Expenses";
import ExpenseForm from "../components/ExpenseForm";
import "./PersonalExpenses.css";


const PersonalExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await getExpenses();
      setExpenses(res.data.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleComplete = () => {
    setEditingExpense(null);
    fetchExpenses();
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (err) {
        console.error("Error deleting expense:", err);
      }
    }
  };

  return (
    <div className="expenses-container">
      <h2>Personal Expenses</h2>
      <ExpenseForm onComplete={handleComplete} initialData={editingExpense || {}} />
      {expenses.length > 0 ? (
        <ul className="expenses-list">
          {expenses.map((expense) => (
            <li key={expense._id} className="expense-item">
              <span>{expense.amount} - {expense.category} - {expense.date.split("T")[0]} - {expense.description || "No description"}</span>
              <div className="expense-actions">
                <button onClick={() => handleEdit(expense)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(expense._id)} className="delete-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No expenses found.</p>
      )}
    </div>
  );
};

export default PersonalExpenses;
