import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiBook,
  FiEdit,
  FiFilm,
  FiFileText,
  FiAlertTriangle,
} from "react-icons/fi";

export default function TeacherManageContent() {
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch lessons
  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => (await api.get("/lessons")).data,
  });

  // Fetch quizzes
  const { data: quizzes = [] } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => (await api.get("/quiz")).data,
  });

  // Delete Lesson
  const deleteLesson = useMutation({
    mutationFn: async (id) => api.delete(`/lessons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons"]);
      setConfirmDelete(null);
    },
  });

  // Delete Quiz
  const deleteQuiz = useMutation({
    mutationFn: async (id) => api.delete(`/quiz/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["quizzes"]);
      setConfirmDelete(null);
    },
  });

  return (
    <>
      <Navbar />

      {/*  Soft Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 opacity-80"></div>

      <div className="max-w-6xl mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold mb-8 text-purple-700 drop-shadow-sm flex items-center gap-3"
        >
          📚 Manage Lessons & Quizzes
        </motion.h1>

        {/* LESSONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl mb-10 border border-purple-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="bg-purple-100 p-3 rounded-2xl"
            >
              <FiBook className="text-purple-700 text-3xl" />
            </motion.div>
            <h2 className="text-3xl font-bold text-purple-700">Lessons</h2>
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <FiFileText className="text-5xl mx-auto mb-3 text-gray-400" />
              No lessons uploaded yet.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-gray-600 bg-purple-50">
                  <th className="p-3">Title</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {lessons.map((lesson, i) => (
                  <motion.tr
                    key={lesson._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b hover:bg-purple-50/40 transition rounded-xl"
                  >
                    <td className="p-3 font-semibold text-purple-700">
                      {lesson.title}
                    </td>

                    <td className="p-3">{lesson.grade || "-"}</td>

                    <td className="p-3 flex gap-2 items-center">
                      {lesson.fileUrl && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                          <FiFileText /> PDF
                        </span>
                      )}
                      {lesson.videoUrl && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                          <FiFilm /> Video
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-500 hover:text-red-700"
                        onClick={() =>
                          setConfirmDelete({ type: "lesson", item: lesson })
                        }
                      >
                        <FiTrash2 size={22} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* QUIZZES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-blue-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="bg-blue-100 p-3 rounded-2xl"
            >
              <FiEdit className="text-blue-700 text-3xl" />
            </motion.div>
            <h2 className="text-3xl font-bold text-blue-700">Quizzes</h2>
          </div>

          {quizzes.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <FiEdit className="text-5xl mx-auto mb-3 text-gray-400" />
              No quizzes created yet.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-gray-600 bg-blue-50">
                  <th className="p-3">Title</th>
                  <th className="p-3">Questions</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {quizzes.map((quiz, i) => (
                  <motion.tr
                    key={quiz._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b hover:bg-blue-50/40 transition"
                  >
                    <td className="p-3 font-semibold text-blue-700">
                      {quiz.title}
                    </td>

                    <td className="p-3">{quiz.questions.length}</td>

                    <td className="p-3 text-center">
                      <motion.button
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-500 hover:text-red-700"
                        onClick={() =>
                          setConfirmDelete({ type: "quiz", item: quiz })
                        }
                      >
                        <FiTrash2 size={22} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 w-80 shadow-2xl border-4 border-red-300 text-center"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 160 }}
            >
              <FiAlertTriangle className="text-red-500 text-5xl mx-auto mb-2" />

              <h3 className="text-2xl font-bold text-red-600 mb-3">
                Are You Sure?
              </h3>

              <p className="text-gray-700 mb-4">
                Delete{" "}
                <span className="font-semibold text-red-700">
                  “{confirmDelete.item.title}”
                </span>{" "}
                permanently?
              </p>

              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                  onClick={() =>
                    confirmDelete.type === "lesson"
                      ? deleteLesson.mutate(confirmDelete.item._id)
                      : deleteQuiz.mutate(confirmDelete.item._id)
                  }
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
