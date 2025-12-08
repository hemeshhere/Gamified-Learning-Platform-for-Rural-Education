import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";

function ProgressStat({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function ProgressPage() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const studentId = user?.id || user?._id;

  const {
    data: progress,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["progress", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const res = await api.get(`/progress/${studentId}`);
      return res.data;
    },
    staleTime: 1000 * 60, // 1 minute
  });

  if (!studentId) {
    return (
      <div className="p-6">
        <Navbar />
        <div className="p-6 text-center text-gray-600">
          No student selected. Please login.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Navbar />
        <div className="p-6 text-center text-gray-600">Loading progress...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Navbar />
        <div className="p-6 text-center text-red-500">
          Failed to load progress. Try again later.
        </div>
      </div>
    );
  }

  // progress structure expected (from backend):
  // { xp, level, completedLessons: [{ id, title, completedAt }], badges: [{ name, description, icon? }], ... }
  const xp = progress?.xp ?? 0;
  const level = progress?.level ?? 1;
  const completed = progress?.completedLessons ?? [];
  const badges = progress?.badges ?? [];

  // show progress to next level: assuming level formula level = floor(xp / 100) + 1
  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const xpIntoLevel = xp - xpForCurrentLevel;
  const levelProgressPct = Math.max(
    0,
    Math.min(100, Math.round((xpIntoLevel / (xpForNextLevel - xpForCurrentLevel)) * 100))
  );

  return (
    <div>
      <Navbar />

      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Progress</h1>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ProgressStat label="XP" value={xp} />
          <ProgressStat label="Level" value={level} />
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500 mb-2">Level Progress</div>

            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>

            <div className="text-xs text-gray-600 mt-2">
              {xpIntoLevel} XP / {xpForNextLevel - xpForCurrentLevel} XP ({levelProgressPct}%)
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: completed lessons & recent activity */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-lg font-semibold mb-3">Completed Lessons</h2>

            {completed.length === 0 ? (
              <div className="text-gray-500">No lessons completed yet.</div>
            ) : (
              <ul className="space-y-3">
                {completed.map((l) => (
                  <li key={l._id || l.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-blue-600">
                        📘
                      </div>
                      <div>
                        <div className="font-medium">{l.title}</div>
                        <div className="text-xs text-gray-500">
                          {l.completedAt ? new Date(l.completedAt).toLocaleString() : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{l.grade ? `Grade ${l.grade}` : ""}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right: badges */}
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-lg font-semibold mb-3">Badges</h2>

            {badges.length === 0 ? (
              <div className="text-gray-500">No badges earned yet — complete lessons & quizzes to earn badges!</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {badges.map((b, i) => (
                  <div key={b._id || b.name || i} className="border rounded p-3 flex items-start gap-3 bg-gray-50">
                    <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center text-xl">🏅</div>
                    <div>
                      <div className="font-medium">{b.name || b.title}</div>
                      <div className="text-xs text-gray-600">{b.description || ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Optional: quick actions */}
        <section className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => window.location.assign("/lessons")} className="px-4 py-2 bg-blue-600 text-white rounded">Browse Lessons</button>
          <button onClick={() => window.location.assign("/quiz")} className="px-4 py-2 bg-green-600 text-white rounded">Take Quiz</button>
        </section>
      </main>
    </div>
  );
}
