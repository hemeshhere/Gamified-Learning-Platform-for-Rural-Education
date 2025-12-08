import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFileText, FiVideo } from "react-icons/fi";

export default function LessonCard({ lesson }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white/80 backdrop-blur-xl border-2 border-purple-200 rounded-3xl p-5 shadow-xl hover:shadow-2xl"
    >
      <div className="flex justify-between items-start gap-4">
        {/* LEFT SIDE - TITLE & DESCRIPTION */}
        <div>
          <h3 className="text-xl font-extrabold text-purple-800">
            {lesson.title}
          </h3>

          <p className="text-sm text-gray-700 mt-1">
            {lesson.description || "No description available."}
          </p>

          <div className="mt-3 inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold shadow">
            🎓 Grade {lesson.grade}
          </div>
        </div>

        {/* RIGHT SIDE - FILE TAGS + BUTTON */}
        <div className="text-right">
          {lesson.fileUrl && (
            <div className="flex items-center gap-1 text-purple-700 text-sm font-semibold">
              <FiFileText /> PDF
            </div>
          )}

          {lesson.videoUrl && (
            <div className="flex items-center gap-1 text-red-600 text-sm font-semibold">
              <FiVideo /> Video
            </div>
          )}

          {/* VIEW BUTTON */}
          <Link
            to={`/lessons/${lesson.id || lesson._id}`}
            className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-xl shadow hover:bg-purple-700 text-sm font-bold transition"
          >
            📘 Open Lesson
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
