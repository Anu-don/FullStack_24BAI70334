import React from "react";
import { getDecodedToken } from "../services/authService";

function EmployeeDashboard() {
  const user = getDecodedToken();

  return (
    <div className="dash-card role-employee">
      <div className="dash-role-tag">Employee</div>
      <h2>Welcome, {user?.name || "Employee"}</h2>
      <p className="dash-email">{user?.email}</p>

      <div className="dash-section">
        <h3>Workspace</h3>
        <ul className="dash-list">
          <li>View assigned tasks</li>
          <li>Submit timesheets</li>
          <li>Check company announcements</li>
        </ul>
      </div>
    </div>
  );
}

export default EmployeeDashboard;