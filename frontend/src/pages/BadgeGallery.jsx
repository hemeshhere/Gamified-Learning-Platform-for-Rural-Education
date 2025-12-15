// src/pages/BadgeGallery.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";

export default function BadgeGallery() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const studentId = user?.id || user?._id;

  
  //  FETCH FULL PROGRESS (same as Dashboard)
  const { data: progress = {}, isLoading } = useQuery({
    queryKey: ["progress", studentId],
    enabled: !!studentId,
    queryFn: async () => (await api.get(`/progress/${studentId}`)).data,
  });

  const badges = progress.badges ?? [];

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6 flex items-center gap-2"
        >
          <FiAward className="text-yellow-500" /> Your Badge Collection
        </motion.h1>

        {/* Loading */}
        {isLoading && (
          <div className="text-gray-600 text-center">
            Loading your badges...
          </div>
        )}

        {/* No badges */}
        {!isLoading && badges.length === 0 && (
          <div className="text-gray-500 text-center text-lg">
            You haven't earned any badges yet 🥺  
            <br />
            Complete lessons to unlock achievements!
          </div>
        )}

        {/* Badge Grid */}
        {badges.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges.map((b, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="bg-white p-5 rounded-2xl shadow-md border text-center"
              >
                {/* Icon */}
                <div className="w-16 h-16 mx-auto rounded-full bg-yellow-300 flex items-center justify-center text-3xl shadow">
                  {b.icon || "🏅"}
                </div>

                {/* Name */}
                <div className="font-semibold text-center mt-3 text-gray-800">
                  {b.name || b} {/* SAME LOGIC AS StudentDashboard */}
                </div>

                {/* Description */}
                <div className="text-xs text-gray-500 text-center mt-1">
                  {b.description || ""}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
