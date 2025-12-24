import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiBook,
  FiEdit,
  FiBell,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
  FiKey,
} from "react-icons/fi";

export default function Navbar() {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  const role = user?.role;

  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const homeLink =
    role === "teacher" || role === "admin" ? "/teacher" : "/student";

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const studentLinks = [
    { to: "/lessons", icon: FiBook, label: "Lessons" },
    { to: "/quiz", icon: FiEdit, label: "Quizzes" },
    { to: "/notifications", icon: FiBell, label: "Notifications" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  /* ✅ FIXED fun hover animation */
  const funHover = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.18,
      rotate: [-2, 2, -2, 0],
      transition: {
        rotate: { type: "tween", duration: 0.35 },
        scale: { type: "spring", stiffness: 300, damping: 12 },
      },
    },
    tap: { scale: 0.9 },
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 shadow-lg backdrop-blur-md"
      >
        <div className="flex justify-between items-center">
          {/* LOGO */}
          <Link
            to={homeLink}
            className="flex items-center gap-2 text-2xl font-extrabold"
          >
            <motion.div
              whileHover={{ scale: 1.25, rotate: [0, -8, 8, 0] }}
              transition={{
                rotate: { type: "tween", duration: 0.4 },
                scale: { type: "spring", stiffness: 220 },
              }}
            >
              <FaGraduationCap className="text-4xl" />
            </motion.div>
            <span className="hidden sm:block">GramiLearn</span>
          </Link>

          {/* DESKTOP STUDENT LINKS */}
          {role === "student" && (
            <div className="hidden md:flex gap-4">
              {studentLinks.map(({ to, icon: Icon, label }) => (
                <motion.div
                  key={to}
                  variants={funHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link
                    to={to}
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      isActive(to)
                        ? "bg-white/40"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    <Icon className="text-lg" /> {label}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-4">
            {(role === "teacher" || role === "admin") && (
              <motion.div
                variants={funHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to="/teacher"
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                    isActive("/teacher")
                      ? "bg-white/40"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                >
                  <FiUser /> Dashboard
                </Link>
              </motion.div>
            )}

            {/* PROFILE */}
            {user && (
              <div className="relative" ref={profileRef}>
                <motion.button
                  onClick={() => setProfileOpen((p) => !p)}
                  whileHover={{ scale: 1.15, rotate: [0, 3, -3, 0] }}
                  transition={{
                    rotate: { type: "tween", duration: 0.3 },
                    scale: { type: "spring", stiffness: 200 },
                  }}
                  className="bg-yellow-300 text-black px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold shadow-md"
                >
                  <FiUser />
                  <span className="max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden"
                    >
                      <Link
                        to="/change-password"
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
                      >
                        <FiKey /> Change Password
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-red-100 text-red-600"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-3xl"
          >
            <FiMenu />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE OVERLAY + DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 130 }}
              className="fixed top-0 right-0 w-72 h-full bg-gradient-to-b from-blue-600 to-purple-700 text-white z-50 p-6"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-5 right-5 text-3xl"
              >
                <FiX />
              </button>

              <div className="mt-14 space-y-6 text-lg font-semibold">
                {role === "student" &&
                  studentLinks.map(({ to, icon: Icon, label }) => (
                    <motion.div
                      key={to}
                      whileHover={{ scale: 1.15, x: 10 }}
                      transition={{ type: "spring", stiffness: 250 }}
                    >
                      <Link to={to} className="flex gap-3 items-center">
                        <Icon /> {label}
                      </Link>
                    </motion.div>
                  ))}

                {(role === "teacher" || role === "admin") && (
                  <Link to="/teacher" className="flex gap-3 items-center">
                    <FiUser /> Dashboard
                  </Link>
                )}

                <Link
                  to="/change-password"
                  className="flex gap-3 items-center"
                >
                  <FiKey /> Change Password
                </Link>

                {user && (
                  <button
                    onClick={logout}
                    className="flex gap-3 items-center text-red-200"
                  >
                    <FiLogOut /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
