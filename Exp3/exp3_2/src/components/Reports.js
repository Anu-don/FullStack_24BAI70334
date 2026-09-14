import React from "react";
import { Link } from "react-router-dom";

function Reports() {
  return (
    <div className="dashboard-card">
      <h2>Reports</h2>
      <p className="subtitle">Visible to Admins and Employees only.</p>
      <ul className="simple-list">
        <li>Weekly activity summary</li>
        <li>Monthly usage report</li>
        <li>Error / audit log</li>
      </ul>
      <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
    </div>
  );
}

export default Reports;