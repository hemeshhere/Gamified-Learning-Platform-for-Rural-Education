import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Gamepad2, Sparkles, Loader2 } from "lucide-react";

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

  // VALIDATION
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

  const isFormValid = () =>
    payload.name.length >= 3 &&
    payload.email.length > 5 &&
    !errors.email &&
    !errors.password &&
    payload.password.length >= 6;

  // SUBMIT
  const submit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!isFormValid()) {
      setServerError("Please fix the errors before submitting.");
      return;
    }

    setBusy(true);

    try {
      const res = await api.post("/auth/register", payload);
      const data = res.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate(data.user.role === "teacher" ? "/teacher" : "/");
    } catch (err) {
      setServerError(err?.response?.data?.error || "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 px-4">
      <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-purple-200">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Gamepad2 className="text-white w-7 h-7" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-2">
          Create an Account ✨
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Join GramiLearn and start your learning journey
        </p>

        {/* Server Error */}
        {serverError && (
          <div className="bg-red-100 border border-red-300 text-red-600 p-3 rounded-xl mb-5 text-sm text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Full Name
            </label>
            <input
              value={payload.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="John Doe"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={payload.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="john@example.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={payload.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="At least 6 characters & 1 number"
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Phone (optional)
            </label>
            <input
              value={payload.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Role
            </label>
            <select
              value={payload.role}
              onChange={(e) => update("role", e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* SUBMIT */}
          <button
            disabled={busy}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all
              ${
                busy
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02]"
              }`}
          >
            {busy ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Register
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">
            Already have an account?{" "}
          </span>
          <button
            onClick={() => navigate("/login")}
            className="text-purple-600 font-semibold text-sm hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
