import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; // Add Navigate
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PersonalExpenses from "./pages/PersonalExpenses";
import GroupExpenses from "./pages/GroupExpenses";
import CalculateExpenses from "./pages/CalculateExpenses";
import "./App.css"

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <div className="App">
        {user && <Navbar />}
        
        <Routes>
          {/* Root: Dashboard if logged in, AuthPage if not */}
          <Route path="/" element={user ? <Dashboard /> : <AuthPage />} />

          {/* Auth route for both login and register */}
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />

          {/* Protected routes: Redirect to /auth if not logged in */}
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

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;