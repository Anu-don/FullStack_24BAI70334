import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addPost, removePost } from "./redux/postSlice";
import { setPlatform } from "./redux/platformSlice";
import "./App.css";

// SVG Icons for platforms and actions
const PlatformIcons = {
  twitter: (
    <svg viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
    </svg>
  ),
};

function App() {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.posts);
  const platform = useSelector((state) => state.platform.platformName);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddPost = (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") return;

    dispatch(
      addPost({
        id: Date.now(),
        title,
        content,
        platform: platform, // Attach platform to post for better styling
      })
    );

    setTitle("");
    setContent("");
  };

  return (
    <div className="App">
      <div className={`app-container theme-${platform.toLowerCase()}`}>
        <header className="header-section">
          <h1 className="main-title">Pulse</h1>
          <p className="subtitle">Cross-platform Redux State Board</p>

          <div className="platform-selector">
            <button
              onClick={() => dispatch(setPlatform("Twitter"))}
              className={`platform-btn btn-twitter`}
            >
              {PlatformIcons.twitter}
              Twitter
            </button>
            <button
              onClick={() => dispatch(setPlatform("Instagram"))}
              className={`platform-btn btn-instagram`}
            >
              {PlatformIcons.instagram}
              Instagram
            </button>
            <button
              onClick={() => dispatch(setPlatform("Facebook"))}
              className={`platform-btn btn-facebook`}
            >
              {PlatformIcons.facebook}
              Facebook
            </button>
            <button
              onClick={() => dispatch(setPlatform("LinkedIn"))}
              className={`platform-btn btn-linkedin`}
            >
              {PlatformIcons.linkedin}
              LinkedIn
            </button>
          </div>
        </header>

        <div className="main-content">
          <form className="form-card" onSubmit={handleAddPost}>
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Post ({platform})
            </h2>

            <div className="form-group">
              <label className="form-label">Post Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Post Content</label>
              <textarea
                className="form-textarea"
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Publish to {platform}
            </button>
          </form>

          <div className="feed-section">
            <h2 className="section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
              Published Feed
            </h2>

            {posts.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Your feed is quiet. Write a new post to get started!</p>
              </div>
            ) : (
              posts.map((post) => {
                const postPlatform = (post.platform || "Twitter").toLowerCase();
                return (
                  <div
                    key={post.id}
                    className={`post-card card-${postPlatform}`}
                  >
                    <div className="post-header">
                      <span className="platform-badge">
                        {PlatformIcons[postPlatform]}
                        {postPlatform}
                      </span>
                    </div>
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-content">{post.content}</p>

                    <div className="post-footer">
                      <button 
                        className="delete-btn"
                        onClick={() => dispatch(removePost(post.id))}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;