// src/components/quiz/QuizAttempt.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import Navbar from "../common/Navbar";
import XPPopup from "../common/XPPopup";
import BadgePopup from "../common/BadgePopup";
import QuizResult from "./QuizResult";
import { motion } from "framer-motion";
import { FiStar, FiBookOpen } from "react-icons/fi";

export default function QuizAttempt() {
  const { quizId } = useParams();
  const queryClient = useQueryClient();

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const studentId = user?.id || user?._id;

  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [xpEarned, setXpEarned] = useState(null);
  const [newBadges, setNewBadges] = useState([]);

  /* -------------------- FETCH QUIZ DATA -------------------- */
  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => (await api.get(`/quiz/${quizId}`)).data,
  });

  /* -------------------- UPDATE ANSWER -------------------- */
  const updateAnswer = (questionId, index) => {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  /* -------------------- SUBMIT QUIZ -------------------- */
  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, answerIndex]) => ({
          questionId,
          answer: answerIndex,
        })),
      };

      const res = await api.post(`/quiz/attempt/${quizId}`, payload);
      const data = res.data;

      setResult(data);
      setXpEarned(data.xpEarned || null);
      setNewBadges(data.newBadges || []);
      queryClient.invalidateQueries(["progress", studentId]);

      setTimeout(() => setXpEarned(null), 2500);
      setTimeout(() => setNewBadges([]), 3500);
    } catch (err) {
      const backend = err?.response?.data;

      if (backend?.error === "You have already submitted this quiz.") {
        setResult({
          alreadySubmitted: true,
          score: backend.score,
          xpEarned: backend.xpEarned,
        });
      } else {
        alert("Quiz submission failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- LOADING / ERROR -------------------- */
  if (isLoading)
    return <div className="text-center p-6 text-purple-700 text-xl">Loading quiz...</div>;

  if (error || !quiz)
    return <div className="text-center p-6 text-red-600">Failed to load quiz.</div>;

  /* -------------------- ALREADY SUBMITTED -------------------- */
  if (result?.alreadySubmitted) {
    return (
      <>
        <Navbar />

        {/* Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-red-200 via-pink-200 to-yellow-200 opacity-90"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto mt-12 p-6 bg-white/80 backdrop-blur-xl border-2 border-pink-300 rounded-3xl shadow-xl text-center"
        >
          <h2 className="text-4xl font-extrabold text-red-500 mb-3">
            🚫 Already Attempted!
          </h2>
          <p className="text-gray-700 mb-4 text-lg">You cannot retake this quiz.</p>

          <div className="text-xl font-bold text-purple-700 mb-2">
            Score: {result.score}
          </div>

          <div className="text-green-600 font-semibold mb-6 text-lg">
            XP Earned: +{result.xpEarned}
          </div>

          <Link
            to="/quiz"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition text-lg"
          >
            Back to Quizzes →
          </Link>
        </motion.div>
      </>
    );
  }

  /* -------------------- SHOW RESULT -------------------- */
  if (result) return <QuizResult result={result} />;

  /* -------------------- SHOW QUIZ TO ATTEMPT -------------------- */
  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 opacity-90"></div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="fixed top-24 left-12 text-yellow-500 opacity-40"
      >
        <FiStar size={70} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="fixed bottom-12 right-12 text-purple-600 opacity-40"
      >
        <FiBookOpen size={70} />
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto p-6">
        <motion.h1
          className="text-5xl font-extrabold mb-8 text-purple-700 drop-shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {quiz.title}
        </motion.h1>

        <div className="space-y-6">
          {quiz.questions.map((q, index) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border-2 border-purple-200 shadow-xl"
            >
              {/* Question Text */}
              <h3 className="font-bold text-xl mb-4 text-purple-800">
                {index + 1}. {q.text}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      answers[q._id] === i
                        ? "bg-purple-100 border-purple-400 shadow-md"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      checked={answers[q._id] === i}
                      onChange={() => updateAnswer(q._id, i)}
                      className="cursor-pointer"
                    />
                    <span className="text-gray-700">{opt}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* SUBMIT BUTTON */}
        <motion.button
          whileHover={!submitting ? { scale: 1.05 } : {}}
          whileTap={!submitting ? { scale: 0.95 } : {}}
          className={`mt-8 w-full py-4 rounded-xl text-white text-xl font-bold shadow-xl ${
            submitting
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-800"
          }`}
          disabled={submitting}
          onClick={submitQuiz}
        >
          {submitting ? "Submitting..." : "🚀 Submit Quiz"}
        </motion.button>
      </div>

      {/* POPUPS */}
      {xpEarned !== null && <XPPopup xp={xpEarned} />}
      {newBadges.length > 0 && <BadgePopup badges={newBadges} />}
    </>
  );
}
