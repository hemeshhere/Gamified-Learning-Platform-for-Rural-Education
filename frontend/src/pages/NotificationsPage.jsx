import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";

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
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data;
    },
    refetchInterval: 20000,
  });

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>

        {/* Loading */}
        {isLoading && (
          <div className="text-center text-gray-600 text-lg animate-pulse">
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
          <div className="text-center text-gray-500 text-lg mt-10">
            No notifications yet 👀  
          </div>
        )}

        {/* Notification Items */}
        <div className="space-y-4 mt-4">
          {notifications.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border rounded-xl p-4 shadow-sm flex gap-4 items-start hover:shadow-lg transition cursor-pointer"
            >
              {/* Icon */}
              <div className="text-3xl">
                {n.type === "badge" ? "🏅" : n.type === "teacher" ? "📢" : "🔔"}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="font-semibold text-lg">{n.title}</div>
                <div className="text-gray-700 text-sm">{n.body}</div>

                {/* Time */}
                <div className="text-xs text-gray-500 mt-1">
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
