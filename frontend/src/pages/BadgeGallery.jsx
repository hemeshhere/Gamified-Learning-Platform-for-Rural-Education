// src/pages/BadgeGallery.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";

export default function BadgeGallery() {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const studentId = user?.id || user?._id;

  // Student earned badges
  const { data: earned = [], isLoading: loadingEarned } = useQuery({
    queryKey: ["badges-earned", studentId],
    enabled: !!studentId,
    queryFn: async () => {
      const res = await api.get(`/progress/badges/${studentId}`);
      // expected { badges: [ {name, description, icon?} ] }
      return res.data?.badges || [];
    },
  });

  // Badge catalog (optional)
  const { data: catalog = [], isLoading: loadingCatalog } = useQuery({
    queryKey: ["badges-catalog"],
    queryFn: async () => {
      try {
        const res = await api.get("/badges"); // optional endpoint
        return res.data || [];
      } catch {
        return []; // silent fallback
      }
    },
  });

  const catalogMap = Object.fromEntries((catalog || []).map((b) => [b.name || b.title, b]));

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Badge Gallery</h1>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Your Badges</h2>
          {loadingEarned ? (
            <div>Loading your badges...</div>
          ) : earned.length === 0 ? (
            <div className="text-gray-500">You haven't earned any badges yet.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {earned.map((b, i) => {
                const meta = catalogMap[b] || {};
                return (
                  <div key={b + i} className="bg-white p-4 rounded-lg shadow flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-200 flex items-center justify-center text-2xl">🏅</div>
                    <div className="font-medium mt-2">{meta.name || b}</div>
                    <div className="text-xs text-gray-500 mt-1">{meta.description || ""}</div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">All Badges</h2>
          {loadingCatalog ? (
            <div>Loading catalog...</div>
          ) : catalog.length === 0 ? (
            <div className="text-gray-500">No badge catalog available.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {catalog.map((b) => (
                <div key={b.name || b._id} className="bg-white p-4 rounded-lg shadow text-center">
                  <div className="w-16 h-16 rounded-full bg-yellow-200 flex items-center justify-center text-2xl mx-auto">🏅</div>
                  <div className="font-medium mt-2">{b.name || b.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{b.description}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
