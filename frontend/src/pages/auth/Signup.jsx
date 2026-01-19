
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DashboardBackground from "../../components/common/DashboardBackground";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("user");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/signup/", {
        name,
        email,
        password,
        role,
      });

      setSuccess("Account created! Redirecting to login…");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardBackground>
      <div className="min-h-screen flex items-center justify-center px-4">

        <form
          onSubmit={submit}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full max-w-md text-white shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Create Account ✨
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-2 rounded mb-4 text-sm text-center">
              {success}
            </div>
          )}

          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <div className="relative mb-4">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 pr-10 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-slate-400 hover:text-emerald-400"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* ROLE */}
          <select
            className="w-full p-3 mb-5 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* SIGNUP BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* LOGIN LINK */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-emerald-400 hover:underline"
            >
              Login
            </button>
          </p>

        </form>

      </div>
    </DashboardBackground>
  );
}

















