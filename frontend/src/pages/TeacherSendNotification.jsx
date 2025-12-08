// src/pages/TeacherSendNotification.jsx
import React, { useState } from "react";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { useMutation } from "@tanstack/react-query";

export default function TeacherSendNotification() {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");

  // ✅ React Query v5 compatible mutation
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post("/notifications", payload);
      return res.data;
    },

    onSuccess: () => {
      setMessage("Notification sent successfully 🎉");
      setTitle("");
      setBody("");
      setUserId("");
    },

    onError: (err) => {
      setMessage(
        err?.response?.data?.message || "Failed to send notification."
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!title || !body) {
      setMessage("Please provide title and message body.");
      return;
    }

    mutation.mutate({
      userId: userId || null,
      title,
      body,
      type: "teacher",
    });
  };

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Send Notification</h1>

        {message && (
          <div className="mb-4 p-3 rounded bg-gray-100 border text-gray-700">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md space-y-4"
        >
          {/* User ID */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Target User (optional)
            </label>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Student ID (leave blank to broadcast)"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              placeholder="Great job!"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={4}
              required
              placeholder="You completed X lessons today..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full py-2 rounded-lg text-white font-semibold transition ${
              mutation.isPending
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {mutation.isPending ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>
    </>
  );
}
