import React, { useState } from "react";
import "./App.css";

const PLATFORMS = [
  { id: "Twitter", label: "Twitter", limit: 280, accent: "twitter" },
  { id: "Instagram", label: "Instagram", limit: 2200, accent: "instagram" },
  { id: "Facebook", label: "Facebook", limit: 63206, accent: "facebook" },
  { id: "LinkedIn", label: "LinkedIn", limit: 3000, accent: "linkedin" },
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [name, setName] = useState("");
  const [post, setPost] = useState("");
  const [queue, setQueue] = useState([]);

  const active = PLATFORMS.find((p) => p.id === platform);
  const remaining = active.limit - post.length;
  const overLimit = remaining < 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !post.trim() || overLimit) return;

    setQueue((prev) => [
      { id: Date.now(), platform, name: name.trim(), text: post.trim(), time: new Date() },
      ...prev,
    ]);
    setName("");
    setPost("");
  };

  return (
    <div className="desk">
      <div className="desk-inner">
        <header className="desk-header">
          <span className="eyebrow">Multi-channel composer</span>
          <h1>Transmission Desk</h1>
          <p className="subhead">Pick a channel, draft the post, watch it go live in the preview.</p>
        </header>

        <div className={`channel-tabs accent-${active.accent}`}>
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`channel-tab accent-${p.accent} ${platform === p.id ? "is-active" : ""}`}
              onClick={() => setPlatform(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="composer-grid">
          {/* ---- form ---- */}
          <form className="composer-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Name</span>
              <input
                type="text"
                placeholder="Who's posting?"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="field-label">Post</span>
              <textarea
                rows="6"
                placeholder={`Write your ${active.label} post…`}
                value={post}
                onChange={(e) => setPost(e.target.value)}
              />
            </label>

            <div className={`char-meter ${overLimit ? "is-over" : ""}`}>
              {overLimit
                ? `${Math.abs(remaining)} characters over the ${active.label} limit`
                : `${remaining} characters left`}
            </div>

            <button
              type="submit"
              className={`btn-queue accent-${active.accent}`}
              disabled={!name.trim() || !post.trim() || overLimit}
            >
              Queue for {active.label}
            </button>
          </form>

          {/* ---- live preview ---- */}
          <div className={`preview-card accent-${active.accent}`}>
            <div className="preview-band" />
            <div className="preview-top">
              <span className="on-air-dot" />
              <span className="on-air-label">on air · {active.label}</span>
            </div>
            <div className="preview-body">
              <p className="preview-name">{name || "Your name"}</p>
              <p className="preview-text">
                {post || <span className="preview-placeholder">Your post will appear here as you type.</span>}
              </p>
            </div>
            <div className="preview-footer">Just now</div>
          </div>
        </div>

        {/* ---- queue history ---- */}
        <section className="queue-section">
          <h2>Queued posts</h2>
          {queue.length === 0 ? (
            <p className="queue-empty">Nothing queued yet — add a post above to see it here.</p>
          ) : (
            <ul className="queue-list">
              {queue.map((item) => {
                const meta = PLATFORMS.find((p) => p.id === item.platform);
                return (
                  <li key={item.id} className="queue-item">
                    <span className={`queue-chip accent-${meta.accent}`}>{meta.label}</span>
                    <div className="queue-content">
                      <p className="queue-name">{item.name}</p>
                      <p className="queue-text">{item.text}</p>
                    </div>
                    <span className="queue-time">{formatTime(item.time)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;