import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import { isAuthenticated, getRole } from "./services/authService";

import "./App.css";

const roleHome = (role) => {
  if (role === "Admin") return "/admin";
  if (role === "Employee") return "/employee";
  return "/user";
};

// Redirects to login if signed out, or to the user's own dashboard
// if they're signed in but trying to view someone else's role page.
function ProtectedRoute({ authState, allowedRole, children }) {
  if (!authState) {
    return <Navigate to="/" replace />;
  }
  const role = getRole();
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={roleHome(role)} replace />;
  }
  return children;
}

function App() {
  const [authState, setAuthState] = useState(() => isAuthenticated());

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar authState={authState} setAuthState={setAuthState} />

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                authState ? (
                  <Navigate to={roleHome(getRole())} replace />
                ) : (
                  <Login setAuthState={setAuthState} />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute authState={authState} allowedRole="Admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute authState={authState} allowedRole="User">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee"
              element={
                <ProtectedRoute authState={authState} allowedRole="Employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;