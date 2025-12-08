// src/pages/StudentDashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const studentId = user?.id || user?._id;

  const { data: progress = {} } = useQuery({
    queryKey: ["progress", studentId],
    enabled: !!studentId,
    queryFn: async () => (await api.get(`/progress/${studentId}`)).data,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => (await api.get("/lessons")).data,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get("/notifications")).data,
    enabled: !!studentId,
    refetchInterval: 20000,
  });

  const xp = progress.xp ?? 0;
  const level = progress.level ?? 1;
  const badges = progress.badges ?? [];
  const completed = progress.completedLessons ?? [];

  // XP Progress
  const xpIntoLevel = xp % 100;
  const levelPct = Math.min(100, Math.max(0, Math.round((xpIntoLevel / 100) * 100)));

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        {/* ======= TOP DASHBOARD CARD ======= */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-6 border border-blue-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-start">

            {/* GREETING + AVATAR */}
            <div>
              <motion.h1
                className="text-3xl font-bold flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                🎉 Hi, {user?.name || user?.email}!
              </motion.h1>
              <p className="text-gray-600 text-sm">Keep shining ✨ You're doing awesome!</p>
            </div>

            {/* LEVEL BADGE */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-yellow-300 px-6 py-3 rounded-full text-center shadow-md border"
            >
              <div className="text-xs font-bold">LEVEL</div>
              <div className="text-3xl font-extrabold">{level}</div>
            </motion.div>
          </div>

          {/* XP BAR */}
          <div className="mt-5">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelPct}%` }}
                transition={{ duration: 1.3, ease: "easeOut" }}
                className="h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-inner"
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {xpIntoLevel} / 100 XP ({levelPct}%)
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <motion.div
            className="mt-6 flex flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/lessons" className="px-5 py-2 bg-blue-600 text-white rounded-full shadow hover:scale-105 transition">
              📘 Lessons
            </Link>
            <Link to="/quiz" className="px-5 py-2 bg-pink-500 text-white rounded-full shadow hover:scale-105 transition">
              🧠 Quizzes
            </Link>
            <Link to="/badges" className="px-5 py-2 bg-yellow-500 text-white rounded-full shadow hover:scale-105 transition">
              🏅 Badges
            </Link>
            <Link to="/notifications" className="px-5 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:scale-105 transition">
              🔔 Notifications ({notifications.length})
            </Link>
          </motion.div>

          {/* RECENT ACTIVITY */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">🕒 Recent Activity</h3>

            {completed.length === 0 ? (
              <p className="text-gray-500">No activity yet — start learning to earn XP! 💪</p>
            ) : (
              <ul className="space-y-3">
                {completed.slice(0, 4).map((c, i) => (
                  <motion.li
                    key={i}
                    className="bg-gray-50 p-3 rounded-xl shadow-sm flex justify-between"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span>{c.title}</span>
                    <span className="text-gray-600 text-xs">
                      {new Date(c.completedAt).toLocaleDateString()}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* ======= BADGES + LESSONS ======= */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">

          {/* BADGES CARD */}
          <motion.div
            className="bg-white p-6 rounded-3xl shadow-md border border-yellow-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold mb-3">🏆 Your Badges</h3>

            {badges.length === 0 ? (
              <p className="text-gray-500">No badges yet — go earn some! 🌟</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {badges.map((b, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    className="text-center"
                  >
                    <div className="w-14 h-14 bg-yellow-300 rounded-full flex items-center justify-center text-2xl shadow">
                      🥇
                    </div>
                    <p className="text-xs mt-1 font-semibold">{b.name || b}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* LESSONS PREVIEW */}
          <motion.div
            className="bg-white p-6 rounded-3xl shadow-md md:col-span-2 border border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold mb-4">📚 Recommended Lessons</h3>

            {lessons.length === 0 ? (
              <p className="text-gray-500">No lessons available yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {lessons.slice(0, 4).map((lesson, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 border rounded-2xl shadow-sm hover:shadow-lg transition"
                  >
                    <div className="font-bold text-lg">📘 {lesson.title}</div>
                    <p className="text-sm text-gray-600">
                      {lesson.description?.slice(0, 70)}...
                    </p>

                    <Link
                      to={`/lessons/${lesson._id}`}
                      className="text-blue-600 mt-2 inline-block font-semibold"
                    >
                      Start →
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
