import React, { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiMail, FiBookOpen, FiStar, FiSend } from "react-icons/fi";

export default function TeacherAddXP() {
  const [studentEmail, setStudentEmail] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [xp, setXp] = useState(10);
  const [message, setMessage] = useState("");

  // 🔥 TanStack v5 mutation
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/xp/add", payload);
      return res.data;
    },
    onSuccess: () => {
      setMessage("🎉 XP awarded successfully!");
      setStudentEmail("");
      setLessonTitle("");
      setXp(10);
    },
    onError: (err) => {
      setMessage(err?.response?.data?.error || "Failed to add XP.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!studentEmail || !lessonTitle) {
      setMessage("⚠️ Student email and lesson title are required.");
      return;
    }

    mutation.mutate({ studentEmail, lessonTitle, xpEarned: xp });
  };

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6"
      >
        <h1 className="text-3xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <FiStar className="text-yellow-500" /> Award XP to Students
        </h1>

        {message && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3 mb-4 rounded bg-blue-50 text-blue-700 border border-blue-200 text-sm"
          >
            {message}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-xl space-y-6 border border-gray-100"
        >
          {/* Student Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              <FiMail className="text-blue-500" /> Student Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                className="w-full border px-10 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="example@student.com"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Lesson Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              <FiBookOpen className="text-green-500" /> Lesson Title
            </label>
            <div className="relative">
              <FiBookOpen className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                className="w-full border px-10 py-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                placeholder="Introduction to Fractions"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
              />
            </div>
          </div>

          {/* XP Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-1">
              <FiStar className="text-yellow-500" /> XP Amount
            </label>
            <div className="relative">
              <FiStar className="absolute left-3 top-3 text-gray-400 text-lg" />
              <input
                type="number"
                min={1}
                className="w-full border px-10 py-2 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={mutation.isPending}
            className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
              mutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <FiSend />
            {mutation.isPending ? "Awarding XP..." : "Award XP"}
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}
