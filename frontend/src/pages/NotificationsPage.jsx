import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { FiBell, FiStar, FiAward } from "react-icons/fi";

// Convert date → "2 hours ago"
function timeAgo(date) {
  if (!date) return "Just now";

  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

  const days = Math.floor(diff / 86400);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export default function NotificationsPage() {
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await api.get("/notifications")).data,
    refetchInterval: 20000,
  });

  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-200 via-yellow-200 to-blue-200 opacity-90"></div>

      {/* Floating Icons */}
      <motion.div
        className="fixed top-28 left-8 text-purple-600 opacity-30"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <FiBell size={80} />
      </motion.div>

      <motion.div
        className="fixed bottom-20 right-10 text-yellow-500 opacity-30"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <FiAward size={75} />
      </motion.div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-6 mt-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-purple-700 drop-shadow mb-6 flex gap-2 items-center"
        >
          🔔 Notifications
        </motion.h1>

        {/* Loading */}
        {isLoading && (
          <div className="text-center text-gray-700 text-lg animate-pulse">
            Loading notifications...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-500 text-lg">
            Failed to load notifications.
          </div>
        )}

        {/* Empty */}
        {!isLoading && notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 text-xl mt-14 font-medium"
          >
            No notifications yet 👀  
          </motion.div>
        )}

        {/* Notification Items */}
        <div className="space-y-4 mt-4">
          {notifications.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/70 backdrop-blur-xl border-2 border-purple-200 rounded-2xl p-5 shadow-xl flex gap-4 items-start cursor-pointer hover:shadow-2xl transition"
            >
              {/* Icon Bubble */}
              <div
                className={`text-3xl p-3 rounded-full shadow-md 
                ${
                  n.type === "badge"
                    ? "bg-yellow-100 text-yellow-700"
                    : n.type === "teacher"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {n.type === "badge"
                  ? "🏅"
                  : n.type === "teacher"
                  ? "📢"
                  : "🔔"}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-800">
                  {n.title}
                </div>

                <div className="text-gray-700 text-sm mt-1">{n.body}</div>

                {/* Time */}
                <div className="text-xs text-gray-500 mt-2">
                  {timeAgo(n.sentAt)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
