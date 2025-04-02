import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const PersonalExpensesContext = createContext();

export const PersonalExpensesProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Fetch personal expenses
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/personal-expenses", {
        withCredentials: true,
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new expense
  const addExpense = async (title, amount, date) => {
    try {
      const res = await axios.post(
        "http://localhost:5003/api/personal-expenses",
        { title, amount, date },
        { withCredentials: true }
      );
      setExpenses([...expenses, res.data]);
    } catch (err) {
      console.error("Error adding expense:", err.response?.data?.message || err.message);
    }
  };

  // Update an existing expense
  const updateExpense = async (id, updatedExpense) => {
    try {
      const res = await axios.put(
        `http://localhost:5003/api/personal-expenses/${id}`,
        updatedExpense,
        { withCredentials: true }
      );
      setExpenses(expenses.map((expense) => (expense._id === id ? res.data : expense)));
    } catch (err) {
      console.error("Error updating expense:", err.response?.data?.message || err.message);
    }
  };

  // Delete an expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5003/api/personal-expenses/${id}`, {
        withCredentials: true,
      });
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err.response?.data?.message || err.message);
    }
  };

  return (
    <PersonalExpensesContext.Provider value={{ expenses, fetchExpenses, addExpense, updateExpense, deleteExpense, loading }}>
      {children}
    </PersonalExpensesContext.Provider>
  );
};

export const usePersonalExpenses = () => useContext(PersonalExpensesContext);
