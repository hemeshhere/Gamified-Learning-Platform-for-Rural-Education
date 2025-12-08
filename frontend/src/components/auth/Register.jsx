import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");

  // Handle field update
  const update = (field, value) => {
    setPayload((p) => ({ ...p, [field]: value }));
    validateField(field, value);
  };

  // ------------------------------
  // VALIDATION RULES
  // ------------------------------
  const validateField = (field, value) => {
    let msg = "";

    if (field === "name" && value.trim().length < 3)
      msg = "Name must be at least 3 characters.";

    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      msg = "Enter a valid email address.";

    if (field === "password" && value.length < 6)
      msg = "Password must be at least 6 characters.";

    if (field === "password" && !/\d/.test(value))
      msg = "Password must contain at least one number.";

    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const isFormValid = () => {
    return (
      payload.name.length >= 3 &&
      payload.email.length > 5 &&
      !errors.email &&
      !errors.password &&
      payload.password.length >= 6
    );
  };

  // ------------------------------
  // FORM SUBMISSION
  // ------------------------------
  const submit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Final validation
    if (!isFormValid()) {
      setServerError("Please fix the errors before submitting.");
      return;
    }

    setBusy(true);

    try {
      const res = await api.post("/auth/register", payload);
      const data = res.data;

      // Save login automatically
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect by role
      navigate(data.user.role === "teacher" ? "/teacher" : "/");
    } catch (err) {
      setServerError(err?.response?.data?.error || "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Create an account</h2>

        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              value={payload.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={payload.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="john@example.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={payload.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a secure password"
              required
              minLength={6}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone (optional)</label>
            <input
              value={payload.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={payload.role}
              onChange={(e) => update("role", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            disabled={busy}
            className={`w-full py-2 rounded-lg text-white font-semibold transition 
              ${busy ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {busy ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-gray-600 text-sm">Already have an account?</span>
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium text-sm hover:underline ml-1"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
