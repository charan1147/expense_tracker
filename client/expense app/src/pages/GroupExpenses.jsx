import React, { useState, useEffect } from "react";
import { createGroup, getGroups, addGroupExpense, getGroupExpenses, deleteGroup } from "../api/api";
import GroupForm from "../components/GroupForm";
import AddGroupExpense from "../components/AddGroupExpense";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./GroupExpenses.css";

function GroupExpenses() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      console.log("Groups fetched:", res.data.data);
      setGroups(res.data.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const handleCreateGroup = async (data) => {
    try {
      await createGroup(data);
      fetchGroups();
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await deleteGroup(groupId);
        fetchGroups();
        if (selectedGroup === groupId) {
          setSelectedGroup(null);
          setSelectedGroupDetails(null);
        }
      } catch (err) {
        console.error("Error deleting group:", err);
        alert(err.response?.data?.message || "Failed to delete group");
      }
    }
  };

  const fetchGroupExpenses = async (groupId) => {
    try {
      const res = await getGroupExpenses(groupId);
      console.log("Expenses response:", res.data.data); // Debug
      const group = groups.find(g => g._id === groupId);
      console.log("Selected group details:", group);
      setSelectedGroupDetails(group);
      setGroupExpenses(res.data.data);
      setSelectedGroup(groupId);
    } catch (err) {
      console.error("Error fetching group expenses:", err);
    }
  };

  const handleAddGroupExpense = async (data) => {
    try {
      await addGroupExpense(selectedGroup, data);
      fetchGroupExpenses(selectedGroup);
    } catch (err) {
      console.error("Error adding group expense:", err);
      alert(err.response?.data?.message || "Failed to add group expense");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Groups</h2>
      <GroupForm onSubmit={handleCreateGroup} />
      <h3>Your Groups</h3>
      <ul>
        {groups.map(group => (
          <li key={group._id}>
            {group.name} - {group.description || "No description"}
            <button onClick={() => fetchGroupExpenses(group._id)} style={{ marginLeft: "10px" }}>
              View Expenses
            </button>
            <button
              onClick={() => handleDeleteGroup(group._id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {selectedGroup && selectedGroupDetails && (
        <>
          <h3>Expenses for {selectedGroupDetails.name}</h3>
          <div>
            <h4>Group Members:</h4>
            <ul>
              {[...new Set(selectedGroupDetails.members.map(m => m._id))].map(uniqueId => {
                const member = selectedGroupDetails.members.find(m => m._id === uniqueId);
                return <li key={uniqueId}>{member.username}</li>;
              })}
            </ul>
          </div>
          <AddGroupExpense groupId={selectedGroup} onAdd={handleAddGroupExpense} />
          <ul>
            {groupExpenses.map(expense => (
              <li key={expense._id}>
                {expense.amount} - {expense.category} - {expense.date.split("T")[0]} - 
                {expense.description || "No description"} - 
                <strong>Paid by: {expense.userId?.username || "Unknown"}</strong>
              </li>
            ))}
          </ul>
          {console.log("Selected groupId for link:", selectedGroup)}
          <Link to={`/groups/${selectedGroup}/calculate`} style={{ marginTop: "10px", display: "inline-block" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span role="img" aria-label="calculator">🧮</span> Calculate Expenses
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

export default GroupExpenses;