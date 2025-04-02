import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe();
  }, []);

  // Fetch authenticated user
  const getMe = async () => {
    try {
      const res = await axios.get("http://localhost:5003/api/users/me", {
        withCredentials: true,
      });
      setUser(res?.data?.user || null);
      localStorage.setItem("user", JSON.stringify(res?.data?.user));
    } catch {
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (username, email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5003/api/users/register",
        { username, email, password },
        { withCredentials: true }
      );
      setUser(res?.data?.user);
      localStorage.setItem("user", JSON.stringify(res?.data?.user));
    } catch (err) {
      console.error("Registration failed:", err.response?.data?.message || err.message);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5003/api/users/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(res?.data?.user);
      localStorage.setItem("user", JSON.stringify(res?.data?.user));
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post("http://localhost:5003/api/users/logout", {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, getMe, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
