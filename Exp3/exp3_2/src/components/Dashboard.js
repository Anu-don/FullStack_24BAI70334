import React from "react";
import { Link } from "react-router-dom";
import { getDecodedToken } from "../services/authService";
import { PERMISSIONS, hasPermission } from "../utils/permissions";

function Dashboard() {
  const user = getDecodedToken();
  const role = user?.role;

  return (
    <div className="dashboard-card">
      <h2>Welcome, {user?.name}</h2>
      <p className="subtitle">
        Signed in as <strong>{role}</strong> — {user?.email}
      </p>

      <div className="tile-grid">
        {/* Every role can see this — VIEW_DASHBOARD is granted to all roles */}
        <div className="tile">
          <h3>My Profile</h3>
          <p>View your account details.</p>
        </div>

        {/* Only rendered if the role has VIEW_REPORTS */}
        {hasPermission(role, PERMISSIONS.VIEW_REPORTS) && (
          <Link to="/reports" className="tile tile-link">
            <h3>Reports</h3>
            <p>View analytics and activity reports.</p>
          </Link>
        )}

        {/* Only rendered if the role has EDIT_CONTENT */}
        {hasPermission(role, PERMISSIONS.EDIT_CONTENT) && (
          <div className="tile">
            <h3>Content Editor</h3>
            <p>Create and edit shared content.</p>
          </div>
        )}

        {/* Only rendered if the role has MANAGE_USERS */}
        {hasPermission(role, PERMISSIONS.MANAGE_USERS) && (
          <Link to="/manage-users" className="tile tile-link">
            <h3>Manage Users</h3>
            <p>Add, edit, or remove user accounts.</p>
          </Link>
        )}

        {/* Only rendered if the role has MANAGE_SETTINGS */}
        {hasPermission(role, PERMISSIONS.MANAGE_SETTINGS) && (
          <Link to="/settings" className="tile tile-link">
            <h3>System Settings</h3>
            <p>Configure application-wide settings.</p>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Dashboard;