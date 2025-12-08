import React, { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit3, FiPlusCircle, FiTrash2 } from "react-icons/fi";

export default function QuizCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // Add new blank question
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

  // Update question text
  const updateQuestionText = (i, value) => {
    const copy = [...questions];
    copy[i].text = value;
    setQuestions(copy);
  };

  // Update option
  const updateOption = (qi, oi, value) => {
    const copy = [...questions];
    copy[qi].options[oi] = value;
    setQuestions(copy);
  };

  // Add option
  const addOption = (qi) => {
    const copy = [...questions];
    copy[qi].options.push("");
    setQuestions(copy);
  };

  // Remove option
  const removeOption = (qi, oi) => {
    const copy = [...questions];
    if (copy[qi].options.length > 2) {
      copy[qi].options.splice(oi, 1);
      setQuestions(copy);
    }
  };

  // Submit quiz
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      await api.post("/quiz", { title, questions });
      setMessage("Quiz created successfully! 🎉 Redirecting...");
      setTimeout(() => navigate("/quiz"), 1200);
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Failed to create quiz. Try again."
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
        className="max-w-4xl mx-auto p-6"
      >
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
          <FiEdit3 className="text-purple-600" /> Create New Quiz
        </h1>

        {/* Message */}
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

        {/* FORM */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* QUIZ TITLE */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border shadow-md">
            <label className="font-semibold text-gray-700 block mb-2">
              Quiz Title *
            </label>
            <input
              type="text"
              required
              className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Math Test 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* QUESTIONS */}
          {questions.map((q, qi) => (
            <motion.div
              key={qi}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border shadow-md space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Question {qi + 1}
                </h2>

                <button
                  type="button"
                  onClick={() =>
                    setQuestions((prev) => prev.filter((_, idx) => idx !== qi))
                  }
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>

              {/* Question text */}
              <input
                type="text"
                required
                className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
                placeholder="Enter question text"
                value={q.text}
                onChange={(e) => updateQuestionText(qi, e.target.value)}
              />

              {/* OPTIONS */}
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Options
                </label>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
                        placeholder={`Option ${oi + 1}`}
                        value={opt}
                        onChange={(e) =>
                          updateOption(qi, oi, e.target.value)
                        }
                      />

                      {q.options.length > 2 && (
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 px-2"
                          onClick={() => removeOption(qi, oi)}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addOption(qi)}
                  className="mt-2 text-purple-600 text-sm flex items-center gap-1 hover:underline"
                >
                  <FiPlusCircle /> Add option
                </button>
              </div>

              {/* CORRECT ANSWER */}
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Correct Answer
                </label>
                <select
                  className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
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

              {/* MARKS */}
              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  Marks
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 outline-none"
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

          {/* ADD QUESTION BUTTON */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={addQuestion}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-700 shadow-sm"
          >
            <FiPlusCircle /> Add Question
          </motion.button>

          {/* SUBMIT BUTTON */}
          <motion.button
            type="submit"
            disabled={busy}
            whileHover={!busy ? { scale: 1.03 } : {}}
            whileTap={!busy ? { scale: 0.97 } : {}}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow transition ${
              busy
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {busy ? "Creating Quiz..." : "Create Quiz"}
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}
