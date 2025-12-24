import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  // Not logged in → landing page
  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  // Role restriction
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn("Blocked — role not allowed:", user.role);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
