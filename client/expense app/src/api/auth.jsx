import axios from "axios";

const API_URL = "http://localhost:5003/api/users";

export const getMe = () => axios.get(`${API_URL}/me`, { withCredentials: true });
