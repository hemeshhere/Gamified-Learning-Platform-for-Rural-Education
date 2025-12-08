import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  if (!user) return <Navigate to="/login" replace />;

  // If route requires specific roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn("Blocked — role not allowed:", user.role);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
