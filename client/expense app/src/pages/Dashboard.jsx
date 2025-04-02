import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";


const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container">
      <h1>Welcome, {user?.username || "User"}!</h1>
      <p>This is your expense tracker dashboard. Choose an option below:</p>

      <div>
        <div className="container1">
        <Link to="/personal">
          <button>Manage Personal Expenses</button>
        </Link>

        </div>
       <div className="container2">
        <Link to="/groups">
          <button>Manage Groups</button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
