import React, { useState } from "react";
import api from "../../api/axios";
import XPPopup from "../common/XPPopup";
import BadgePopup from "../common/BadgePopup";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function MarkCompleteButton({ lessonId }) {
  const [busy, setBusy] = useState(false);
  const [xp, setXp] = useState(null);
  const [badges, setBadges] = useState([]);
  const queryClient = useQueryClient();

  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const studentId = user?.id || user?._id;

  const markComplete = async () => {
    setBusy(true);

    try {
      const res = await api.post("/progress/complete", { lessonId });
      const data = res.data;

      if (data.xpEarned) setXp(data.xpEarned);
      if (data.newBadges?.length) setBadges(data.newBadges);

      if (studentId) {
        queryClient.invalidateQueries({ queryKey: ["progress", studentId] });
      }

      // Sync updated XP/Level back into localStorage
      if (data.updatedProgress) {
        const stored = localStorage.getItem("user");
        if (stored) {
          const u = JSON.parse(stored);
          u.xp = data.updatedProgress.xp ?? u.xp;
          u.level = data.updatedProgress.level ?? u.level;
          localStorage.setItem("user", JSON.stringify(u));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to mark lesson as complete.");
    } finally {
      setBusy(false);
      setTimeout(() => setXp(null), 2500);
      setTimeout(() => setBadges([]), 3500);
    }
  };

  return (
    <>
      <motion.button
        onClick={markComplete}
        disabled={busy}
        whileHover={!busy ? { scale: 1.05 } : {}}
        whileTap={!busy ? { scale: 0.93 } : {}}
        className={`px-8 py-3 rounded-full text-white font-bold shadow-xl transition text-lg
          ${
            busy
              ? "bg-green-400 cursor-not-allowed opacity-80"
              : "bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90"
          }`}
      >
        {busy ? "Saving..." : "🎉 Mark as Complete"}
      </motion.button>

      {xp && <XPPopup xp={xp} />}
      {badges.length > 0 && <BadgePopup badges={badges} />}
    </>
  );
}
