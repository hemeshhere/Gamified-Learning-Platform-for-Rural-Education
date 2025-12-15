import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBook,
  FiEdit,
  FiStar,
  FiBell,
  FiSettings,
  FiUser,
  FiMail,
} from "react-icons/fi";
 import { FaComments } from "react-icons/fa";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import TeacherSidebar from "../components/common/TeacherSidebar";

export default function TeacherDashboard() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  // Card animation preset
  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, type: "spring", stiffness: 90 },
    }),
  };

  // Action cards data
  const cards = [
  {
    icon: <FiBook className="text-4xl text-blue-600" />,
    title: "Create Lesson",
    description: "Upload PDFs or Video-based learning material.",
    link: "/teacher/create-lesson",
  },
  {
    icon: <FiEdit className="text-4xl text-green-600" />,
    title: "Create Quiz",
    description: "Build MCQ quizzes for your students.",
    link: "/teacher/create-quiz",
  },
  {
    icon: <FiStar className="text-4xl text-yellow-500" />,
    title: "Add XP",
    description: "Reward students for progress.",
    link: "/teacher/add-xp",
  },
  {
    icon: <FiBell className="text-4xl text-red-500" />,
    title: "Send Notification",
    description: "Share important updates.",
    link: "/teacher/send-notification",
  },
  {
    icon: <FiSettings className="text-4xl text-purple-600" />,
    title: "Manage Content",
    description: "Edit or delete lessons and quizzes.",
    link: "/teacher/manage",
  },
  {
    icon: <FiUser className="text-4xl text-indigo-600" />,
    title: "Students",
    description: "View and manage student profiles.",
    link: "/teacher/students",
  },
  {
    icon: <FaComments className="text-4xl text-pink-600" />,
    title: "Messages",
    description: "Chat with students.",
    link: "/teacher/chat",
  }
];


  return (
    <div className="flex min-h-screen relative overflow-hidden">

      {/* Soft gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-200 via-blue-100 to-pink-200 -z-10"></div>

      {/* Floating decorative icon 1 */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed top-20 left-20 text-purple-500 opacity-40 -z-10"
      >
        <HiOutlineLightningBolt size={90} />
      </motion.div>

      {/* Floating decorative icon 2 */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="fixed bottom-20 right-16 text-yellow-400 opacity-40 -z-10"
      >
        <AiFillStar size={110} />
      </motion.div>

      {/* Teacher Sidebar */}
      <TeacherSidebar />

      {/* Main content */}
      <main className="flex-1 p-12">

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-sm">
            Hello {user?.name || "Teacher"} 👋
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Your teaching hub — organize lessons, quizzes, XP, and students.
          </p>
        </motion.div>

        {/* Quick Actions Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold mb-6 text-gray-800"
        >
          Quick Actions
        </motion.h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              initial="hidden"
              animate="show"
              custom={i}
              className="rounded-2xl"
            >
              <motion.div
                whileHover={{
                  scale: 1.06,
                  rotate: 1,
                  boxShadow: "0px 12px 32px rgba(0,0,0,0.18)",
                }}
                className="rounded-2xl"
              >
                <Link
                  to={card.link}
                  className="block p-7 rounded-3xl bg-white/70 backdrop-blur-xl border border-gray-200 shadow-lg hover:shadow-xl transition"
                >
                  <div className="mb-4">{card.icon}</div>
                  <h3 className="font-semibold text-xl">{card.title}</h3>
                  <p className="text-gray-600 mt-2">{card.description}</p>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
