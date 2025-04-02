import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getGroupDetails, calculateSplit } from "../api/group";
import "./CalculateExpenses.css";


const CalculateExpenses = () => {
  const { groupId } = useParams();
  const [groupName, setGroupName] = useState("");
  const [split, setSplit] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        const res = await getGroupDetails(groupId);
        setGroupName(res.data.data?.name || res.data.name || "Group");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load group data");
      }
    };

    if (groupId?.length === 24) fetchGroupName();
    else setError("Invalid group ID");
  }, [groupId]);

  const handleCalculateSplit = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await calculateSplit(groupId);
      setSplit(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to calculate split");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  return (
    <div className="calculate-expenses">
      <h2>Calculate Expenses for {groupName}</h2>
      
      <button className="calculate-button" onClick={handleCalculateSplit} disabled={loading}>
        🧮 {loading ? "Calculating..." : "Calculate Expenses"}
      </button>

      {error && <p className="error">{error}</p>}

      {split.length > 0 && (
        <div className="split-results">
          <h3>Split Results:</h3>
          {split.map(({ expenseId, description, payer, totalAmount, debts }, index) => (
            <div key={expenseId || index} className="expense-card">
              <p>
                <strong>{description}</strong> - Paid by {payer}: ${totalAmount.toFixed(2)}
              </p>
              <ul>
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

export default CalculateExpenses;
