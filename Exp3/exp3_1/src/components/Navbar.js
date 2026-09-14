import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, isAuthenticated, getDecodedToken } from "../services/authService";

const roleHome = (role) => {
  if (role === "Admin") return "/admin";
  if (role === "Employee") return "/employee";
  return "/user";
};

function Navbar({ setAuthState }) {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const decoded = getDecodedToken();

  const handleLogout = () => {
    logout();
    setAuthState(false);
    navigate("/");
  };

  return (
    <nav className="app-navbar">
      <div className="nav-brand">
        <span className="brand-icon">🔐</span>
        <span className="brand-text">MyApp</span>
      </div>

      <div className="nav-links">
        {!loggedIn ? (
          <>
            <Link to="/" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link btn-register">Register</Link>
          </>
        ) : (
          <>
            <Link to={roleHome(decoded?.role)} className="nav-link">Dashboard</Link>
            <span className={`role-badge role-${(decoded?.role || "user").toLowerCase()}`}>
              {decoded?.role || "User"}
            </span>
            <span className="user-name">{decoded?.name || "User"}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;