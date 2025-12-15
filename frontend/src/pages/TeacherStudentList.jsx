import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  FiTrash2,
  FiEdit3,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function TeacherStudentList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ["students"],
    queryFn: async () => (await api.get("/users/students")).data,
  });

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editLevel, setEditLevel] = useState(1);

  const deleteMutation = useMutation({
    mutationFn: async (id) => await api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
      setSelectedStudent(null);
      alert("Student deleted!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, email, level }) =>
      await api.put(`/users/${id}`, { name, email, level }),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
      setSelectedStudent(null);
      setEditMode(false);
      alert("Student updated!");
    },
  });

  const startEdit = (s) => {
    setEditMode(true);
    setEditName(s.name);
    setEditEmail(s.email);
    setEditLevel(s.level);
  };

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    const byName = s?.name?.toLowerCase().includes(q);
    const byEmail = s?.email?.toLowerCase().includes(q);
    const byLevel = filterLevel ? s.level == filterLevel : true;
    return (byName || byEmail) && byLevel;
  });

  return (
    <>
      <Navbar />

      {/*  Fun Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-200 via-pink-200 to-yellow-200 opacity-80"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto p-6"
      >
        <h1 className="text-5xl font-extrabold mb-6 text-purple-700 flex items-center gap-3">
          🎨 Manage Students
        </h1>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center bg-white/80 backdrop-blur-lg shadow-lg px-4 py-3 rounded-2xl w-full sm:w-1/2"
          >
            <FiSearch className="text-blue-600 mr-2" />
            <input
              className="w-full bg-transparent outline-none text-gray-700"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center bg-white/80 backdrop-blur-lg shadow-lg px-4 py-3 rounded-2xl w-full sm:w-1/4"
          >
            <FiFilter className="text-purple-600 mr-2" />
            <select
              className="w-full bg-transparent outline-none text-gray-700"
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
          </motion.div>
        </div>

        {isLoading && <div className="text-center text-gray-600">Loading...</div>}
        {error && <div className="text-center text-red-600">Failed to load</div>}

        {!isLoading && filteredStudents.length === 0 && (
          <div className="text-center text-gray-500 mt-10 text-lg">
            No matching students 🎈
          </div>
        )}

        {/* Student Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <AnimatePresence>
            {filteredStudents.map((s, i) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 10,
                  delay: i * 0.08,
                }}
                className="bg-white/80 backdrop-blur-xl border-2 border-purple-200 p-5 rounded-3xl shadow-xl hover:shadow-2xl hover:rotate-1 transition-all"
              >
                <div className="flex items-center gap-4 mb-3">
                  <motion.div
                    animate={{
                      y: [0, -6, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                    }}
                    className="bg-purple-100 p-3 rounded-2xl"
                  >
                    <FiUser className="text-purple-700 text-3xl" />
                  </motion.div>

                  <div>
                    <h2 className="text-xl font-bold text-purple-700">{s.name}</h2>
                    <p className="text-gray-600 flex items-center gap-1 text-sm">
                      <FiMail /> {s.email}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between my-4">
                  <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                    <FiStar /> {s.xp} XP
                  </div>
                  <div className="flex items-center gap-1 text-purple-600 font-semibold">
                    <FiAward /> Level {s.level}
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    className="text-yellow-600"
                    onClick={() =>
                      navigate(`/teacher/add-xp?email=${encodeURIComponent(s.email)}`)
                    }
                  >
                    <FiStar size={24} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    className="text-blue-600"
                    onClick={() =>
                      navigate(`/teacher/send-notification?email=${encodeURIComponent(s.email)}`)
                    }
                  >
                    <FiBell size={24} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    className="text-purple-600"
                    onClick={() => {
                      setSelectedStudent(s);
                      setEditMode(false);
                    }}
                  >
                    <FiSettings size={24} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/*  Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 w-96 shadow-2xl border-4 border-purple-300"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                🎈 Manage {selectedStudent.name}
              </h2>

              {editMode ? (
                <>
                  <input
                    className="w-full border rounded-xl px-3 py-2 mb-3"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <input
                    className="w-full border rounded-xl px-3 py-2 mb-3"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />

                  <input
                    type="number"
                    className="w-full border rounded-xl px-3 py-2 mb-3"
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                  />

                  <button
                    className="w-full py-2 rounded-xl bg-green-600 text-white font-semibold"
                    onClick={() =>
                      updateMutation.mutate({
                        id: selectedStudent._id,
                        name: editName,
                        email: editEmail,
                        level: editLevel,
                      })
                    }
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-full py-2 mb-3 rounded-xl bg-blue-600 text-white flex items-center justify-center gap-2"
                    onClick={() => startEdit(selectedStudent)}
                  >
                    <FiEdit3 /> Edit Student
                  </button>

                  <button
                    className="w-full py-2 rounded-xl bg-red-500 text-white flex items-center justify-center gap-2"
                    onClick={() => {
                      if (confirm("Delete this student?")) {
                        deleteMutation.mutate(selectedStudent._id);
                      }
                    }}
                  >
                    <FiTrash2 /> Delete Student
                  </button>
                </>
              )}

              <button
                className="w-full mt-4 py-2 rounded-xl bg-gray-200"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
