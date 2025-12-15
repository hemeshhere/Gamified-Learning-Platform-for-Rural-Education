import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import Navbar from "../common/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBookOpen, FiStar } from "react-icons/fi";

export default function QuizList() {
  const {
    data: quizzes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => (await api.get("/quiz")).data,
  });

  return (
    <>
      <Navbar />

      {/*  Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-yellow-200 via-purple-200 to-pink-200 opacity-90"></div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="fixed top-24 left-12 text-purple-600 opacity-40"
      >
        <FiBookOpen size={70} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="fixed bottom-16 right-12 text-yellow-500 opacity-40"
      >
        <FiStar size={70} />
      </motion.div>

      {/*  MAIN  */}
      <div className="max-w-5xl mx-auto p-6 mt-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-purple-700 drop-shadow-sm flex items-center gap-3 mb-10"
        >
          🧠 Choose a Quiz!
        </motion.h1>

        {/* Loading */}
        {isLoading && (
          <div className="text-center text-purple-700 text-lg">
            Loading quizzes...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-600 text-lg">
            Failed to load quizzes.
          </div>
        )}

        {/* No quizzes */}
        {!isLoading && quizzes.length === 0 && (
          <div className="text-center text-gray-600 text-lg">
            No quizzes available right now.
          </div>
        )}

        {/*  QUIZ GRID  */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {quizzes.map((quiz, i) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white/80 backdrop-blur-xl border-2 border-purple-200 p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:shadow-2xl"
            >
              {/* Quiz Title */}
              <h2 className="text-2xl font-bold text-purple-800 mb-3">
                {quiz.title}
              </h2>

              {/* Stats */}
              <div className="text-gray-700 mb-3 space-y-1">
                <div>
                  Questions:{" "}
                  <b className="text-purple-700">
                    {quiz.questions?.length ?? 0}
                  </b>
                </div>

                <div>
                  Total Marks:{" "}
                  <b className="text-yellow-700">
                    {quiz.questions?.reduce(
                      (total, q) => total + (q.marks || 0),
                      0
                    )}
                  </b>
                </div>
              </div>

              {/* Start Button */}
              <Link
                to={`/quiz/${quiz._id}`}
                className="mt-4 bg-purple-600 text-white text-center py-3 rounded-xl font-bold shadow hover:bg-purple-700 transition"
              >
                🚀 Start Quiz
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
