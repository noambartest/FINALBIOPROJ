import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPage.css"; // Import the CSS file

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const roles = ["admin", "user", "student", "donator"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/getAllUsers"
        );
        setUsers(response.data.users);

        // Set the first user as the selected user and initialize the role
        if (response.data.users.length > 0) {
          const firstUser = response.data.users[0];
          setSelectedUser(firstUser);
          setSelectedRole(firstUser.role);
        }
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    fetchUsers();
  }, []);

  const onUserChange = (event) => {
    const currentUser = users.find((user) => user.ID === event.target.value);
    setSelectedUser(currentUser);
    setSelectedRole(currentUser.role); // Update the selected role when the user changes
  };

  const onRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const saveRoleChange = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:5000/api/users/updateRole",
        {
          userId: selectedUser.ID,
          role: selectedRole,
        }
      );

      if (response.status === 200) {
        console.log(`Role of ${selectedUser.name} updated to ${selectedRole}`);
        alert("Role updated successfully!");
      } else {
        console.error("Failed to update the role");
        alert("Failed to update the role. Please try again.");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("There was an error updating the role. Please try again.");
    }
  };

  return (
    <div className="admin-page">
      <h1 className="admin-header">Admin Panel</h1>
      <div className="dropdown-container">
        <label htmlFor="userSelect" className="dropdown-label">
          Select User:
        </label>
        <select
          id="userSelect"
          className="styled-select"
          onChange={onUserChange}
          value={selectedUser ? selectedUser.ID : ""}
        >
          {users.map((user) => (
            <option key={user.ID} value={user.ID}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      {selectedUser && (
        <div className="user-details">
          <h2>Update Role:</h2>
          <select
            id="roleSelect"
            className="styled-select"
            value={selectedRole}
            onChange={onRoleChange}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button className="save-button" onClick={saveRoleChange}>
            Save Role
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
