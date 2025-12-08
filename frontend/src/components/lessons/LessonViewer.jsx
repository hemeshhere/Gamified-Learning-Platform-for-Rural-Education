import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import Navbar from "../common/Navbar";
import XPPopup from "../common/XPPopup";
import { motion } from "framer-motion";

/* --------------------------------------------------
   Convert ANY YouTube URL → embeddable iframe URL
----------------------------------------------------*/
function convertYoutubeUrl(url) {
  if (!url) return null;

  try {
    if (url.includes("embed")) return url;

    const watchMatch = url.match(/v=([^&]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);

    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    if (shortMatch) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    if (url.includes("/shorts/")) {
      const id = url.split("/shorts/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  } catch {
    return null;
  }
}

export default function LessonViewer() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const studentId = user?.id || user?._id;

  const [xpEarned, setXpEarned] = useState(null);

  /* ---------------- Fetch Lesson ---------------- */
  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => (await api.get(`/lessons/${id}`)).data,
  });

  /* ---------------- Fetch Progress to check completion ---------------- */
  const { data: progress = {} } = useQuery({
    queryKey: ["progress", studentId],
    enabled: !!studentId,
    queryFn: async () => (await api.get(`/progress/${studentId}`)).data,
  });

  const completedLessons = progress?.lessonsCompleted?.map((l) => l._id) || [];
  const alreadyCompleted = completedLessons.includes(id);

  /* ---------------- Mark Complete ---------------- */
  const markCompleted = async () => {
    try {
      const res = await api.post("/progress/complete", { lessonId: id });
      const xp = res.data?.xpEarned || 0;

      if (xp > 0) {
        setXpEarned(xp);
        setTimeout(() => setXpEarned(null), 2500);
      }

      queryClient.invalidateQueries(["progress", studentId]);
    } catch {
      alert("Failed to mark as complete.");
    }
  };

  /* ---------------- UI States ---------------- */
  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Loading lesson...</div>;

  if (error || !lesson)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load lesson. Please try again.
      </div>
    );

  const embedUrl = convertYoutubeUrl(lesson.videoUrl);

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-3"
        >
          {lesson.title}
        </motion.h1>

        <p className="text-gray-700 mb-6">{lesson.description}</p>

        {/* ---------------- PDF Viewer ---------------- */}
        {lesson.fileUrl && (
          <div className="mb-8">
            <h2 className="font-semibold mb-2 text-lg">📄 PDF Material</h2>
            <iframe
              src={lesson.fileUrl}
              title="Lesson PDF"
              className="w-full h-[600px] border rounded-lg shadow"
            />
          </div>
        )}

        {/* ---------------- Video Viewer ---------------- */}
        {lesson.videoUrl && (
          <div className="mb-8">
            <h2 className="font-semibold mb-2 text-lg">🎥 Video Lesson</h2>

            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-[400px] rounded-lg shadow-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-red-500">Invalid video URL.</div>
            )}
          </div>
        )}

        {/* ---------------- Mark Complete Button ---------------- */}
        <div className="mt-6">
          <motion.button
            whileHover={!alreadyCompleted ? { scale: 1.05 } : {}}
            whileTap={!alreadyCompleted ? { scale: 0.95 } : {}}
            disabled={alreadyCompleted}
            onClick={markCompleted}
            className={`px-6 py-3 rounded-lg text-white font-semibold shadow-md transition ${
              alreadyCompleted
                ? "bg-green-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {alreadyCompleted
              ? "✔ Lesson Already Completed"
              : "Mark as Completed"}
          </motion.button>
        </div>
      </div>

      {/* XP Popup */}
      {xpEarned !== null && <XPPopup xp={xpEarned} />}
    </>
  );
}
