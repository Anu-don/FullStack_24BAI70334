import React from "react";
import { Link } from "react-router-dom";

function ManageUsers() {
  const users = JSON.parse(localStorage.getItem("rbac_users") || "[]");

  return (
    <div className="dashboard-card">
      <h2>Manage Users</h2>
      <p className="subtitle">Visible to Admins only.</p>

      {users.length === 0 ? (
        <p>No registered users yet.</p>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.email}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
    </div>
  );
}

export default ManageUsers;