import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../common/Navbar";
import { FiTrash2 } from "react-icons/fi";

export default function LessonsList() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(null); // stores lessonId to delete

  const {
    data: lessons = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await api.get("/lessons");
      return res.data;
    },
  });

  // DELETE LESSON MUTATION
  const deleteLessonMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/lessons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons"]);
      setConfirmDelete(null);
    },
  });

  if (isLoading)
    return (
      <div className="p-6 text-center text-lg text-gray-600">
        Loading lessons...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-lg text-red-500">
        Failed to load lessons.
      </div>
    );

  if (lessons.length === 0)
    return (
      <div>
        <Navbar />
        <div className="p-6 text-center text-gray-500">
          No lessons available yet.
        </div>
      </div>
    );

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <motion.h1
          className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📘 Lessons
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson._id || lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white shadow-lg rounded-2xl p-5 border border-blue-200 hover:shadow-xl transition transform"
            >
              {/* DELETE BUTTON (Teacher Only) */}
              {isTeacher && (
                <button
                  onClick={() => setConfirmDelete(lesson)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={20} />
                </button>
              )}

              {/* Title */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                📚 {lesson.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {lesson.description || "No description provided."}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 text-xs mb-4">
                {lesson.fileUrl && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    📄 PDF
                  </span>
                )}

                {lesson.videoUrl && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">
                    🎥 Video
                  </span>
                )}

                {lesson.grade && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    🎓 Grade {lesson.grade}
                  </span>
                )}
              </div>

              {/* View Lesson Button */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  to={`/lessons/${lesson._id || lesson.id}`}
                  className="block text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-full font-semibold shadow hover:shadow-md transition"
                >
                  Start Lesson →
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-bold mb-2">Delete Lesson?</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  "{confirmDelete.title}"
                </span>
                ?
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    deleteLessonMutation.mutate(confirmDelete._id)
                  }
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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
