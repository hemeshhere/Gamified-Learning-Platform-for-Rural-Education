// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../api/axios";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [status, setStatus] = useState(""); // success | error | ""

  const submit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      setStatus("success");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setStatus("error");
    }
  };

  const passwordStrength =
    newPassword.length === 0
      ? ""
      : newPassword.length >= 8
      ? "strong"
      : "weak";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <motion.form
        onSubmit={submit}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white w-[380px] p-8 rounded-3xl shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
            className="bg-purple-500 text-white p-4 rounded-full shadow-lg mb-3"
          >
            <FiShield size={28} />
          </motion.div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            Change Password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Keep your account secure
          </p>
        </div>

        {/* STATUS MESSAGE */}
        {status === "success" && (
          <div className="mb-4 flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm">
            <FiCheckCircle /> Password updated successfully
          </div>
        )}

        {status === "error" && (
          <div className="mb-4 flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm">
            <FiAlertCircle /> Failed to update password
          </div>
        )}

        {/* CURRENT PASSWORD */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:border-purple-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showOld ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* NEW PASSWORD */}
        <div className="mb-2">
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:border-purple-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showNew ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* PASSWORD STRENGTH */}
        {passwordStrength && (
          <div className="text-xs mb-4 flex items-center gap-1">
            <FiLock
              className={
                passwordStrength === "strong"
                  ? "text-green-600"
                  : "text-orange-500"
              }
            />
            <span className="text-gray-600">
              Strength:
              <span
                className={`ml-1 font-bold ${
                  passwordStrength === "strong"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {passwordStrength === "strong" ? "Strong" : "Weak"}
              </span>
            </span>
          </div>
        )}

        {/* SUBMIT */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
        >
          <FiLock /> Update Password
        </motion.button>
      </motion.form>
    </div>
  );
}
