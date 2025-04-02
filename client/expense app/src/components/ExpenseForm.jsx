import { useState, useEffect } from "react";
import { addExpense, updateExpense } from "../api/Expenses";
import "./ExpenseForm.css";


const ExpenseForm = ({ onComplete, initialData = {} }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
  });

  const categories = ["Food", "Travel", "Bills", "Entertainment", "Other"];

  // Pre-fill form when editing
  useEffect(() => {
    if (initialData._id) {
      setExpense({
        category: initialData.category || "",
        amount: initialData.amount || "",
        description: initialData.description || "",
        date: initialData.date ? initialData.date.split("T")[0] : "", // Format for date input
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(expense).some((val) => !val)) {
      alert("All fields are required!");
      return;
    }

    try {
      if (initialData._id) {
        await updateExpense(initialData._id, expense);
        alert("Expense updated successfully");
      } else {
        await addExpense(expense);
        alert("Expense added successfully");
        setExpense({ category: "", amount: "", description: "", date: "" });
      }

      onComplete?.();
    } catch (error) {
      alert(`Failed to ${initialData._id ? "update" : "add"} expense`);
      console.error("Expense error:", error);
    }
  };

  return (
    <div className="expense-form">
      <h3>{initialData._id ? "Edit Expense" : "Add an Expense"}</h3>
      <form onSubmit={handleSubmit}>
        <select name="category" value={expense.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expense.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={expense.description}
          onChange={handleChange}
          required
        />
        <input type="date" name="date" value={expense.date} onChange={handleChange} required />
        <button type="submit">{initialData._id ? "Update" : "Submit"}</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
