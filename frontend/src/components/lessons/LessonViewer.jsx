import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import Navbar from "../common/Navbar";
import XPPopup from "../common/XPPopup";
import { motion } from "framer-motion";
import { FiBookOpen, FiStar } from "react-icons/fi";

/*    Convert ANY YouTube URL → proper embed URL  */
function convertYoutubeUrl(url) {
  if (!url) return null;

  try {
    if (url.includes("embed")) return url;
    if (url.includes("/shorts/"))
      return `https://www.youtube.com/embed/${url.split("/shorts/")[1].split("?")[0]}`;

    const watchMatch = url.match(/v=([^&]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

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

  /* Fetch Lesson */
  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => (await api.get(`/lessons/${id}`)).data,
  });

  /* Fetch Progress */
  const { data: progress = {} } = useQuery({
    queryKey: ["progress", studentId],
    enabled: !!studentId,
    queryFn: async () => (await api.get(`/progress/${studentId}`)).data,
  });

  const completedLessons = progress?.lessonsCompleted?.map((l) => l._id) || [];
  const alreadyCompleted = completedLessons.includes(id);

  /* Mark Completed */
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

  /* Loading & Error */
  if (isLoading)
    return (
      <div className="p-6 text-center text-purple-600 text-xl">
        Loading lesson...
      </div>
    );

  if (error || !lesson)
    return (
      <div className="p-6 text-center text-red-500 text-xl">
        Failed to load lesson.
      </div>
    );

  const embedUrl = convertYoutubeUrl(lesson.videoUrl);

  return (
    <>
      <Navbar />

      {/*  Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 opacity-90"></div>

      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="fixed top-28 left-10 text-blue-600 opacity-40"
      >
        <FiBookOpen size={80} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="fixed bottom-20 right-10 text-yellow-500 opacity-40"
      >
        <FiStar size={75} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 max-w-4xl mx-auto mt-6"
      >
        {/* Title */}
        <motion.h1
          className="text-4xl font-extrabold text-purple-800 drop-shadow mb-3"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {lesson.title}
        </motion.h1>

        <p className="text-gray-700 mb-6 text-lg">{lesson.description}</p>

        {/* PDF Viewer */}
        {lesson.fileUrl && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-white/70 backdrop-blur-xl border-2 border-blue-200 rounded-3xl p-5 shadow-xl"
          >
            <h2 className="text-xl font-bold text-blue-600 mb-3">
              📄 PDF Material
            </h2>

            <iframe
              src={lesson.fileUrl}
              title="Lesson PDF"
              className="w-full h-[600px] rounded-xl border shadow-lg"
            />
          </motion.div>
        )}

        {/* Video Viewer */}
        {lesson.videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 bg-white/70 backdrop-blur-xl border-2 border-red-200 rounded-3xl p-5 shadow-xl"
          >
            <h2 className="text-xl font-bold text-red-600 mb-3">
              🎥 Video Lesson
            </h2>

            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-[420px] rounded-xl shadow-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-red-500 font-semibold">
                Invalid video URL.
              </div>
            )}
          </motion.div>
        )}

        {/* Mark Complete Button */}
        <div className="mt-8">
          <motion.button
            whileHover={!alreadyCompleted ? { scale: 1.05 } : {}}
            whileTap={!alreadyCompleted ? { scale: 0.95 } : {}}
            disabled={alreadyCompleted}
            onClick={markCompleted}
            className={`px-8 py-3 rounded-full text-white font-semibold shadow-lg transition text-lg ${
              alreadyCompleted
                ? "bg-green-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
            }`}
          >
            {alreadyCompleted
              ? "✔ Lesson Already Completed"
              : "Mark as Completed"}
          </motion.button>
        </div>
      </motion.div>

      {/* XP Popup */}
      {xpEarned !== null && <XPPopup xp={xpEarned} />}
    </>
  );
}
