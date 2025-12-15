import React, { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUploadCloud,
  FiFileText,
  FiVideo,
  FiBookOpen,
  FiStar
} from "react-icons/fi";

export default function LessonUpload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [grade, setGrade] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      await api.post("/lessons", {
        title,
        description,
        language,
        grade,
        fileUrl,
        videoUrl,
      });

      setMessage("🎉 Lesson created successfully! Redirecting...");
      setTimeout(() => navigate("/lessons"), 1500);
    } catch (err) {
      setMessage(err?.response?.data?.message || "❌ Failed to upload lesson.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />

      {/*  Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-200 via-pink-200 to-yellow-200 opacity-90"></div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="fixed top-24 left-10 text-purple-600 opacity-40"
      >
        <FiBookOpen size={70} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="fixed bottom-16 right-10 text-yellow-500 opacity-40"
      >
        <FiStar size={65} />
      </motion.div>

      {/* PAGE CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto p-6 mt-12"
      >
        <h1 className="text-5xl font-extrabold mb-8 text-purple-700 flex items-center gap-3 drop-shadow-sm">
          📘 Upload New Lesson
        </h1>

        {/* Status Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-2xl mb-5 shadow-lg text-md border ${
              message.includes("success")
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* FORM CARD */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border-2 border-blue-200 space-y-6"
        >
          {/* TITLE */}
          <div>
            <label className="block mb-1 font-semibold text-purple-700 text-lg">
              📚 Lesson Title *
            </label>
            <input
              required
              className="w-full border px-4 py-3 rounded-xl shadow focus:ring-2 focus:ring-purple-400 outline-none bg-purple-50"
              placeholder="Introduction to Fractions"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block mb-1 font-semibold text-pink-700 text-lg">
              ✏️ Description
            </label>
            <textarea
              rows={3}
              className="w-full border px-4 py-3 rounded-xl shadow focus:ring-2 focus:ring-pink-400 outline-none bg-pink-50"
              placeholder="Short description of the lesson..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* LANGUAGE */}
          <div>
            <label className="block mb-1 font-semibold text-blue-700 text-lg">
              🌍 Language
            </label>
            <select
              className="w-full border px-4 py-3 rounded-xl shadow bg-blue-50 focus:ring-2 focus:ring-blue-400 outline-none"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Gujarati</option>
              <option>Marathi</option>
            </select>
          </div>

          {/* GRADE */}
          <div>
            <label className="block mb-1 font-semibold text-yellow-700 text-lg">
              🎓 Grade
            </label>
            <input
              type="number"
              className="w-full border px-4 py-3 rounded-xl shadow bg-yellow-50 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="5"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>

          {/* PDF URL */}
          <div>
            <label className="block mb-1 font-semibold text-purple-700 text-lg flex items-center gap-2">
              <FiFileText className="text-purple-600" /> PDF URL
            </label>
            <input
              className="w-full border px-4 py-3 rounded-xl shadow bg-purple-50 focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="https://example.com/lesson.pdf"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
          </div>

          {/* VIDEO URL */}
          <div>
            <label className="block mb-1 font-semibold text-red-700 text-lg flex items-center gap-2">
              <FiVideo className="text-red-600" /> Video URL
            </label>
            <input
              className="w-full border px-4 py-3 rounded-xl shadow bg-red-50 focus:ring-2 focus:ring-red-400 outline-none"
              placeholder="https://youtube.com/watch?v=ABC123"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            whileHover={!busy ? { scale: 1.05 } : {}}
            whileTap={!busy ? { scale: 0.95 } : {}}
            disabled={busy}
            className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-xl transition ${
              busy
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {busy ? "Saving..." : "🚀 Create Lesson"}
          </motion.button>
        </motion.form>

        <div className="text-center mt-6 text-purple-700">
          Make learning beautiful & fun! ✨📘
        </div>
      </motion.div>
    </>
  );
}
