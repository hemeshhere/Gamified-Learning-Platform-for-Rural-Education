import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { Link } from "react-router-dom";

export default function TeacherChatList() {
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: async () => (await api.get("/chat/students")).data
  });

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Student Messages</h1>

        {students.map((s) => (
          <Link
            key={s._id}
            to={`/teacher/chat/${s._id}`}
            className="block p-4 bg-white shadow rounded mb-3"
          >
            {s.name} — {s.email}
          </Link>
        ))}
      </div>
    </>
  );
}
