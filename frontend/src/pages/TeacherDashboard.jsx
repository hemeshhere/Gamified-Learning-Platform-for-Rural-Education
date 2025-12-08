import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBook, FiEdit, FiStar, FiBell, FiSettings, FiUser } from "react-icons/fi";
import TeacherSidebar from "../components/common/TeacherSidebar";

export default function TeacherDashboard() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  // Animation preset
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, type: "spring", stiffness: 90 }
    }),
    hover: { scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <main className="flex-1 p-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            Welcome back, {user?.name || "Teacher"}
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Manage lessons, quizzes, XP rewards, and notifications — all in one place.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-semibold mb-6"
          >
            Quick Actions
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

  {/* Create Lesson */}
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="show"
    whileHover="hover"
    custom={0}
    className="rounded-2xl"
  >
    <Link
      to="/teacher/create-lesson"
      className="block p-6 rounded-2xl bg-white/60 backdrop-blur-xl shadow-md border border-gray-200 hover:shadow-xl transition"
    >
      <FiBook className="text-4xl text-blue-600 mb-4" />
      <h3 className="font-semibold text-xl">Create Lesson</h3>
      <p className="text-gray-600 mt-2">Upload lesson PDFs or video modules.</p>
    </Link>
  </motion.div>

  {/* Create Quiz */}
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="show"
    whileHover="hover"
    custom={1}
    className="rounded-2xl"
  >
    <Link
      to="/teacher/create-quiz"
      className="block p-6 rounded-2xl bg-white/60 backdrop-blur-xl shadow-md border border-gray-200 hover:shadow-xl transition"
    >
      <FiEdit className="text-4xl text-green-600 mb-4" />
      <h3 className="font-semibold text-xl">Create Quiz</h3>
      <p className="text-gray-600 mt-2">Build structured MCQ-based quizzes.</p>
    </Link>
  </motion.div>

  {/* Add XP */}
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="show"
    whileHover="hover"
    custom={2}
    className="rounded-2xl"
  >
    <Link
      to="/teacher/add-xp"
      className="block p-6 rounded-2xl bg-white/60 backdrop-blur-xl shadow-md border border-gray-200 hover:shadow-xl transition"
    >
      <FiStar className="text-4xl text-yellow-500 mb-4" />
      <h3 className="font-semibold text-xl">Add XP</h3>
      <p className="text-gray-600 mt-2">Reward students manually.</p>
    </Link>
  </motion.div>

  {/* Send Notification */}
    <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="show"
    whileHover="hover"
    custom={3}
    className="rounded-2xl"
  >
    <Link
      to="/teacher/send-notification"
      className="block p-6 rounded-2xl bg-white/60 backdrop-blur-xl shadow-md border border-gray-200 hover:shadow-xl transition"
    >
      <FiBell className="text-4xl text-red-500 mb-4" />
      <h3 className="font-semibold text-xl">Send Notification</h3>
      <p className="text-gray-600 mt-2">Share updates with your students.</p>
    </Link>
  </motion.div>

    {/* Manage Lessons & Quizzes */}
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="show"
    whileHover="hover"
    custom={4}
    className="rounded-2xl"
  >
    <Link
      to="/teacher/manage"
      className="block p-6 rounded-2xl bg-white/60 backdrop-blur-xl shadow-md border border-gray-200 hover:shadow-xl transition"
    >
      <FiSettings className="text-4xl text-purple-600 mb-4" />
      <h3 className="font-semibold text-xl">Manage Content</h3>
      <p className="text-gray-600 mt-2">
        Edit or delete lessons & quizzes easily.
      </p>
    </Link>
  </motion.div>

  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="show"
    whileHover="hover"
    custom={4}
    className="rounded-2xl"
  >
    <Link
      to="/teacher/students"
      className="block p-6 rounded-2xl bg-white/60 backdrop-blur-xl shadow-md border border-gray-200 hover:shadow-xl transition"
    >
      <FiUser className="text-4xl text-indigo-600 mb-4" />
      <h3 className="font-semibold text-xl">Students</h3>
      <p className="text-gray-600 mt-2">View and manage all student profiles.</p>
    </Link>
  </motion.div>
</div>

        </section>

        {/* Future features */}
        <section className="mt-16">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-semibold mb-4"
          >
            Upcoming Features
          </motion.h2>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="list-disc ml-6 text-gray-600 space-y-2"
          >
            <li>Advanced Progress Analytics</li>
            <li>Classroom Performance Dashboard</li>
            <li>Lesson Engagement Reports</li>
            <li>Gamified Leaderboards</li>
          </motion.ul>
        </section>

      </main>
    </div>
  );
}
