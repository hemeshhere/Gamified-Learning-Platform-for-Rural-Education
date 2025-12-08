import React, { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUploadCloud } from "react-icons/fi";

export default function LessonUpload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [grade, setGrade] = useState("");
  const [file, setFile] = useState(null);
  const [video, setVideo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("description", description);
      form.append("language", language);
      form.append("grade", grade);
      if (file) form.append("file", file);
      if (video) form.append("video", video);

      const res = await api.post("/lessons", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Lesson created successfully! 🎉 Redirecting...");
      setTimeout(() => navigate("/lessons"), 1200);
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Failed to upload lesson. Try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto p-6"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <FiUploadCloud className="text-blue-600" /> Create New Lesson
        </h1>

        {/* Message Box */}
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-3 rounded-lg mb-4 text-sm shadow ${
              message.includes("success")
                ? "bg-green-50 text-green-700 border border-green-300"
                : "bg-red-50 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* FORM CONTAINER */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200 space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Lesson Title *
            </label>
            <input
              type="text"
              required
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
              placeholder="Introduction to Fractions"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
              placeholder="Explain what the lesson covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Language */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Language
            </label>
            <select
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Gujarati</option>
              <option>Marathi</option>
            </select>
          </div>

          {/* Grade */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Grade
            </label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
              placeholder="5"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Upload PDF (Optional)
            </label>
            <input
              type="file"
              accept="application/pdf"
              className="w-full text-sm"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          {/* Video Upload */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Upload Video (Optional)
            </label>
            <input
              type="file"
              accept="video/*"
              className="w-full text-sm"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={!busy ? { scale: 1.03 } : {}}
            whileTap={!busy ? { scale: 0.97 } : {}}
            disabled={busy}
            className={`w-full py-3 rounded-lg text-white font-semibold transition shadow 
              ${
                busy
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {busy ? "Uploading..." : "Create Lesson"}
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}
