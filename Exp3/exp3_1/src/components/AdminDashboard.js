import React from "react";
import { getDecodedToken } from "../services/authService";

function AdminDashboard() {
  const user = getDecodedToken();

  return (
    <div className="dash-card role-admin">
      <div className="dash-role-tag">Admin</div>
      <h2>Welcome, {user?.name || "Admin"}</h2>
      <p className="dash-email">{user?.email}</p>

      <div className="dash-section">
        <h3>Admin Tools</h3>
        <ul className="dash-list">
          <li>Manage users and roles</li>
          <li>View system activity logs</li>
          <li>Configure application settings</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;