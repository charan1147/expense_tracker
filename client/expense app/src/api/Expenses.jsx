import axios from "axios";

const API_URL = "http://localhost:5003/api/expenses";

export const addExpense = (expenseData) => axios.post(API_URL, expenseData, { withCredentials: true });
export const getExpenses = () => axios.get(API_URL, { withCredentials: true });
export const getExpenseById = (id) => axios.get(`${API_URL}/${id}`, { withCredentials: true });
export const updateExpense = (id, expenseData) => axios.put(`${API_URL}/${id}`, expenseData, { withCredentials: true });
export const deleteExpense = (id) => axios.delete(`${API_URL}/${id}`, { withCredentials: true });
