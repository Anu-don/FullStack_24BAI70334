import React from "react";
import { Link } from "react-router-dom";

function Settings() {
  return (
    <div className="dashboard-card">
      <h2>System Settings</h2>
      <p className="subtitle">Visible to Admins only.</p>
      <ul className="simple-list">
        <li>Application name and branding</li>
        <li>Session timeout duration</li>
        <li>Role & permission configuration</li>
      </ul>
      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
    </div>
  );
}

export default Settings;