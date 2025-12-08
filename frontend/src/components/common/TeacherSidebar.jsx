import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiBook,
  FiEdit,
  FiStar,
  FiBell,
  FiLogOut,
  FiMenu,
  FiChevronLeft,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherSidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const menuItems = [
    { label: "Create Lesson", icon: <FiBook />, path: "/teacher/create-lesson" },
    { label: "Create Quiz", icon: <FiEdit />, path: "/teacher/create-quiz" },
    { label: "Add XP", icon: <FiStar />, path: "/teacher/add-xp" },
    { label: "Send Notification", icon: <FiBell />, path: "/teacher/send-notification" },
  ];

  return (
    <motion.aside
      animate={{ width: open ? 240 : 80 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="h-screen bg-white backdrop-blur-xl shadow-2xl border-r border-gray-200 relative flex flex-col"
    >
      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-3 top-4 bg-purple-600 text-white p-2 rounded-full shadow-md hover:bg-purple-700 transition"
      >
        {open ? <FiChevronLeft /> : <FiMenu />}
      </button>

      {/* HEADER */}
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap overflow-hidden">
          {open ? "Teacher Panel" : "TP"}
        </h2>
      </div>

      {/* MENU LIST */}
      <nav className="flex-1 p-4 space-y-3">
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path;

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-lg"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>

                {/* LABEL ANIMATION */}
                <AnimatePresence>
                  {open && (
                    <motion.span
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* LOGOUT BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={logout}
        className="m-4 flex items-center gap-4 p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition shadow-md"
      >
        <FiLogOut className="text-2xl" />

        <AnimatePresence>
          {open && (
            <motion.span
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="font-medium"
            >
              Logout
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.aside>
  );
}
