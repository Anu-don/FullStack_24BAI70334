import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getDecodedToken, logout } from "../services/authService";
import { PERMISSIONS, hasPermission } from "../utils/permissions";

function Navbar({ setAuthState }) {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const user = getDecodedToken();
  const role = user?.role;

  const handleLogout = () => {
    logout();
    setAuthState(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <span className="brand">RBAC Demo</span>

      <div className="nav-links">
        {!loggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link>

            {/* Each link only renders if the role actually has the permission */}
            {hasPermission(role, PERMISSIONS.VIEW_REPORTS) && <Link to="/reports">Reports</Link>}
            {hasPermission(role, PERMISSIONS.MANAGE_USERS) && <Link to="/manage-users">Manage Users</Link>}
            {hasPermission(role, PERMISSIONS.MANAGE_SETTINGS) && <Link to="/settings">Settings</Link>}

            <span className={`role-tag role-${role?.toLowerCase()}`}>{role}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
