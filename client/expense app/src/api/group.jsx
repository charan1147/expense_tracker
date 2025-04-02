import axios from "axios";

const API_URL = "http://localhost:5003/api/groups";

export const createGroup = (groupData) => axios.post(API_URL, groupData, { withCredentials: true });
export const updateGroup = (groupId, groupData) => axios.put(`${API_URL}/${groupId}`, groupData, { withCredentials: true });
export const deleteGroup = (groupId) => axios.delete(`${API_URL}/${groupId}`, { withCredentials: true });
export const addGroupExpense = (groupId, expenseData) => axios.post(`${API_URL}/${groupId}/expenses`, expenseData, { withCredentials: true });
export const getGroupExpenses = (groupId) => axios.get(`${API_URL}/${groupId}/expenses`, { withCredentials: true });
export const getAllGroups = () => axios.get(API_URL, { withCredentials: true });
export const calculateSplit = (groupId) => axios.get(`${API_URL}/${groupId}/split`, { withCredentials: true });
export const getGroupDetails = (groupId) => axios.get(`${API_URL}/${groupId}`, { withCredentials: true });
 