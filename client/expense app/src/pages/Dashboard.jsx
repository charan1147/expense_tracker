// Import necessary dependencies
import React from "react"; // Import React to create the component
import { Link } from "react-router-dom"; // Import Link to navigate between pages without reloading
import { useAuth } from "../context/AuthContext"; // Import the authentication context to access the logged-in user
import "./Dashboard.css"; // Import the CSS file for styling

// Define the Dashboard component
const Dashboard = () => {
  // Get the logged-in user from the authentication context
  const { user } = useAuth();

  return (
    // Main container for the dashboard
    <div className="container">
      {/* Display a welcome message, using the username if available, otherwise default to "User" */}
      <h1>Welcome, {user?.username || "User"}!</h1>

      {/* Display a short description of the dashboard */}
      <p>This is your expense tracker dashboard. Choose an option below:</p>

      {/* Container for the action buttons */}
      <div>
        <div className="container1">
          {/* Link to the Personal Expenses page */}
          <Link to="/personal">
            <button>Manage Personal Expenses</button>
          </Link>
        </div>

        <div className="container2">
          {/* Link to the Groups page for managing shared expenses */}
          <Link to="/groups">
            <button>Manage Groups</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Export the Dashboard component so it can be used in other parts of the application
export default Dashboard;
