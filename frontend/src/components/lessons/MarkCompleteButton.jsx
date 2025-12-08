import React, { useState } from "react";
import api from "../../api/axios";
import XPPopup from "../common/XPPopup";
import BadgePopup from "../common/BadgePopup";
import { useQueryClient } from "@tanstack/react-query";

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

      // Invalidate / refetch the progress query for this student
      if (studentId) {
        queryClient.invalidateQueries({ queryKey: ["progress", studentId] });
      }

      // Optionally, update local 'user' xp/level in localStorage if backend returns updated user
      if (data.updatedProgress) {
        // keep local user in sync (optional)
        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            const u = JSON.parse(stored);
            u.xp = data.updatedProgress.xp ?? u.xp;
            u.level = data.updatedProgress.level ?? u.level;
            localStorage.setItem("user", JSON.stringify(u));
          } catch (e) {
            // ignore parse errors
          }
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
      <button
        onClick={markComplete}
        disabled={busy}
        className={`px-5 py-2 rounded-lg text-white font-semibold transition
          ${
            busy
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
      >
        {busy ? "Saving..." : "Mark as Complete"}
      </button>

      {xp && <XPPopup xp={xp} />}
      {badges.length > 0 && <BadgePopup badges={badges} />}
    </>
  );
}
