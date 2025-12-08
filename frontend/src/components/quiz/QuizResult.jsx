import React from "react";
import { Link } from "react-router-dom";

export default function QuizResult({ result }) {
  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-3">Quiz Result</h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-4">
        <div className="text-xl font-semibold">
          Score: {result.score} / {result.totalMarks}
        </div>

        <div className="text-gray-600 mt-2">
          XP Earned: <b>{result.xpEarned}</b>
        </div>

        {result.newBadges?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Badges Earned:</h3>
            <ul className="mt-2 space-y-1">
              {result.newBadges.map((b, i) => (
                <li
                  key={i}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded inline-block"
                >
                  🏅 {b}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link
        to="/lessons"
        className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
      >
        Back to Lessons
      </Link>
    </div>
  );
}
