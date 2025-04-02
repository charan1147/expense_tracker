import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./AuthPage.css"; // Import CSS

const AuthPage = () => {
  // Register state
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "" });
  const [registerError, setRegisterError] = useState("");
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Toggle state
  const [activeForm, setActiveForm] = useState("register"); 

  const { register, login } = useAuth();
  const navigate = useNavigate();

  // Register handlers
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError("");
    try {
      await register(registerData.username, registerData.email, registerData.password);
      console.log("Registration successful, navigating to /");
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setRegisterError(errorMessage);
      console.error("Registration error:", err.response || err);
    }
  };

  // Login handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      await login(loginEmail, loginPassword);
      navigate("/");
    } catch (err) {
      setLoginError(err.response?.data?.message || "Login failed");
    }
  };

  // Toggle between forms
  const toggleForm = () => {
    setActiveForm(activeForm === "register" ? "login" : "register");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className={`auth-form register ${activeForm === "register" ? "active" : ""}`}>
          <h2>Register</h2>
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
          <p onClick={toggleForm} className="toggle-link">
            Already have an account? Click to Login
          </p>
        </div>

        {/* Login Form (Right) */}
        <div className={`auth-form login ${activeForm === "login" ? "active" : ""}`}>
          <h2>Login</h2>
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
          <p onClick={toggleForm} className="toggle-link">
            Don't have an account? Click to Register
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;