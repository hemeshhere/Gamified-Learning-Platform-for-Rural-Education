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

      <div className="max-w-6xl mx-auto p-6">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-8 text-gray-800"
        >
          Manage Lessons & Quizzes
        </motion.h1>

        {/* ----------------- LESSONS ----------------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-10 border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-700">
            <FiBook /> Lessons
          </h2>

          {lessons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiFileText className="text-4xl mx-auto mb-2 text-gray-400" />
              No lessons uploaded yet.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-gray-600">
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{lesson.title}</td>
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
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          setConfirmDelete({ type: "lesson", item: lesson })
                        }
                      >
                        <FiTrash2 size={20} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* ----------------- QUIZZES ----------------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-700">
            <FiEdit /> Quizzes
          </h2>

          {quizzes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiEdit className="text-4xl mx-auto mb-2 text-gray-400" />
              No quizzes created yet.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="p-3">Title</th>
                  <th className="p-3">Questions</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {quizzes.map((quiz, i) => (
                  <motion.tr
                    key={quiz._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{quiz.title}</td>
                    <td className="p-3">{quiz.questions.length}</td>
                    <td className="p-3 text-center">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          setConfirmDelete({ type: "quiz", item: quiz })
                        }
                      >
                        <FiTrash2 size={20} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>

      {/* ----------------- DELETE MODAL ----------------- */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center border border-gray-300"
              initial={{ scale: 0.75 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.75 }}
            >
              <FiAlertTriangle className="text-red-500 text-4xl mx-auto mb-2" />

              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Confirm Delete
              </h3>

              <p className="text-gray-600 mb-4">
                Delete{" "}
                <span className="font-semibold">
                  “{confirmDelete.item.title}”
                </span>
                ?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    confirmDelete.type === "lesson"
                      ? deleteLesson.mutate(confirmDelete.item._id)
                      : deleteQuiz.mutate(confirmDelete.item._id);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
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
