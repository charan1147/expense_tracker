// Import necessary dependencies from React and axios for API requests
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create an authentication context to manage user authentication state globally
const AuthContext = createContext();

// AuthProvider component wraps the application and provides authentication state and functions
export const AuthProvider = ({ children }) => {
  // State to store user data
  const [user, setUser] = useState(null);
  // State to track loading status while fetching user data
  const [loading, setLoading] = useState(true);

  // useEffect runs once when the component mounts to fetch the authenticated user
  useEffect(() => {
    getMe();
  }, []);

  // Function to fetch the authenticated user from the backend
  const getMe = async () => {
    try {
      // Send a GET request to fetch user details
      const res = await axios.get("http://localhost:5003/api/users/me", {
        withCredentials: true, // Ensures cookies are sent for authentication
      });

      // Update user state with the fetched user data (or null if not found)
      setUser(res?.data?.user || null);
      // Store user data in local storage for persistence
      localStorage.setItem("user", JSON.stringify(res?.data?.user));
    } catch {
      // If there's an error, reset user state and remove from local storage
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      // Set loading to false once the request is completed
      setLoading(false);
    }
  };

  // Function to register a new user
  const register = async (username, email, password) => {
    try {
      // Send a POST request to register a user
      const res = await axios.post(
        "http://localhost:5003/api/users/register",
        { username, email, password },
        { withCredentials: true } // Ensures authentication cookies are stored
      );

      // Set user state and store in local storage upon successful registration
      setUser(res?.data?.user);
      localStorage.setItem("user", JSON.stringify(res?.data?.user));
    } catch (err) {
      console.error("Registration failed:", err.response?.data?.message || err.message);
    }
  };

  // Function to log in an existing user
  const login = async (email, password) => {
    try {
      // Send a POST request to login endpoint with user credentials
      const res = await axios.post(
        "http://localhost:5003/api/users/login",
        { email, password },
        { withCredentials: true } // Ensures cookies are sent for authentication
      );

      // Set user state and store in local storage upon successful login
      setUser(res?.data?.user);
      localStorage.setItem("user", JSON.stringify(res?.data?.user));
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
    }
  };

  // Function to log out the user
  const logout = async () => {
    try {
      // Send a POST request to log out the user
      await axios.post("http://localhost:5003/api/users/logout", {}, { withCredentials: true });

      // Reset user state and remove user data from local storage
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    // Provide authentication-related values and functions to the entire application
    <AuthContext.Provider value={{ user, getMe, register, login, logout, loading }}>
      {children} {/* Render all child components */}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access authentication context in components
export const useAuth = () => useContext(AuthContext);
