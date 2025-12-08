import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedElement({ children, allowedRoles }) {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
