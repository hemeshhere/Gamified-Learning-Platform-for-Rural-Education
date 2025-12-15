import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMail,
  FiBookOpen,
  FiStar,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";

export default function TeacherAddXP() {
  const [searchParams] = useSearchParams();
  const prefilledEmail = searchParams.get("email") || "";

  const [studentEmail, setStudentEmail] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [xp, setXp] = useState(10);
  const [message, setMessage] = useState("");

  // Fetch lessons for dropdown
  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => (await api.get("/lessons")).data,
  });

  // Prefill email if provided
  useEffect(() => {
    if (prefilledEmail) setStudentEmail(prefilledEmail);
  }, [prefilledEmail]);

  // Mutation for awarding XP
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/xp/add", payload);
      return res.data;
    },
    onSuccess: () => {
      setMessage("🌟 XP awarded successfully!");
      setLessonId("");
      setXp(10);
    },
    onError: (err) => {
      setMessage(err?.response?.data?.error || "Failed to award XP.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!studentEmail || !lessonId) {
      setMessage("⚠ Please provide student email & lesson.");
      return;
    }

    mutation.mutate({ studentEmail, lessonId, xpEarned: xp });
  };

  return (
    <>
      <Navbar />

      {/*  Vibrant Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 opacity-90"></div>

      {/* Floating XP Stars */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="fixed top-24 left-10 text-yellow-500 opacity-40"
      >
        <FiStar size={70} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="fixed bottom-24 right-10 text-purple-600 opacity-40"
      >
        <FiBookOpen size={70} />
      </motion.div>

      {/*  Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6 mt-12"
      >
        <h1 className="text-5xl font-extrabold mb-6 text-purple-700 flex items-center gap-3 drop-shadow-sm">
          ⭐ Award XP
        </h1>

        {/* Status Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 mb-4 bg-purple-100 border border-purple-300 rounded-2xl text-purple-700 flex items-center gap-3 shadow-lg"
          >
            <FiCheckCircle className="text-purple-600 text-xl" /> {message}
          </motion.div>
        )}

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border-2 border-purple-200 space-y-6"
        >
          {/* Student Email */}
          <div>
            <label className="text-lg font-semibold flex items-center gap-2 text-purple-700">
              ✉️ Student Email
            </label>
            <input
              className="w-full border-2 px-4 py-3 rounded-xl mt-2 bg-purple-50 focus:ring-2 focus:ring-purple-400 outline-none"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="student@example.com"
            />
          </div>

          {/* Lesson Dropdown */}
          <div>
            <label className="text-lg font-semibold text-blue-700 flex items-center gap-2">
              📘 Select Lesson
            </label>
            <select
              className="w-full border-2 px-4 py-3 rounded-xl mt-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 outline-none"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
            >
              <option value="">Choose lesson</option>
              {lessons.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>

          {/* XP Amount */}
          <div>
            <label className="text-lg font-semibold text-yellow-700 flex items-center gap-2">
              ⭐ XP Amount
            </label>
            <input
              type="number"
              min={1}
              className="w-full border-2 px-4 py-3 rounded-xl mt-2 bg-yellow-50 focus:ring-2 focus:ring-yellow-400 outline-none"
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              placeholder="Enter XP"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={mutation.isPending}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-lg shadow-xl"
          >
            {mutation.isPending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="inline-block"
              >
                🔄 Awarding XP...
              </motion.div>
            ) : (
              "🚀 Award XP"
            )}
          </motion.button>
        </form>

        <div className="text-center mt-6 text-purple-700 text-sm">
          Encourage students with XP rewards! 🌟✨
        </div>
      </motion.div>
    </>
  );
}
