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

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => {
    setPayload((p) => ({ ...p, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      // STEP 1: Register the user
      const res = await api.post("/auth/register", payload);

      // Backend must return tokens + user object
      const data = res.data;

      // STEP 2: Auto-login immediately after registration
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // STEP 3: Redirect based on role
      if (data.user.role === "teacher" || data.user.role === "admin") {
        navigate("/teacher");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Create an account</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              value={payload.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>

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
          </div>

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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone (optional)</label>
            <input
              value={payload.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="+91 98765 43210"
            />
          </div>

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
