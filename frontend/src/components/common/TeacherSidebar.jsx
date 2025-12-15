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
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillStar } from "react-icons/ai";

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
    { label: "Manage Content", icon: <FiSettings />, path: "/teacher/manage" },
    { label: "Students", icon: <FiUser />, path: "/teacher/students" },
  ];

  return (
    <div className="relative">
      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: open ? 260 : 85 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="h-screen bg-white/70 backdrop-blur-2xl shadow-xl border-r border-purple-200 flex flex-col overflow-visible"
      >
        {/* Floating Star */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-10 right-4 text-yellow-400 opacity-50 pointer-events-none"
        >
          <AiFillStar size={45} />
        </motion.div>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-purple-200">
          <h2 className="text-xl font-bold text-purple-700 whitespace-nowrap overflow-hidden">
            {open ? "Teacher Control" : "TC"}
          </h2>
          {open && <p className="text-xs text-gray-500 mt-1">Manage content easily</p>}
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-3">
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.path;

            return (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="relative">
                {/* Active highlight */}
                {isActive && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    className="absolute left-0 top-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-xl"
                  />
                )}

                <Link
                  to={item.path}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all border shadow-sm relative ${
                    isActive
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-white/60 hover:bg-purple-50 text-gray-800 border-purple-200"
                  }`}
                >
                  <motion.span
                    whileHover={{ rotate: 8, scale: 1.15 }}
                    className={`text-2xl ${isActive ? "text-yellow-300 drop-shadow" : "text-purple-600"}`}
                  >
                    {item.icon}
                  </motion.span>

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

        {/* LOGOUT */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.9 }}
          onClick={logout}
          className="m-4 flex items-center gap-4 p-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition shadow-lg"
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

      <button
        onClick={() => setOpen(!open)}
        className="absolute top-4 left-[250px] z-50 bg-purple-600 text-white p-2 rounded-full shadow-md hover:bg-purple-700 transition"
        style={{
          transform: open ? "translateX(0)" : "translateX(-175px)",
          transition: "transform 0.4s ease",
        }}
      >
        {open ? <FiChevronLeft /> : <FiMenu />}
      </button>
    </div>
  );
}
