import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import ManageUsers from "./components/ManageUsers";
import Settings from "./components/Settings";
import Unauthorized from "./components/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./services/authService";
import { PERMISSIONS } from "./utils/permissions";

import "./App.css";

function App() {
  const [authState, setAuthState] = useState(() => isAuthenticated());

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar setAuthState={setAuthState} />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to={authState ? "/dashboard" : "/login"} replace />} />
            <Route path="/login" element={<Login setAuthState={setAuthState} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* VIEW_DASHBOARD: every signed-in role has this permission */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* VIEW_REPORTS: Admin + Employee only */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_REPORTS}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* MANAGE_USERS: Admin only */}
            <Route
              path="/manage-users"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />

            {/* MANAGE_SETTINGS: Admin only */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_SETTINGS}>
                  <Settings />
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