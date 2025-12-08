import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/common/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiStar,
  FiBell,
  FiAward,
  FiSettings,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

export default function TeacherStudentList() {
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: async () => (await api.get("/users/students")).data,
  });

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  // Filtering logic
  const filteredStudents = students.filter((s) => {
    const matchesName = s?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesEmail = s?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = filterLevel ? s.level == filterLevel : true;
    return (matchesName || matchesEmail) && matchesLevel;
  });

  return (
    <>
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto p-6"
      >
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          👨‍🏫 Manage Students
        </h1>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search input */}
          <div className="flex items-center bg-white shadow-md px-4 py-2 rounded-xl w-full sm:w-1/2">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              className="w-full outline-none"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Level */}
          <div className="flex items-center bg-white shadow-md px-4 py-2 rounded-xl w-full sm:w-1/4">
            <FiFilter className="text-gray-500 mr-2" />
            <select
              className="w-full outline-none bg-transparent"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              {[1, 2, 3, 4, 5, 6].map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading / Error */}
        {isLoading && (
          <div className="text-center text-gray-600">Loading students...</div>
        )}
        {error && (
          <div className="text-center text-red-500">Failed to load students.</div>
        )}

        {/* No results */}
        {!isLoading && filteredStudents.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No students match your search.
          </div>
        )}

        {/* STUDENT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <AnimatePresence>
            {filteredStudents.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white/70 backdrop-blur-xl border border-gray-200 p-5 rounded-2xl shadow-xl hover:shadow-2xl transition cursor-pointer"
              >
                {/* Student Header */}
                <div className="flex items-center gap-3 mb-3">
                  <FiUser className="text-blue-600 text-3xl" />
                  <div>
                    <h2 className="text-xl font-semibold">
                      {s.name || "Unnamed Student"}
                    </h2>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <FiMail /> {s.email}
                    </p>
                  </div>
                </div>

                {/* XP & Level */}
                <div className="flex justify-between mt-3 mb-4">
                  <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                    <FiStar /> {s.xp} XP
                  </div>

                  <div className="flex items-center gap-1 text-purple-600 font-semibold">
                    <FiAward /> Level {s.level}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between mt-4">
                  {/* Add XP */}
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    className="text-yellow-600 hover:text-yellow-800"
                    onClick={() => alert(`Add XP to ${s.email}`)}
                  >
                    <FiStar size={22} />
                  </motion.button>

                  {/* Send Notification */}
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => alert(`Notify ${s.email}`)}
                  >
                    <FiBell size={22} />
                  </motion.button>

                  {/* Open Profile */}
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    className="text-gray-700 hover:text-gray-900"
                    onClick={() => alert(`Open profile of ${s.email}`)}
                  >
                    <FiSettings size={22} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
