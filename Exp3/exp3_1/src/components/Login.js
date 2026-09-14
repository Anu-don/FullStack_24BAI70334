import React, { useState } from "react";
import { login, isMockMode } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Login({ setAuthState }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const mockMode = isMockMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({ email, password });
      setAuthState(true);

      const role = result?.user?.role || "User";
      if (role === "Admin") navigate("/admin");
      else if (role === "Employee") navigate("/employee");
      else navigate("/user");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoRole) => {
    // Auto-register a demo account for the chosen role if one doesn't exist yet.
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const emailByRole = {
      Admin: "admin@example.com",
      User: "student@college.edu",
      Employee: "employee@example.com",
    };
    const demoEmail = emailByRole[demoRole];

    if (!users.find((u) => u.email === demoEmail)) {
      users.push({ name: `Demo ${demoRole}`, email: demoEmail, password: "password123", role: demoRole });
      localStorage.setItem("mock_users", JSON.stringify(users));
    }
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {mockMode && (
        <div className="sandbox-info">
          <p>Quick-fill a demo account to try each role:</p>
          <div className="demo-buttons">
            <button type="button" onClick={() => handleQuickFill("Admin")} className="btn-secondary btn-sm">Admin</button>
            <button type="button" onClick={() => handleQuickFill("User")} className="btn-secondary btn-sm">User</button>
            <button type="button" onClick={() => handleQuickFill("Employee")} className="btn-secondary btn-sm">Employee</button>
          </div>
        </div>
      )}

      <div className="auth-footer">
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}

export default Login;