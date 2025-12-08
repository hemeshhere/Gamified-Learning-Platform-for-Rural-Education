import React from "react";
import { Navigate } from "react-router-dom";

export default function RoleRedirect() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "teacher" || user.role === "admin") {
    return <Navigate to="/teacher" replace />;
  }

  if (user.role === "student") {
    return <Navigate to="/student" replace />;
  }

  return <Navigate to="/login" replace />;
}
