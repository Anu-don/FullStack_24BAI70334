import React from "react";
import { getDecodedToken } from "../services/authService";

function UserDashboard() {
  const user = getDecodedToken();

  return (
    <div className="dash-card role-user">
      <div className="dash-role-tag">User</div>
      <h2>Welcome, {user?.name || "User"}</h2>
      <p className="dash-email">{user?.email}</p>

      <div className="dash-section">
        <h3>Your Account</h3>
        <ul className="dash-list">
          <li>View your profile</li>
          <li>Update your preferences</li>
          <li>Check your recent activity</li>
        </ul>
      </div>
    </div>
  );
}

export default UserDashboard;