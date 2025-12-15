// src/pages/StudentDashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { Link } from "react-router-dom";

// ICONS
import { FiBookOpen, FiBell } from "react-icons/fi";
import { HiOutlineLightningBolt, HiOutlineBookOpen } from "react-icons/hi";
import { MdEmojiEvents } from "react-icons/md";
import { BsTrophyFill } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { FaComments } from "react-icons/fa";

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
    enabled: !!studentId,
    queryFn: async () => (await api.get("/notifications")).data,
    refetchInterval: 20000,
  });

  const xp = progress.xp ?? 0;
  const level = progress.level ?? 1;
  const badges = progress.badges ?? [];
  const completed = progress.completedLessons ?? [];

  const xpIntoLevel = xp % 100;
  const pct = Math.round((xpIntoLevel / 100) * 100);

  return (
    <>
      <Navbar />

      {/* BEAUTIFUL BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-200 via-blue-200 to-purple-200 opacity-90"></div>

      {/* FLOATING GAMIFIED ICONS */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="fixed top-32 left-10 opacity-40 text-blue-700"
      >
        <HiOutlineLightningBolt size={80} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed bottom-20 right-10 opacity-40 text-yellow-500"
      >
        <AiFillStar size={90} />
      </motion.div>

      <main className="max-w-6xl mx-auto p-6 pt-10">
        {/* HERO SECTION */}
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-purple-300"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center">
            {/* Greeting */}
            <div>
              <motion.h1
                className="text-5xl font-extrabold text-purple-800 flex items-center gap-3 drop-shadow"
              >
                <HiOutlineLightningBolt className="text-yellow-500" />
                Hey, {user?.name || user?.email}!
              </motion.h1>
              <p className="text-gray-700 text-lg mt-2 font-medium">
                Your learning journey is getting exciting! 🚀
              </p>
            </div>

            {/* Level Badge with Glow */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg flex flex-col justify-center items-center text-white border-4 border-white">
                <div className="text-sm font-bold">LEVEL</div>
                <div className="text-5xl font-extrabold">{level}</div>
              </div>
              <motion.div
                className="absolute inset-0 rounded-full bg-yellow-300 opacity-40 blur-xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* XP PROGRESS RING */}
          <div className="flex justify-center mt-10">
            <motion.div className="relative">
              <svg width="160" height="160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#ddd"
                  strokeWidth="15"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#grad)"
                  strokeWidth="15"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 500" }}
                  animate={{ strokeDasharray: `${pct * 4.4} 500` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="grad">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <div className="text-xl font-bold text-purple-700">{pct}%</div>
                <div className="text-sm text-gray-600">XP Progress</div>
              </div>
            </motion.div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/lessons" className="px-5 py-3 bg-blue-600 text-white rounded-full shadow-xl hover:scale-110 transition flex items-center gap-2">
              <HiOutlineBookOpen /> Lessons
            </Link>
            <Link
              to="/quiz"
              className="px-5 py-3 bg-pink-600 text-white rounded-full shadow-xl hover:scale-110 transition flex items-center gap-2"
            >
              <FiBookOpen /> Quizzes
            </Link>
            <Link
              to="/badges"
              className="px-5 py-3 bg-yellow-500 text-white rounded-full shadow-xl hover:scale-110 transition flex items-center gap-2"
            >
              <MdEmojiEvents /> Badges
            </Link>
            <Link
              to="/notifications"
              className="px-5 py-3 bg-gray-300 text-gray-900 rounded-full shadow-xl hover:scale-110 transition flex items-center gap-2"
            >
              <FiBell /> Notifications ({notifications.length})
            </Link>
            <Link
              to="/student/chat"
              className="px-5 py-2 bg-purple-600 text-white rounded-full shadow-xl hover:scale-110 transition flex items-center gap-2"
            >
              <FaComments /> Chat with Teachers
            </Link>


          </div>
        </motion.div>

        {/* BADGES & LESSONS */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {/* BADGES */}
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 border-yellow-200"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
              <BsTrophyFill /> Your Badges
            </h3>

            {badges.length === 0 ? (
              <p className="text-gray-600">Earn badges by completing lessons! 🌟</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {badges.map((b, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.1 }} className="text-center">
                    <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center text-3xl shadow">
                      🥇
                    </div>
                    <p className="text-xs mt-2 font-semibold">{b.name || b}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* RECOMMENDED LESSONS */}
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border-2 border-blue-200 md:col-span-2"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
              <FiBookOpen /> Recommended Lessons
            </h3>

            {lessons.length === 0 ? (
              <p className="text-gray-600">No lessons available yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {lessons.slice(0, 4).map((lesson, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="p-5 rounded-2xl border shadow-md bg-white/70 backdrop-blur-md transition"
                  >
                    <div className="font-bold text-lg text-blue-700">{lesson.title}</div>
                    <p className="text-sm text-gray-600">
                      {lesson.description?.slice(0, 80)}...
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
