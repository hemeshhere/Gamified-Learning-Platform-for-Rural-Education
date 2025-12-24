import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedElement({ children, allowedRoles }) {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const location = useLocation();

  // Logged-out user accessing root "/"
  if (!user && location.pathname === "/") {
    return <Navigate to="/landing" replace />;
  }

  //Logged-out user accessing protected pages
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based restriction
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
