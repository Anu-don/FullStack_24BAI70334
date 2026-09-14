import React from "react";

function PostForm({ selectedDay, monthLabel, year, postText, onChangeText, onSubmit }) {
  return (
    <div style={{ borderTop: "1px solid #555", paddingTop: "20px" }}>
      <label>
        <b>
          {selectedDay
            ? `Schedule a post for ${monthLabel} ${selectedDay}, ${year}`
            : "Select a day on the calendar to schedule a post"}
        </b>
      </label>
      <br />
      <br />
      <textarea
        rows="3"
        placeholder="Write your post here..."
        value={postText}
        onChange={(e) => onChangeText(e.target.value)}
        disabled={!selectedDay}
        style={textareaStyle}
        data-testid="post-textarea"
      />
      <br />
      <br />
      <button
        onClick={onSubmit}
        disabled={!selectedDay}
        style={{
          backgroundColor: selectedDay ? "#005500" : "#003300",
          color: "#c0ff00",
          border: "none",
          padding: "10px 18px",
          borderRadius: "8px",
          fontSize: "14px",
          cursor: selectedDay ? "pointer" : "not-allowed",
        }}
        data-testid="schedule-button"
      >
        Schedule Post
      </button>
    </div>
  );
}

const textareaStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "2px solid #003300",
  fontSize: "14px",
  resize: "none",
};

export default React.memo(PostForm);
