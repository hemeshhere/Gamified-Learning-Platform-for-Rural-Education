import React, { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit3,
  FiPlusCircle,
  FiTrash2,
  FiBookOpen,
  FiStar,
} from "react-icons/fi";

export default function QuizCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  /* ADD QUESTION */
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: "",
        options: ["", ""],
        answerIndex: 0,
        marks: 1,
      },
    ]);
  };

  /* UPDATE QUESTION */
  const updateQuestionText = (i, value) => {
    const copy = [...questions];
    copy[i].text = value;
    setQuestions(copy);
  };

  const updateOption = (qi, oi, value) => {
    const copy = [...questions];
    copy[qi].options[oi] = value;
    setQuestions(copy);
  };

  const addOption = (qi) => {
    const copy = [...questions];
    copy[qi].options.push("");
    setQuestions(copy);
  };

  const removeOption = (qi, oi) => {
    const copy = [...questions];
    if (copy[qi].options.length > 2) {
      copy[qi].options.splice(oi, 1);
      setQuestions(copy);
    }
  };

  /* SUBMIT QUIZ */
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      await api.post("/quiz", { title, questions });
      setMessage("🎉 Quiz created successfully! Redirecting...");
      setTimeout(() => navigate("/quiz"), 1500);
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "❌ Failed to create quiz. Try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-yellow-200 via-purple-200 to-pink-200 opacity-90"></div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="fixed top-24 left-10 text-purple-600 opacity-40"
      >
        <FiEdit3 size={70} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="fixed bottom-12 right-12 text-yellow-500 opacity-40"
      >
        <FiStar size={75} />
      </motion.div>

      {/* MAIN CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto p-6 mt-10"
      >
        <h1 className="text-5xl font-extrabold mb-8 flex items-center gap-3 text-purple-700 drop-shadow-sm">
          📝 Create New Quiz
        </h1>

        {/* Status Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-2xl mb-4 text-md shadow-xl border ${
              message.includes("success")
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* FORM */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* QUIZ TITLE */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border-2 border-purple-300 shadow-xl">
            <label className="font-semibold text-purple-700 block mb-2 text-lg">
              📚 Quiz Title *
            </label>
            <input
              type="text"
              required
              className="w-full border px-4 py-3 rounded-xl shadow focus:ring-2 focus:ring-purple-400 outline-none bg-purple-50"
              placeholder="Math Quiz: Fractions & Decimals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* QUESTIONS LIST */}
          <AnimatePresence>
            {questions.map((q, qi) => (
              <motion.div
                key={qi}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border-2 border-pink-300 shadow-lg space-y-5"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-purple-800">
                    Question {qi + 1} 🎯
                  </h2>

                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    onClick={() =>
                      setQuestions((prev) =>
                        prev.filter((_, idx) => idx !== qi)
                      )
                    }
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FiTrash2 size={22} />
                  </motion.button>
                </div>

                {/* Question Text */}
                <input
                  type="text"
                  required
                  className="w-full border px-4 py-3 rounded-xl shadow focus:ring-2 focus:ring-purple-400 outline-none bg-purple-50"
                  placeholder="Enter your question here"
                  value={q.text}
                  onChange={(e) => updateQuestionText(qi, e.target.value)}
                />

                {/* OPTIONS */}
                <div>
                  <label className="font-semibold text-pink-700 block mb-2">
                    🧩 Options
                  </label>
                  <div className="space-y-3">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-3">
                        <input
                          type="text"
                          required
                          className="w-full border px-4 py-3 rounded-xl shadow focus:ring-2 focus:ring-pink-400 bg-pink-50"
                          placeholder={`Option ${oi + 1}`}
                          value={opt}
                          onChange={(e) =>
                            updateOption(qi, oi, e.target.value)
                          }
                        />

                        {/* Remove Option */}
                        {q.options.length > 2 && (
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeOption(qi, oi)}
                          >
                            <FiTrash2 size={18} />
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Option */}
                  <button
                    type="button"
                    onClick={() => addOption(qi)}
                    className="mt-2 text-purple-700 text-sm flex items-center gap-2 hover:underline"
                  >
                    <FiPlusCircle /> Add another option
                  </button>
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="font-semibold text-blue-700 block mb-2">
                    ✔ Correct Answer
                  </label>
                  <select
                    className="w-full border px-4 py-3 rounded-xl shadow focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
                    value={q.answerIndex}
                    onChange={(e) => {
                      const copy = [...questions];
                      copy[qi].answerIndex = Number(e.target.value);
                      setQuestions(copy);
                    }}
                  >
                    {q.options.map((_, oi) => (
                      <option key={oi} value={oi}>
                        Option {oi + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marks */}
                <div>
                  <label className="font-semibold text-yellow-700 block mb-2">
                    ⭐ Marks
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full border px-4 py-3 rounded-xl shadow focus:ring-2 focus:ring-yellow-400 outline-none bg-yellow-50"
                    value={q.marks}
                    onChange={(e) => {
                      const copy = [...questions];
                      copy[qi].marks = Number(e.target.value);
                      setQuestions(copy);
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* ADD QUESTION BUTTON */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addQuestion}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl text-lg shadow-xl hover:bg-purple-700"
          >
            <FiPlusCircle /> Add New Question
          </motion.button>

          {/* SUBMIT BUTTON */}
          <motion.button
            type="submit"
            disabled={busy}
            whileHover={!busy ? { scale: 1.05 } : {}}
            whileTap={!busy ? { scale: 0.95 } : {}}
            className={`w-full py-3 rounded-xl text-white font-bold text-xl shadow-lg transition ${
              busy
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {busy ? "Creating Quiz..." : "🚀 Create Quiz"}
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}
