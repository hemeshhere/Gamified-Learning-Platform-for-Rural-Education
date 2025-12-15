import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiAward } from "react-icons/fi";

export default function QuizResult({ result }) {
  return (
    <>
      {/*  Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-200 via-yellow-200 to-pink-200 opacity-90"></div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="fixed top-20 left-10 text-yellow-500 opacity-40"
      >
        <FiStar size={70} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="fixed bottom-16 right-12 text-purple-600 opacity-40"
      >
        <FiAward size={70} />
      </motion.div>

      {/*  MAIN RESULT CARD  */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto p-8 mt-16 text-center"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-5xl font-extrabold text-purple-700 drop-shadow-sm mb-6"
        >
          🎉 Quiz Completed!
        </motion.h1>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-purple-300"
        >
          {/* SCORE */}
          <div className="text-3xl font-bold text-purple-800 mb-3">
            Score: {result.score} / {result.totalMarks}
          </div>

          {/* XP */}
          <div className="text-xl text-green-700 font-semibold mb-4">
            ⭐ XP Earned: <span className="text-green-800">{result.xpEarned}</span>
          </div>

          {/* BADGES */}
          {result.newBadges?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-lg text-yellow-700 mb-2">
                🏅 New Badges Unlocked!
              </h3>

              <ul className="mt-2 flex flex-wrap justify-center gap-3">
                {result.newBadges.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className="bg-yellow-200 text-yellow-900 px-4 py-2 rounded-full shadow-md text-md font-semibold flex items-center gap-2"
                  >
                    🏆 {b}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* BUTTON */}
        <motion.div className="mt-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/lessons"
              className="inline-block bg-purple-700 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-xl hover:bg-purple-800"
            >
              Back to Lessons →
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
