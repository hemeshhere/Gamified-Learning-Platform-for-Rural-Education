// src/pages/TeacherSendNotification.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMail,
  FiBell,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";

export default function TeacherSendNotification() {
  const [searchParams] = useSearchParams();

  // Email from URL
  const prefilledEmail = searchParams.get("email") || "";
  const [studentEmail, setStudentEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");

  //AUTO-FILL EMAIL + FETCH USER ID
  useEffect(() => {
    if (prefilledEmail) {
      setStudentEmail(prefilledEmail);

      api
        .get(`/users/by-email/${prefilledEmail}`)
        .then((res) => setUserId(res.data._id))
        .catch(() => console.log("User not found"));
    }
  }, [prefilledEmail]);

  // SEND NOTIFICATION

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/notifications", payload);
      return res.data;
    },
    onSuccess: () => {
      setMessage("🎉 Notification sent successfully!");
      setTitle("");
      setBody("");
    },
    onError: (err) => {
      setMessage(err?.response?.data?.message || "❌ Failed to send.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!title || !body) {
      setMessage("⚠ Please fill out both title & message!");
      return;
    }

    mutation.mutate({
      userId: userId || null,
      title,
      body,
      type: "teacher",
    });
  };

  return (
    <>
      <Navbar />

      {/*  Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 opacity-90"></div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="fixed top-20 left-10 text-pink-500 opacity-40"
      >
        <FiBell size={70} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="fixed bottom-20 right-10 text-blue-600 opacity-40"
      >
        <FiMail size={70} />
      </motion.div>

      {/*  MAIN CARD  */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto p-6 mt-12"
      >
        <h1 className="text-5xl font-extrabold mb-8 text-purple-700 flex items-center gap-3 drop-shadow-sm">
          📣 Send Notification
        </h1>

        {/* Success / Error Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 mb-4 rounded-2xl bg-purple-100 text-purple-700 border border-purple-300 flex items-center gap-3 shadow-md"
          >
            <FiCheckCircle className="text-purple-600 text-xl" />
            {message}
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border-2 border-purple-200 space-y-6"
        >
          {/* Email */}
          <div>
            <label className="text-lg font-semibold flex items-center gap-2 text-purple-600">
              ✉️ Student Email
            </label>
            <input
              className="w-full border-2 px-4 py-3 rounded-xl mt-2 bg-purple-50 focus:ring-2 focus:ring-purple-400 outline-none"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="student@example.com"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-lg font-semibold text-blue-600">
              🏷️ Title
            </label>
            <input
              className="w-full border-2 px-4 py-3 rounded-xl mt-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Great job today!"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="text-lg font-semibold text-pink-600">
              💬 Message
            </label>
            <textarea
              rows={5}
              className="w-full border-2 px-4 py-3 rounded-xl mt-2 bg-pink-50 focus:ring-2 focus:ring-pink-400 outline-none"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="You completed a new lesson today! 🌟"
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
                🔄 Sending...
              </motion.div>
            ) : (
              "🚀 Send Notification"
            )}
          </motion.button>
        </form>
      </motion.div>
    </>
  );
}
