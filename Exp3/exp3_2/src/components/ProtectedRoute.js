import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../services/authService";
import { hasPermission } from "../utils/permissions";

// Wrap any route element with this to enforce:
//   1. The user must be signed in.
//   2. If `requiredPermission` is given, the user's role must have it.
//
// Usage:
//   <Route path="/admin" element={
//     <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
//       <AdminPanel />
//     </ProtectedRoute>
//   } />
function ProtectedRoute({ requiredPermission, children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getRole();
  if (requiredPermission && !hasPermission(role, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;