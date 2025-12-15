import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { Link } from "react-router-dom";

export default function StudentChatList() {
  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => (await api.get("/chat/teachers")).data
  });

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Message a Teacher</h1>

        {teachers.map((t) => (
          <Link
            key={t._id}
            to={`/student/chat/${t._id}`}
            className="block p-4 bg-white shadow rounded mb-3"
          >
            {t.name} — {t.email}
          </Link>
        ))}
      </div>
    </>
  );
}
