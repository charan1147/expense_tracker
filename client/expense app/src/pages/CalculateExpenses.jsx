// Import necessary dependencies from React and React Router
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom"; // Hook to get dynamic group ID from the URL
import { getGroupDetails, calculateSplit } from "../api/group"; // Import API functions
import "./CalculateExpenses.css"; // Import CSS for styling

// Component to calculate and display expense splits for a group
const CalculateExpenses = () => {
  // Get the `groupId` from the URL parameters
  const { groupId } = useParams();

  // State to store the group's name
  const [groupName, setGroupName] = useState("");

  // State to store the split details after calculation
  const [split, setSplit] = useState([]);

  // State to store any error messages
  const [error, setError] = useState(null);

  // State to track loading status while fetching data
  const [loading, setLoading] = useState(false);

  // Fetch group details (such as name) when the component mounts or when `groupId` changes
  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        // API call to get group details
        const res = await getGroupDetails(groupId);

        // Extract and set the group name (handling different response formats)
        setGroupName(res.data.data?.name || res.data.name || "Group");
      } catch (err) {
        // Handle API error and set an appropriate error message
        setError(err.response?.data?.message || "Failed to load group data");
      }
    };

    // Ensure `groupId` is a valid MongoDB ObjectId (24-character string) before making the request
    if (groupId?.length === 24) fetchGroupName();
    else setError("Invalid group ID");
  }, [groupId]);

  // Function to calculate how expenses are split among group members
  const handleCalculateSplit = useCallback(async () => {
    setError(null); // Reset error state before making the request
    setLoading(true); // Set loading state to true

    try {
      // API call to calculate expense splits
      const res = await calculateSplit(groupId);

      // Store the split calculation result in state
      setSplit(res.data.data || []);
    } catch (err) {
      // Handle errors and set appropriate error message
      setError(err.response?.data?.message || "Failed to calculate split");
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  }, [groupId]); // Dependency: Runs only when `groupId` changes

  return (
    <div className="calculate-expenses">
      {/* Display group name */}
      <h2>Calculate Expenses for {groupName}</h2>
      
      {/* Button to trigger expense calculation */}
      <button className="calculate-button" onClick={handleCalculateSplit} disabled={loading}>
        🧮 {loading ? "Calculating..." : "Calculate Expenses"}
      </button>

      {/* Display any error messages */}
      {error && <p className="error">{error}</p>}

      {/* Display split results only if data is available */}
      {split.length > 0 && (
        <div className="split-results">
          <h3>Split Results:</h3>
          {split.map(({ expenseId, description, payer, totalAmount, debts }, index) => (
            <div key={expenseId || index} className="expense-card">
              <p>
                <strong>{description}</strong> - Paid by {payer}: ${totalAmount.toFixed(2)}
              </p>
              <ul>
                {/* List out who owes how much to whom */}
                {debts.map(({ username, owes }) => (
                  <li key={username}>
                    {username} owes {payer}: ${owes.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalculateExpenses; // Export the component for use in the app
