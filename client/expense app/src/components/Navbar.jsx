// Import necessary dependencies from React and React Router
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Link is used for navigation, useNavigate is for programmatic navigation
import { useAuth } from "../context/AuthContext"; // Import the authentication context to manage user authentication
import "./Navbar.css"; // Import the CSS file for styling

// Navbar component for navigating through different sections of the app
const Navbar = () => {
  // Extract the logout function from the authentication context
  const { logout } = useAuth();
  // useNavigate hook provides a function to navigate programmatically
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    logout(); // Call the logout function to clear authentication data
    navigate("/login"); // Redirect user to the login page after logging out
  };

  return (
    <nav className="navbar">
      {/* Link components for navigating to different pages */}
      <Link to="/">Home</Link> 
      <Link to="/personal">Personal Expenses</Link> 
      <Link to="/groups">Groups</Link> 

      {/* Logout button to trigger the handleLogout function */}
      <button onClick={handleLogout}>Logout</button> 
    </nav>
  );
};

// Export the Navbar component to be used in other parts of the application
export default Navbar;
