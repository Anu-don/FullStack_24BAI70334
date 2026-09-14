import React, { useState, useEffect } from "react";
import { getToken, getDecodedToken, isAuthenticated } from "../services/authService";

function Dashboard() {
  const [rawToken, setRawToken] = useState("");
  const [decoded, setDecoded] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [authStatus, setAuthStatus] = useState("Valid");
  const [apiResponse, setApiResponse] = useState("");
  const [activeTab, setActiveTab] = useState("inspect");

  const loadTokenData = () => {
    const token = getToken();
    setRawToken(token || "");
    const decodedToken = getDecodedToken();
    setDecoded(decodedToken);

    if (decodedToken && decodedToken.exp) {
      const now = Math.floor(Date.now() / 1000);
      setTimeLeft(Math.max(0, decodedToken.exp - now));
    }
  };

  useEffect(() => {
    loadTokenData();
    const interval = setInterval(() => {
      if (decoded && decoded.exp) {
        const now = Math.floor(Date.now() / 1000);
        const remaining = decoded.exp - now;
        setTimeLeft(remaining > 0 ? remaining : 0);
        if (remaining <= 0) {
          setAuthStatus("Expired");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [decoded]);

  const handleTamperToken = () => {
    if (!rawToken) return;
    // Add dummy character to the signature part (3rd segment)
    const segments = rawToken.split(".");
    if (segments.length === 3) {
      segments[2] = segments[2] + "XYZ_TAMPERED";
      const tampered = segments.join(".");
      localStorage.setItem("token", tampered);
      setRawToken(tampered);
      setAuthStatus("Tampered / Invalid Signature");
      setApiResponse("Unauthorized (Token signature mismatch)");
    }
  };

  const handleSimulateSecureCall = () => {
    const isVal = isAuthenticated();
    if (!isVal || authStatus !== "Valid") {
      setApiResponse("🔴 Access Denied: 401 Unauthorized. The client token has been tampered with or expired.");
      return;
    }

    setApiResponse(
      `💚 Success: 200 OK!\nAuthorization: Bearer ${rawToken.substring(0, 15)}...\n\nPayload Verified by Server:\nUser: ${decoded?.name}\nEmail: ${decoded?.email}\nRoles: ["Student"]`
    );
  };

  // Color code token segments like jwt.io
  const renderTokenSegments = () => {
    if (!rawToken) return <span>No Token Found</span>;
    const parts = rawToken.split(".");
    if (parts.length !== 3) return <span className="token-bad">{rawToken}</span>;

    return (
      <div className="token-decoder-box">
        <span className="token-part-header" title="Header (Algorithm & Token Type)">{parts[0]}</span>
        <span className="token-dot">.</span>
        <span className="token-part-payload" title="Payload (User Data Claims)">{parts[1]}</span>
        <span className="token-dot">.</span>
        <span className="token-part-signature" title="Signature (HMAC Verification code)">{parts[2]}</span>
      </div>
    );
  };

  const formatCountdown = (seconds) => {
    if (seconds <= 0) return "Expired";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="dashboard-container glass-panel">
      <div className="dashboard-header">
        <div className="welcome-banner">
          <h2>Security & JWT Dashboard</h2>
          <p>Analyzing Session State and Stateless Token-Based Authentication</p>
        </div>
        <div className={`session-badge ${authStatus.toLowerCase().replace(/ /g, "-")}`}>
          <span className="badge-dot"></span>
          Session: {authStatus}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Token Inspection Panel */}
        <div className="dashboard-card main-card">
          <div className="card-header-tabs">
            <button
              className={`tab-btn ${activeTab === "inspect" ? "active" : ""}`}
              onClick={() => setActiveTab("inspect")}
            >
              🔍 Raw JWT Debugger
            </button>
            <button
              className={`tab-btn ${activeTab === "sandbox" ? "active" : ""}`}
              onClick={() => setActiveTab("sandbox")}
            >
              🧪 Tampering Sandbox
            </button>
          </div>

          {activeTab === "inspect" ? (
            <div className="tab-content animate-fade">
              <h3>Encoded JSON Web Token (Stored in LocalStorage)</h3>
              <p className="card-sub">Hover over the highlighted segments to identify Header, Payload, and Signature:</p>
              {renderTokenSegments()}

              <div className="decoded-sections">
                <div className="decoded-box header-box">
                  <h4>Header (Decoded)</h4>
                  <pre>
                    {JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2)}
                  </pre>
                </div>

                <div className="decoded-box payload-box">
                  <h4>Payload Claims (Decoded)</h4>
                  <pre>
                    {decoded ? JSON.stringify(decoded, null, 2) : "{\n  \"error\": \"No valid payload\"\n}"}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="tab-content animate-fade">
              <h3>Security Simulation & Vulnerability Sandbox</h3>
              <p className="card-sub">Test stateless sessions against client-side modifications (tampering attacks).</p>
              
              <div className="sandbox-actions">
                <div className="sandbox-control-card">
                  <h5>1. Simulate Signature Tampering</h5>
                  <p>In stateless JWT, if a malicious user alters claims in the token payload or signature, the server rejects it immediately.</p>
                  <button onClick={handleTamperToken} className="btn-warning" disabled={authStatus !== "Valid"}>
                    ⚠️ Tamper Token
                  </button>
                </div>

                <div className="sandbox-control-card">
                  <h5>2. Authenticated API Simulation</h5>
                  <p>Simulate sending the JWT in HTTP <code>Authorization: Bearer &lt;token&gt;</code> headers.</p>
                  <button onClick={handleSimulateSecureCall} className="btn-primary">
                    ⚡ Request Secured API Route
                  </button>
                </div>
              </div>

              {apiResponse && (
                <div className="terminal-box">
                  <div className="terminal-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                    <span className="terminal-title">server-console.log</span>
                  </div>
                  <pre className="terminal-body">{apiResponse}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info Panels */}
        <div className="dashboard-sidebar">
          <div className="dashboard-card info-card">
            <h4>Session Lifetime</h4>
            <div className="timer-display">
              <span className="timer-val">{formatCountdown(timeLeft)}</span>
              <span className="timer-lbl">Time until token expiry (exp claim)</span>
            </div>
          </div>

          <div className="dashboard-card guide-card">
            <h4>JWT Architecture</h4>
            <ul className="guide-list">
              <li>
                <strong>Stateless:</strong> The server doesn't store session data database-side. The token contains all user claims.
              </li>
              <li>
                <strong>Local Storage:</strong> Token is saved securely in the browser's `localStorage` and sent with requests.
              </li>
              <li>
                <strong>Signature:</strong> Generated by signing Header + Payload with a server-side secret key to prevent forgery.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

