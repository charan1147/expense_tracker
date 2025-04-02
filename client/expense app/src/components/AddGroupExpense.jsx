import React, { useState } from "react";
import "./AddGroupExpense.css";



function AddGroupExpense({ groupId, onAdd }) {
  const [expense, setExpense] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const categories = ["Food", "Travel", "Bills", "Entertainment", "Other"];

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!expense.amount || !expense.category || !expense.date) {
      alert("Amount, category, and date are required!");
      return;
    }

    onAdd?.({ ...expense, groupId });

    setExpense({ amount: "", category: "", date: "", description: "" });
  };

  return (
    <div className="expense-container">
      <h4>Add Group Expense</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
          required
          className="expense-input"
        />
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
        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
          required
          className="expense-input"
        />
        <input
          type="text"
          name="description"
          placeholder="Description (optional)"
          value={expense.description}
          onChange={handleChange}
          className="expense-input"
        />
        <button type="submit" className="expense-button">
          Add Expense to Group
        </button>
      </form>
    </div>
  );
}

export default AddGroupExpense;
