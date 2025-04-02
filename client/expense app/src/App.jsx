import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; // Import necessary routing components
import { useAuth } from "./context/AuthContext"; // Import authentication context
import Navbar from "./components/Navbar"; // Import Navbar component
import AuthPage from "./pages/AuthPage"; // Import authentication page (Login/Register)
import Dashboard from "./pages/Dashboard"; // Import Dashboard page
import PersonalExpenses from "./pages/PersonalExpenses"; // Import Personal Expenses page
import GroupExpenses from "./pages/GroupExpenses"; // Import Group Expenses page
import CalculateExpenses from "./pages/CalculateExpenses"; // Import Expense Calculation page
import "./App.css"; // Import global styles

function App() {
  // Get authentication state (user) and loading state from AuthContext
  const { user, loading } = useAuth();

  // Show loading indicator while authentication state is being determined
  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="App">
        {/* Show Navbar only if the user is logged in */}
        {user && <Navbar />}
        
        <Routes>
          {/* 
            If user is logged in, show the Dashboard.
            If not, redirect to the AuthPage (Login/Register). 
          */}
          <Route path="/" element={user ? <Dashboard /> : <AuthPage />} />

          {/* 
            Auth Route:
            If user is NOT logged in, show AuthPage.
            If user is logged in, redirect to the dashboard.
          */}
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />

          {/* 
            Protected Routes:
            If user is logged in, allow access to personal and group expenses pages.
            If not logged in, redirect to the AuthPage.
          */}
          <Route
            path="/personal"
            element={user ? <PersonalExpenses /> : <Navigate to="/auth" />}
          />
          <Route
            path="/groups"
            element={user ? <GroupExpenses /> : <Navigate to="/auth" />}
          />
          <Route
            path="/groups/:groupId/calculate"
            element={user ? <CalculateExpenses /> : <Navigate to="/auth" />}
          />

          {/* 
            Catch-all route:
            Redirects any undefined route to the dashboard (if logged in) or auth page (if not logged in).
          */}
          <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
