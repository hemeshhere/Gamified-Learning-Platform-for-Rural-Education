import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { Link } from "react-router-dom";
import { FaUserGraduate, FaEnvelope, FaComments } from "react-icons/fa";

export default function TeacherChatList() {
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: async () => (await api.get("/chat/students")).data,
  });

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-blue-700">
          <FaComments className="text-green-500" />
          Student Messages
        </h1>

        {/* Empty State */}
        {students.length === 0 && (
          <p className="text-gray-500 text-center">
            No student messages yet 📭
          </p>
        )}

        {/* Student Cards */}
        <div className="space-y-4">
          {students.map((s) => (
            <Link
              key={s._id}
              to={`/teacher/chat/${s._id}`}
              className="flex items-center gap-4 p-4 
                         bg-gradient-to-r from-blue-50 to-green-50
                         border border-blue-100 rounded-xl shadow-sm
                         hover:shadow-md hover:scale-[1.02] transition"
            >
              {/* Icon Avatar */}
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">
                <FaUserGraduate />
              </div>

              {/* Student Info */}
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800">
                  {s.name}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaEnvelope className="text-green-500" />
                  {s.email}
                </p>
              </div>

              {/* CTA */}
              <div className="text-blue-600 font-bold text-sm">
                Reply 💬
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
