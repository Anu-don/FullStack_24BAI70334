import React from 'react';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-badge">PM</div>
        <div>
          <h1>Product Manager</h1>
          <p className="subtitle">Spring Boot REST API · Validation · Global Exception Handling · CORS</p>
        </div>
      </div>
      <div className="author-badge">
        Built by <strong>Anurag</strong>
      </div>
    </header>
  );
}

export default Header;
