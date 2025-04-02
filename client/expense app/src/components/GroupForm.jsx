// Import React and necessary hooks
import React, { useState } from "react";
import "./GroupForm.css"; // Import the CSS file for styling

// GroupForm component for creating a new group
// It receives 'onSubmit' as a prop, which is a function to handle form submission
const GroupForm = ({ onSubmit }) => {
  // State for group name input
  const [name, setName] = useState("");
  // State for group description input
  const [description, setDescription] = useState("");
  // State for tracking the current member input (text field)
  const [memberInput, setMemberInput] = useState("");
  // State for storing the list of added members
  const [members, setMembers] = useState([]);

  // Function to add a member to the list when the "Add" button is clicked
  const handleAddMember = () => {
    // Ensure the input is not empty or just spaces
    if (memberInput.trim()) {
      setMembers([...members, memberInput.trim()]); // Add the member to the array
      setMemberInput(""); // Clear the input field after adding
    }
  };

  // Function to remove a member from the list based on its index
  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index)); // Remove the member at the specified index
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh on form submission

    // Call the onSubmit function passed as a prop, sending the group data
    onSubmit({ name, description, members });

    // Reset all input fields after submission
    setName("");
    setDescription("");
    setMembers([]);
    setMemberInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="group-form">
      {/* Input field for group name */}
      <input
        type="text"
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required // Makes this field mandatory
      />

      {/* Input field for group description */}
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Input section for adding members */}
      <div className="member-input">
        <input
          type="text"
          placeholder="Add member (username or email)"
          value={memberInput}
          onChange={(e) => setMemberInput(e.target.value)}
        />
        <button type="button" onClick={handleAddMember}>
          Add
        </button>
      </div>

      {/* Display the list of added members, if any */}
      {members.length > 0 && (
        <ul className="member-list">
          {members.map((member, index) => (
            <li key={index}>
              {member}
              {/* Remove button for each member */}
              <button type="button" onClick={() => handleRemoveMember(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Submit button to create the group */}
      <button type="submit">Create Group</button>
    </form>
  );
};

// Export the GroupForm component so it can be used in other parts of the application
export default GroupForm;
