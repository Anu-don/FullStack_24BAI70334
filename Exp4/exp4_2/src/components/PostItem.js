import React from "react";

function PostItem({ post, index, dayKey, onDragStart, onDelete }) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(dayKey, index)}
      className="coder-code-area"
      style={postItemStyle}
      data-testid="post-item"
    >
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{post}</span>
      <span
        onClick={(e) => {
          e.stopPropagation();
          onDelete(dayKey, index);
        }}
        style={{ marginLeft: "4px", cursor: "pointer" }}
        aria-label={`delete-post-${index}`}
      >
        ✕
      </span>
    </div>
  );
}

const postItemStyle = {
  backgroundColor: "#003300",
  color: "#c0ff00",
  fontSize: "11px",
  borderRadius: "4px",
  padding: "3px 5px",
  marginTop: "4px",
  cursor: "grab",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default React.memo(PostItem);
