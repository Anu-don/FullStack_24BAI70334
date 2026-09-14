import React from "react";
import PostItem from "./PostItem";

function DayCell({
  day,
  dayKey,
  posts,
  isSelected,
  isToday,
  onSelectDay,
  onDragStart,
  onDrop,
  onDeletePost,
}) {
  if (day === null) {
    return (
      <div
        className="calendar-cell empty"
        style={{ ...cellBaseStyle, backgroundColor: "#1a1a1a", cursor: "default" }}
      />
    );
  }

  return (
    <div
      onClick={() => onSelectDay(day)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(dayKey)}
      className={`calendar-cell ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
      style={{
        ...cellBaseStyle,
        border: isSelected ? "2px solid #c0ff00" : "1px solid #555",
        backgroundColor: isToday ? "#004400" : "#111111",
      }}
      data-testid={`day-${day}`}
    >
      <div style={{ fontWeight: "bold", fontSize: "13px" }}>{day}</div>
      {posts.map((post, i) => (
        <PostItem
          key={i}
          post={post}
          index={i}
          dayKey={dayKey}
          onDragStart={onDragStart}
          onDelete={onDeletePost}
        />
      ))}
    </div>
  );
}

const cellBaseStyle = {
  minHeight: "90px",
  borderRadius: "8px",
  padding: "6px",
  cursor: "pointer",
};

// Custom comparator: only re-render this cell if ITS OWN relevant props changed.
// `posts` is compared by reference — because postUtils.js returns new arrays only
// for the affected day, unrelated DayCells keep the same `posts` reference and skip
// re-rendering even when the posts map elsewhere changes.
function areEqual(prev, next) {
  return (
    prev.day === next.day &&
    prev.isSelected === next.isSelected &&
    prev.isToday === next.isToday &&
    prev.posts === next.posts
  );
}

export default React.memo(DayCell, areEqual);
