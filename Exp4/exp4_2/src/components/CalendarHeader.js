import React, { useRef } from "react";

function CalendarHeader({ label, onPrev, onNext }) {
  // Tracks renders so we can prove in tests/dev that memoization is working
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <div style={headerRowStyle}>
      <button onClick={onPrev} style={navButtonStyle} aria-label="previous-month">
        « Prev
      </button>
      <h2 style={{ color: "#c0ff00" }} data-testid="header-label">
        {label}
      </h2>
      <button onClick={onNext} style={navButtonStyle} aria-label="next-month">
        Next »
      </button>
      <span data-testid="header-render-count" style={{ display: "none" }}>
        {renderCount.current}
      </span>
    </div>
  );
}

const headerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const navButtonStyle = {
  backgroundColor: "#2c3e50",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
};

export default React.memo(CalendarHeader);
