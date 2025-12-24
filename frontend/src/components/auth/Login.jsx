import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Gamepad2, Sparkles, Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "teacher" || data.user.role === "admin") {
        navigate("/teacher");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Login failed. Check email/password and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 px-4">
      
      {/* Card */}
      <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-purple-200">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Gamepad2 className="text-white w-7 h-7" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center mb-2">
          Welcome Back 
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Login to continue your learning adventure
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-600 p-3 rounded-xl mb-5 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="john@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

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
                Logging in...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Login
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
          </span>
          <button
            onClick={() => navigate("/register")}
            className="text-purple-600 font-semibold text-sm hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
