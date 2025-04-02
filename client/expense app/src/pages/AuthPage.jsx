// Import necessary dependencies from React and React Router
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import authentication context
import { useNavigate, Link } from "react-router-dom"; // Import navigation utilities
import "./AuthPage.css"; // Import CSS for styling

// AuthPage component handles user registration and login
const AuthPage = () => {
  // State for registering a new user
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
  const [registerError, setRegisterError] = useState(""); // State for handling registration errors
  
  // State for logging in an existing user
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // State for handling login errors
  
  // State to toggle between register and login form
  const [activeForm, setActiveForm] = useState("register"); 

  // Get authentication functions from AuthContext
  const { register, login } = useAuth();
  
  // useNavigate hook for redirecting users after successful login or registration
  const navigate = useNavigate();

  // Handler to update register form state when input changes
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // Handler for submitting the registration form
  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    setRegisterError(""); // Reset error state before submitting

    try {
      // Call the register function from AuthContext
      await register(registerData.username, registerData.email, registerData.password);
      console.log("Registration successful, navigating to home page");
      navigate("/"); // Redirect to home page after successful registration
    } catch (err) {
      // Handle errors and display error message
      const errorMessage = err.response?.data?.message || "Registration failed";
      setRegisterError(errorMessage);
      console.error("Registration error:", err.response || err);
    }
  };

  // Handler for submitting the login form
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    setLoginError(""); // Reset error state before submitting

    try {
      // Call the login function from AuthContext
      await login(loginEmail, loginPassword);
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      // Handle errors and display error message
      setLoginError(err.response?.data?.message || "Login failed");
    }
  };

  // Function to toggle between Register and Login forms
  const toggleForm = () => {
    setActiveForm(activeForm === "register" ? "login" : "register");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Registration Form */}
        <div className={`auth-form register ${activeForm === "register" ? "active" : ""}`}>
          <h2>Register</h2>
          {/* Show error message if registration fails */}
          {registerError && <p className="error-text">{registerError}</p>}
          <form onSubmit={handleRegisterSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={registerData.username}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerData.password}
              onChange={handleRegisterChange}
              autoComplete="new-password"
              required
            />
            <button type="submit">Register</button>
          </form>
          {/* Toggle to Login Form */}
          <p onClick={toggleForm} className="toggle-link">
            Already have an account? Click to Login
          </p>
        </div>

        {/* Login Form */}
        <div className={`auth-form login ${activeForm === "login" ? "active" : ""}`}>
          <h2>Login</h2>
          {/* Show error message if login fails */}
          {loginError && <p className="error-text">{loginError}</p>}
          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
          {/* Toggle to Register Form */}
          <p onClick={toggleForm} className="toggle-link">
            Don't have an account? Click to Register
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; // Export component for use in other parts of the application
