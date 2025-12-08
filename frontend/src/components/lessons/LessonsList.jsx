import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../common/Navbar";
import { FiTrash2, FiBookOpen, FiStar } from "react-icons/fi";

export default function LessonsList() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const {
    data: lessons = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => (await api.get("/lessons")).data,
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (id) => api.delete(`/lessons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons"]);
      setConfirmDelete(null);
    },
  });

  /* ---------------- LOADING & ERROR ---------------- */
  if (isLoading)
    return (
      <div className="p-6 text-center text-purple-600 text-xl">
        Loading lessons...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500 text-xl">
        Failed to load lessons.
      </div>
    );

  /* ---------------- EMPTY ---------------- */
  if (lessons.length === 0)
    return (
      <>
        <Navbar />
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 opacity-90"></div>
        <div className="text-center text-gray-600 p-6 mt-10 text-lg">
          No lessons available yet.
        </div>
      </>
    );

  return (
    <>
      <Navbar />

      {/* 🌈 Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-200 via-yellow-200 to-pink-200 opacity-90"></div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="fixed top-24 left-10 text-blue-600 opacity-40"
      >
        <FiBookOpen size={70} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="fixed bottom-14 right-10 text-yellow-500 opacity-40"
      >
        <FiStar size={65} />
      </motion.div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="max-w-6xl mx-auto p-6 mt-10">
        <motion.h1
          className="text-5xl font-extrabold text-purple-700 drop-shadow-sm flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📘 Explore Lessons
        </motion.h1>

        {/* LESSON GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson._id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200 p-6 shadow-xl hover:shadow-2xl transition"
            >
              {/* Delete (Teacher Only) */}
              {isTeacher && (
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  onClick={() => setConfirmDelete(lesson)}
                >
                  <FiTrash2 size={22} />
                </motion.button>
              )}

              {/* Title */}
              <h2 className="text-xl font-extrabold text-purple-800 mb-3 flex items-center gap-1">
                📚 {lesson.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {lesson.description || "No description provided."}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 text-xs mb-4">
                {lesson.fileUrl && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold shadow">
                    📄 PDF
                  </span>
                )}

                {lesson.videoUrl && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold shadow">
                    🎥 Video
                  </span>
                )}

                {lesson.grade && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold shadow">
                    🎓 Grade {lesson.grade}
                  </span>
                )}
              </div>

              {/* Start Lesson Button */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/lessons/${lesson._id}`}
                  className="block text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-full font-bold shadow-md hover:shadow-lg transition"
                >
                  Start Lesson →
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ---------------- DELETE MODAL ---------------- */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 w-80 border-2 border-red-300 shadow-2xl text-center"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-red-600 mb-2">
                Delete Lesson?
              </h3>

              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <b>"{confirmDelete.title}"</b>?
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={() => deleteLessonMutation.mutate(confirmDelete._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold shadow"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
