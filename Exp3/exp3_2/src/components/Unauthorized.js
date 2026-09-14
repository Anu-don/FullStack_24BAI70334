import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="auth-card center-text">
      <h2>403 — Access Denied</h2>
      <p className="subtitle">
        Your account doesn't have permission to view this page.
      </p>
      <Link to="/dashboard" className="btn-primary btn-link">
        Back to Dashboard
      </Link>
    </div>
  );
}

export default Unauthorized;