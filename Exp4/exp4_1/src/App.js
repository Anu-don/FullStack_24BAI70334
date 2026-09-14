import { useState } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

function dateKey(year, month, day) {
  return `${year}-${month + 1}-${day}`;
}

function App() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState({});
  const [postText, setPostText] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);

  const cells = getMonthGrid(year, month);

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const addPost = () => {
    if (!selectedDay || postText.trim() === "") return;
    const key = dateKey(year, month, selectedDay);
    const updated = { ...posts };
    updated[key] = [...(updated[key] || []), postText];
    setPosts(updated);
    setPostText("");
  };

  const deletePost = (key, index) => {
    const updated = { ...posts };
    updated[key] = updated[key].filter((_, i) => i !== index);
    setPosts(updated);
  };

  const handleDragStart = (key, index) => {
    setDraggedFrom({ key, index });
  };

  const handleDrop = (targetKey) => {
    if (!draggedFrom) return;
    if (draggedFrom.key === targetKey) {
      setDraggedFrom(null);
      return;
    }
    const updated = { ...posts };
    const movedPost = updated[draggedFrom.key][draggedFrom.index];

    updated[draggedFrom.key] = updated[draggedFrom.key].filter(
      (_, i) => i !== draggedFrom.index
    );
    updated[targetKey] = [...(updated[targetKey] || []), movedPost];

    setPosts(updated);
    setDraggedFrom(null);
  };

    return (
      <>
        <div className="coder-header">
          Post Scheduling Calendar
        </div>
        <div className="app-container" style={{
          backgroundColor: "#0a0a0a",
          minHeight: "100vh",
          padding: "40px",
          fontFamily: "'Courier New', Courier, monospace",
          color: "#c0ff00",
        }}>
          <div className="app-inner" style={{
            maxWidth: "900px",
            margin: "auto",
            backgroundColor: "#111111",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0px 4px 15px rgba(0,255,0,0.2)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <button onClick={goPrevMonth} style={navButtonStyle}>« Prev</button>
              <h2 style={{ color: "#c0ff00" }}>
                {MONTH_NAMES[month]} {year}
              </h2>
              <button onClick={goNextMonth} style={navButtonStyle}>Next »</button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "6px",
              marginBottom: "20px"
            }}>
              {WEEKDAYS.map((day) => (
                <div key={day} style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#c0ff00",
                  padding: "6px"
                }}>{day}</div>
              ))}

              {cells.map((day, index) => {
                const key = day ? dateKey(year, month, day) : null;
                const dayPosts = key && posts[key] ? posts[key] : [];
                const isSelected = day === selectedDay;
                const isToday =
                  day === today.getDate() &&
                  month === today.getMonth() &&
                  year === today.getFullYear();
                return (
                  <div
                    key={index}
                    onClick={() => day && setSelectedDay(day)}
                    onDragOver={(e) => day && e.preventDefault()}
                    onDrop={() => key && handleDrop(key)}
                    className={`calendar-cell ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                    style={{
                      minHeight: "90px",
                      border: isSelected ? "2px solid #c0ff00" : "1px solid #555",
                      borderRadius: "8px",
                      padding: "6px",
                      backgroundColor: day ? (isToday ? "#004400" : "#111111") : "#1a1a1a",
                      cursor: day ? "pointer" : "default"
                    }}
                  >
                    {day && (
                      <>
                        <div style={{ fontWeight: "bold", fontSize: "13px" }}>{day}</div>
                        {dayPosts.map((post, i) => (
                          <div
                            key={i}
                            draggable
                            onDragStart={() => handleDragStart(key, i)}
                            className="coder-code-area"
                            style={{
                              backgroundColor: "#003300",
                              color: "#c0ff00",
                              fontSize: "11px",
                              borderRadius: "4px",
                              padding: "3px 5px",
                              marginTop: "4px",
                              cursor: "grab",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center"
                            }}
                          >
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{post}</span>
                            <span onClick={(e) => { e.stopPropagation(); deletePost(key, i); }} style={{ marginLeft: "4px", cursor: "pointer" }}>✕</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: "1px solid #555", paddingTop: "20px" }}>
              <label><b>{selectedDay ? `Schedule a post for ${MONTH_NAMES[month]} ${selectedDay}, ${year}` : "Select a day on the calendar to schedule a post"}</b></label>
              <br /><br />
              <textarea
                rows="3"
                placeholder="Write your post here..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                disabled={!selectedDay}
                style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "2px solid #003300", fontSize: "14px", resize: "none" }}
              />
              <br /><br />
              <button onClick={addPost} disabled={!selectedDay} style={{ backgroundColor: selectedDay ? "#005500" : "#003300", color: "#c0ff00", border: "none", padding: "10px 18px", borderRadius: "8px", fontSize: "14px", cursor: selectedDay ? "pointer" : "not-allowed" }}>
                Schedule Post
              </button>
            </div>
          </div>
        </div>
        
      </>
    );
}

const navButtonStyle = {
  backgroundColor: "#2c3e50",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
};

export default App;