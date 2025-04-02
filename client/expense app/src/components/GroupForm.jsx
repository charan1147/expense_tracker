import React, { useState } from "react";
import "./GroupForm.css";


const GroupForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);

  const handleAddMember = () => {
    if (memberInput.trim()) {
      setMembers([...members, memberInput.trim()]);
      setMemberInput("");
    }
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, members });
    setName("");
    setDescription("");
    setMembers([]);
    setMemberInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="group-form">
      <input
        type="text"
        placeholder="Group Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
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
      {members.length > 0 && (
        <ul className="member-list">
          {members.map((member, index) => (
            <li key={index}>
              {member}
              <button type="button" onClick={() => handleRemoveMember(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <button type="submit">Create Group</button>
    </form>
  );
};

export default GroupForm;
