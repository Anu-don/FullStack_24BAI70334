import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

function Login({ setAuthState }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      setAuthState(true);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoRole) => {
    const demoAccounts = {
      Admin: { email: "admin@example.com", password: "password123" },
      Employee: { email: "employee@example.com", password: "password123" },
      User: { email: "user@example.com", password: "password123" },
    };

    // Auto-register the demo account the first time it's used.
    const users = JSON.parse(localStorage.getItem("rbac_users") || "[]");
    const acc = demoAccounts[demoRole];
    if (!users.find((u) => u.email === acc.email)) {
      users.push({ name: `Demo ${demoRole}`, email: acc.email, password: acc.password, role: demoRole });
      localStorage.setItem("rbac_users", JSON.stringify(users));
    }
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="auth-card">
      <h2>Sign In</h2>
      <p className="subtitle">Log in to access your dashboard</p>

      {error && <div className="banner error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="demo-box">
        <p>Quick-fill a demo account:</p>
        <div className="demo-buttons">
          <button type="button" onClick={() => quickFill("Admin")}>Admin</button>
          <button type="button" onClick={() => quickFill("Employee")}>Employee</button>
          <button type="button" onClick={() => quickFill("User")}>User</button>
        </div>
      </div>

      <p className="footer-text">
        No account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;