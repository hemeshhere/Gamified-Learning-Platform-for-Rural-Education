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

  // ----------------------------------------------------
  // FETCH QUIZ DETAILS
  // ----------------------------------------------------
  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => (await api.get(`/quiz/${quizId}`)).data,
  });

  // ----------------------------------------------------
  // UPDATE ANSWER
  // ----------------------------------------------------
  const updateAnswer = (questionId, index) => {
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  // ----------------------------------------------------
  // SUBMIT QUIZ ANSWERS
  // ----------------------------------------------------
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

      // SHOW FRIENDLY "ALREADY SUBMITTED" PAGE
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

  // ----------------------------------------------------
  // LOADING & ERROR STATES
  // ----------------------------------------------------
  if (isLoading) return <div className="p-6 text-center">Loading quiz...</div>;

  if (error || !quiz)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load quiz.
      </div>
    );

  // ----------------------------------------------------
  // 🛑 STUDENT ALREADY SUBMITTED QUIZ
  // ----------------------------------------------------
  if (result?.alreadySubmitted) {
    return (
      <>
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg text-center"
        >
          <h2 className="text-3xl font-bold text-red-500 mb-3">
            🛑 Quiz Already Submitted
          </h2>

          <p className="text-gray-700 mb-4">
            You cannot take this quiz again.
          </p>

          <div className="text-lg font-semibold">Your Score: {result.score}</div>

          <div className="text-green-600 font-semibold mb-6">
            XP Earned: +{result.xpEarned}
          </div>

          <Link
            to="/quiz"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
          >
            Back to Quizzes →
          </Link>
        </motion.div>
      </>
    );
  }

  // ----------------------------------------------------
  // 🎉 NORMAL QUIZ RESULT PAGE
  // ----------------------------------------------------
  if (result) {
    return <QuizResult result={result} />;
  }

  // ----------------------------------------------------
  // DISPLAY QUIZ (IF NOT ATTEMPTED)
  // ----------------------------------------------------
  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <motion.h1
          className="text-3xl font-bold mb-6"
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
              className="bg-white p-5 rounded-xl shadow border"
            >
              <h3 className="font-semibold text-lg mb-2">
                {index + 1}. {q.text}
              </h3>

              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${q._id}`}
                      checked={answers[q._id] === i}
                      onChange={() => updateAnswer(q._id, i)}
                      className="cursor-pointer"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`mt-6 w-full py-3 rounded-lg text-white font-semibold transition ${
            submitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={submitting}
          onClick={submitQuiz}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </motion.button>
      </div>

      {/* Popups */}
      {xpEarned !== null && <XPPopup xp={xpEarned} />}
      {newBadges.length > 0 && <BadgePopup badges={newBadges} />}
    </>
  );
}
