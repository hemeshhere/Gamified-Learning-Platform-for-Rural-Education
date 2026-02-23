import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { Link } from "react-router-dom";
import { FaChalkboardTeacher, FaEnvelope, FaComments } from "react-icons/fa";

export default function StudentChatList() {
  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => (await api.get("/chat/teachers")).data,
  });

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-purple-700">
          <FaComments className="text-pink-500" />
          Chat with Your Teachers
        </h1>

        {/* Empty State */}
        {teachers.length === 0 && (
          <p className="text-gray-500 text-center">
            No teachers available right now 😊
          </p>
        )}

        {/* Teacher Cards */}
        <div className="space-y-4">
          {teachers.map((t) => (
            <Link
              key={t._id}
              to={`/student/chat/${t._id}`}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 
                         border border-purple-100 rounded-xl shadow-sm 
                         hover:shadow-md hover:scale-[1.02] transition"
            >
              {/* Icon Avatar */}
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl">
                <FaChalkboardTeacher />
              </div>

              {/* Teacher Info */}
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-800">
                  {t.name}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaEnvelope className="text-pink-500" />
                  {t.email}
                </p>
              </div>

              {/* CTA */}
              <div className="text-purple-600 font-bold text-sm">
                Say Hi 👋
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
