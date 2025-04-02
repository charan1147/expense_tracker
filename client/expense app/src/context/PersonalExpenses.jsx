import React, { createContext, useState, useEffect, useContext } from "react"; 
// Importing necessary React hooks and functions for creating and managing context.

import axios from "axios"; 
// Importing Axios for making HTTP requests to the backend.

const PersonalExpensesContext = createContext(); 
// Creating a new context for managing personal expenses.

export const PersonalExpensesProvider = ({ children }) => { 
// Defining a provider component that will wrap around other components 
// and provide access to personal expenses data.

  const [expenses, setExpenses] = useState([]); 
  // State to store the list of personal expenses.

  const [loading, setLoading] = useState(true); 
  // State to track whether data is being fetched.

  useEffect(() => { 
    fetchExpenses(); 
  }, []); 
  // useEffect runs once when the component mounts to fetch expenses from the server.

  // Function to fetch personal expenses from the backend.
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/personal-expenses", {
        withCredentials: true, 
        // Ensuring credentials (such as cookies) are sent with the request.
      });
      setExpenses(res.data); 
      // Updating the state with fetched expenses.
    } catch (err) {
      console.error("Error fetching expenses:", err.response?.data?.message || err.message);
      // Logging any errors that occur during the API call.
    } finally {
      setLoading(false); 
      // Marking loading as false after fetching data.
    }
  };

  // Function to add a new personal expense.
  const addExpense = async (title, amount, date) => {
    try {
      const res = await axios.post(
        "http://localhost:5003/api/personal-expenses", 
        { title, amount, date }, 
        { withCredentials: true } 
        // Sending request with necessary credentials.
      );
      setExpenses([...expenses, res.data]); 
      // Updating the state by adding the new expense to the list.
    } catch (err) {
      console.error("Error adding expense:", err.response?.data?.message || err.message);
      // Logging any errors that occur.
    }
  };

  // Function to update an existing expense.
  const updateExpense = async (id, updatedExpense) => {
    try {
      const res = await axios.put(
        `http://localhost:5003/api/personal-expenses/${id}`, 
        updatedExpense, 
        { withCredentials: true } 
        // Ensuring credentials are sent with the request.
      );
      setExpenses(expenses.map((expense) => (expense._id === id ? res.data : expense))); 
      // Updating the state by replacing the updated expense.
    } catch (err) {
      console.error("Error updating expense:", err.response?.data?.message || err.message);
      // Logging errors in case of failure.
    }
  };

  // Function to delete an expense.
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5003/api/personal-expenses/${id}`, {
        withCredentials: true, 
        // Ensuring credentials are included in the request.
      });
      setExpenses(expenses.filter((expense) => expense._id !== id)); 
      // Removing the deleted expense from the state.
    } catch (err) {
      console.error("Error deleting expense:", err.response?.data?.message || err.message);
      // Logging errors in case of failure.
    }
  };

  return (
    <PersonalExpensesContext.Provider 
      value={{ expenses, fetchExpenses, addExpense, updateExpense, deleteExpense, loading }} 
    >
      {children} 
      {/* Rendering child components inside the provider */}
    </PersonalExpensesContext.Provider>
  );
};

export const usePersonalExpenses = () => useContext(PersonalExpensesContext); 
// Custom hook to allow other components to easily access the context.
