import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5003/api",
  withCredentials: true,
});

export const addPersonalExpense = (data) => api.post("/expenses", data);
export const getPersonalExpenses = () => api.get("/expenses");
export const getExpenseById = (id) => api.get(`/expenses/${id}`);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export const createGroup = (data) => api.post("/groups", data);
export const getGroups = () => api.get("/groups");
export const deleteGroup = (groupId) => api.delete(`/groups/${groupId}`); // Added delete function
export const addGroupExpense = (groupId, data) => api.post(`/groups/${groupId}/expenses`, data);
export const getGroupExpenses = (groupId) => api.get(`/groups/${groupId}/expenses`);
export const getCurrentUser = () => api.get("/users/me")
export const getGroupDetails = (groupId) => axios.get(`${API_URL}/${groupId}`, { withCredentials: true });

export default api;