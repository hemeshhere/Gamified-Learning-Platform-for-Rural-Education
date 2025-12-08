import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import Navbar from "../common/Navbar";
import { Link } from "react-router-dom";

export default function QuizList() {
  const {
    data: quizzes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const res = await api.get("/quiz"); // <-- update if needed
      return res.data;
    },
  });

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Available Quizzes</h1>

        {/* Loading */}
        {isLoading && (
          <div className="text-center text-gray-600">Loading quizzes...</div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-500">
            Failed to load quizzes.
          </div>
        )}

        {/* No quizzes */}
        {!isLoading && quizzes.length === 0 && (
          <div className="text-center text-gray-500">
            No quizzes available yet.
          </div>
        )}

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <h2 className="text-lg font-semibold mb-2">{quiz.title}</h2>

                <div className="text-sm text-gray-600 mb-2">
                  Questions: <b>{quiz.questions?.length ?? 0}</b>
                </div>

                <div className="text-sm text-gray-600">
                  Total Marks:{" "}
                  <b>
                    {quiz.questions?.reduce(
                      (total, q) => total + (q.marks || 0),
                      0
                    )}
                  </b>
                </div>
              </div>

              <Link
                to={`/quiz/${quiz._id}`}
                className="mt-4 text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
