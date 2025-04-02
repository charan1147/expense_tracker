import React, { useState, useEffect } from "react"; // Import React and hooks for managing state and side effects
import { createGroup, getGroups, addGroupExpense, getGroupExpenses, deleteGroup } from "../api/api"; // Import API functions for group operations
import GroupForm from "../components/GroupForm"; // Import the form component for creating groups
import AddGroupExpense from "../components/AddGroupExpense"; // Import the component for adding group expenses
import { useAuth } from "../context/AuthContext"; // Import authentication context to get the logged-in user
import { Link } from "react-router-dom"; // Import Link for navigation
import "./GroupExpenses.css"; // Import styles for the component

function GroupExpenses() {
  // State to store the list of groups
  const [groups, setGroups] = useState([]);

  // State to track the currently selected group
  const [selectedGroup, setSelectedGroup] = useState(null);

  // State to store the expenses of the selected group
  const [groupExpenses, setGroupExpenses] = useState([]);

  // State to store details of the selected group (name, members, etc.)
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);

  // Get the logged-in user from the authentication context
  const { user } = useAuth();

  // Fetch groups when the user is available
  useEffect(() => {
    if (user) fetchGroups();
  }, [user]);

  // Function to fetch all groups from the API
  const fetchGroups = async () => {
    try {
      const res = await getGroups(); // Fetch groups from API
      console.log("Groups fetched:", res.data.data);
      setGroups(res.data.data); // Update state with fetched groups
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  // Function to handle the creation of a new group
  const handleCreateGroup = async (data) => {
    try {
      await createGroup(data); // Send request to create a group
      fetchGroups(); // Refresh the group list after creation
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  // Function to delete a group
  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await deleteGroup(groupId); // Send delete request to API
        fetchGroups(); // Refresh the group list after deletion

        // If the deleted group was selected, reset selection
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

  // Function to fetch expenses of a selected group
  const fetchGroupExpenses = async (groupId) => {
    try {
      const res = await getGroupExpenses(groupId); // Fetch group expenses from API
      console.log("Expenses response:", res.data.data);

      // Find the selected group details
      const group = groups.find(g => g._id === groupId);
      console.log("Selected group details:", group);

      setSelectedGroupDetails(group); // Store group details
      setGroupExpenses(res.data.data); // Store fetched expenses
      setSelectedGroup(groupId); // Set the selected group
    } catch (err) {
      console.error("Error fetching group expenses:", err);
    }
  };

  // Function to add an expense to the selected group
  const handleAddGroupExpense = async (data) => {
    try {
      await addGroupExpense(selectedGroup, data); // Send API request to add expense
      fetchGroupExpenses(selectedGroup); // Refresh expense list
    } catch (err) {
      console.error("Error adding group expense:", err);
      alert(err.response?.data?.message || "Failed to add group expense");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Groups</h2>

      {/* Group creation form */}
      <GroupForm onSubmit={handleCreateGroup} />

      <h3>Your Groups</h3>
      <ul>
        {/* Render list of groups */}
        {groups.map(group => (
          <li key={group._id}>
            {group.name} - {group.description || "No description"}

            {/* Button to view expenses of the selected group */}
            <button onClick={() => fetchGroupExpenses(group._id)} style={{ marginLeft: "10px" }}>
              View Expenses
            </button>

            {/* Button to delete a group */}
            <button
              onClick={() => handleDeleteGroup(group._id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Render group details and expenses if a group is selected */}
      {selectedGroup && selectedGroupDetails && (
        <>
          <h3>Expenses for {selectedGroupDetails.name}</h3>

          {/* Display group members */}
          <div>
            <h4>Group Members:</h4>
            <ul>
              {[...new Set(selectedGroupDetails.members.map(m => m._id))].map(uniqueId => {
                const member = selectedGroupDetails.members.find(m => m._id === uniqueId);
                return <li key={uniqueId}>{member.username}</li>;
              })}
            </ul>
          </div>

          {/* Form to add an expense to the selected group */}
          <AddGroupExpense groupId={selectedGroup} onAdd={handleAddGroupExpense} />

          {/* Display list of group expenses */}
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

          {/* Button to navigate to the expense calculation page */}
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
