import React, { useState, useCallback, useMemo } from "react";
import CalendarHeader from "./components/CalendarHeader";
import DayCell from "./components/DayCell";
import PostForm from "./components/PostForm";
import { WEEKDAYS, MONTH_NAMES, getMonthGrid, dateKey, isToday as isTodayFn } from "./utils/dateUtils";
import { addPost as addPostToMap, deletePost as deletePostFromMap, movePost } from "./utils/postUtils";

function App() {
  // `today` is computed once per mount, not on every render
  const [today] = useState(() => new Date());

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState({});
  const [postText, setPostText] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);

  // Recomputed only when year/month actually change — not on every keystroke
  // in the post textarea, or every time a post is added/deleted/moved.
  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  const monthLabel = useMemo(() => `${MONTH_NAMES[month]} ${year}`, [month, year]);

  // Efficient state updates: functional form avoids depending on `month`/`year`
  // directly, so these handlers can stay referentially stable via useCallback,
  // which lets CalendarHeader (React.memo) skip re-rendering entirely.
  const goPrevMonth = useCallback(() => {
    setMonth((prevMonth) => {
      if (prevMonth === 0) {
        setYear((prevYear) => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
    setSelectedDay(null);
  }, []);

  const goNextMonth = useCallback(() => {
    setMonth((prevMonth) => {
      if (prevMonth === 11) {
        setYear((prevYear) => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
    setSelectedDay(null);
  }, []);

  const handleSelectDay = useCallback((day) => {
    // Skip the state update entirely if the same day is clicked again
    setSelectedDay((prev) => (prev === day ? prev : day));
  }, []);

  const handleChangeText = useCallback((text) => {
    setPostText(text);
  }, []);

  const handleAddPost = useCallback(() => {
    if (!selectedDay || postText.trim() === "") return;
    const key = dateKey(year, month, selectedDay);
    setPosts((prev) => addPostToMap(prev, key, postText));
    setPostText("");
  }, [selectedDay, postText, year, month]);

  const handleDeletePost = useCallback((key, index) => {
    setPosts((prev) => deletePostFromMap(prev, key, index));
  }, []);

  const handleDragStart = useCallback((key, index) => {
    setDraggedFrom({ key, index });
  }, []);

  const handleDrop = useCallback((targetKey) => {
    setDraggedFrom((from) => {
      if (!from) return from;
      if (from.key !== targetKey) {
        setPosts((prev) => movePost(prev, from.key, from.index, targetKey));
      }
      return null;
    });
  }, []);

  return (
    <>
      <div className="coder-header">Post Scheduling Calendar</div>
      <div className="app-container" style={appContainerStyle}>
        <div className="app-inner" style={appInnerStyle}>
          <CalendarHeader label={monthLabel} onPrev={goPrevMonth} onNext={goNextMonth} />

          <div style={weekdayRowStyle}>
            {WEEKDAYS.map((day) => (
              <div key={day} style={weekdayLabelStyle}>
                {day}
              </div>
            ))}
          </div>

          <div style={dayGridStyle} data-testid="days-container">
            {cells.map((day, index) => {
              const key = day ? dateKey(year, month, day) : null;
              const dayPosts = key ? posts[key] || [] : [];
              return (
                <DayCell
                  key={index}
                  day={day}
                  dayKey={key}
                  posts={dayPosts}
                  isSelected={day === selectedDay}
                  isToday={day !== null && isTodayFn(day, month, year, today)}
                  onSelectDay={handleSelectDay}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  onDeletePost={handleDeletePost}
                />
              );
            })}
          </div>

          <PostForm
            selectedDay={selectedDay}
            monthLabel={MONTH_NAMES[month]}
            year={year}
            postText={postText}
            onChangeText={handleChangeText}
            onSubmit={handleAddPost}
          />
        </div>
      </div>
    </>
  );
}

const appContainerStyle = {
  backgroundColor: "#0a0a0a",
  minHeight: "100vh",
  padding: "40px",
  fontFamily: "'Courier New', Courier, monospace",
  color: "#c0ff00",
};

const appInnerStyle = {
  maxWidth: "900px",
  margin: "auto",
  backgroundColor: "#111111",
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0px 4px 15px rgba(0,255,0,0.2)",
};

const weekdayRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "6px",
  marginBottom: "8px",
};

const weekdayLabelStyle = {
  textAlign: "center",
  fontWeight: "bold",
  color: "#c0ff00",
  padding: "6px",
};

const dayGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "6px",
  marginBottom: "20px",
};

export default App;
