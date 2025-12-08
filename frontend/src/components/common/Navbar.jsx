// src/components/common/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGraduationCap,
} from "react-icons/fa";
import {
  FiBook,
  FiEdit,
  FiBell,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Navbar() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const role = user?.role;

  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const homeLink =
    role === "teacher" || role === "admin" ? "/teacher" : "/";

  // Animate nav items
  const navItem = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  // Mobile panel animation
  const mobileMenu = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="backdrop-blur-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50"
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">
          {/* LOGO */}
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={homeLink}
              className="text-2xl font-extrabold tracking-wide drop-shadow-md flex items-center gap-2"
            >
              <FaGraduationCap className="text-3xl" />
              <span className="hidden sm:inline">Gamified</span>
            </Link>
          </motion.div>

          {/* DESKTOP STUDENT LINKS */}
          {role === "student" && (
            <div className="hidden md:flex items-center gap-4">
              <motion.div variants={navItem} whileHover="hover" whileTap="tap">
                <Link
                  to="/lessons"
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
                    location.pathname.includes("lessons")
                      ? "bg-white/40"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                >
                  <FiBook /> Lessons
                </Link>
              </motion.div>

              <motion.div variants={navItem} whileHover="hover" whileTap="tap">
                <Link
                  to="/quiz"
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
                    location.pathname.includes("quiz")
                      ? "bg-white/40"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                >
                  <FiEdit /> Quizzes
                </Link>
              </motion.div>

              <motion.div variants={navItem} whileHover="hover" whileTap="tap">
                <Link
                  to="/notifications"
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
                    location.pathname.includes("notifications")
                      ? "bg-white/40"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                >
                  <FiBell /> Notifications
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden md:flex items-center gap-4">

          {/* TEACHER DASHBOARD LINK */}
          {(role === "teacher" || role === "admin") && (
            <motion.div variants={navItem} whileHover="hover" whileTap="tap">
              <Link
                to="/teacher"
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md text-sm flex items-center gap-2"
              >
                <FiUser /> Teacher
              </Link>
            </motion.div>
          )}

          {/* LOGGED IN USER */}
          {user ? (
            <>
              <span className="text-sm font-semibold flex items-center gap-1">
                <FiUser /> {user.name || user.email}
              </span>

              <motion.button
                variants={navItem}
                whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                whileTap="tap"
                onClick={logout}
                className="px-3 py-1 bg-red-400 rounded-full shadow flex items-center gap-1 text-sm"
              >
                <FiLogOut /> Logout
              </motion.button>
            </>
          ) : (
            <motion.div variants={navItem} whileHover="hover" whileTap="tap">
              <Link
                to="/login"
                className="px-4 py-1.5 bg-white rounded-full text-blue-600 font-semibold shadow hover:bg-gray-100 flex items-center gap-2"
              >
                Login
              </Link>
            </motion.div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden text-3xl"
        >
          <FiMenu />
        </button>
      </motion.nav>

      {/* MOBILE SLIDE-IN MENU */}
      <motion.div
        variants={mobileMenu}
        initial="hidden"
        animate={menuOpen ? "visible" : "hidden"}
        transition={{ type: "spring", stiffness: 120 }}
        className="fixed top-0 right-0 w-64 h-full bg-gradient-to-b from-blue-600 to-purple-700 text-white shadow-xl z-50 p-6"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setMenuOpen(false)}
          className="text-3xl absolute top-5 right-5"
        >
          <FiX />
        </button>

        <div className="mt-12 space-y-6">
          {role === "student" && (
            <>
              <Link
                to="/lessons"
                className="block text-lg font-semibold flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <FiBook /> Lessons
              </Link>

              <Link
                to="/quiz"
                className="block text-lg font-semibold flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <FiEdit /> Quizzes
              </Link>

              <Link
                to="/notifications"
                className="block text-lg font-semibold flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <FiBell /> Notifications
              </Link>
            </>
          )}

          {(role === "teacher" || role === "admin") && (
            <Link
              to="/teacher"
              className="block text-lg font-semibold flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <FiUser /> Teacher Dashboard
            </Link>
          )}

          {/* Logout */}
          {user && (
            <button
              onClick={logout}
              className="text-left text-lg font-semibold flex items-center gap-2 text-red-200"
            >
              <FiLogOut /> Logout
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
