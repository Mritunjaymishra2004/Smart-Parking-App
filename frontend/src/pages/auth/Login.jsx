
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardBackground from "../../components/common/DashboardBackground";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ embedded }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/"); // redirect after login
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardBackground>
      <div className="min-h-screen flex items-center justify-center">

        <form
          onSubmit={submit}
          className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 p-8 rounded-2xl w-full max-w-md text-white shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-center">
            Welcome Back
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD WITH EYE */}
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
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-right mb-4">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-emerald-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* SIGNUP LINK */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-emerald-400 hover:underline"
            >
              Sign up
            </button>
          </p>
        </form>

      </div>
    </DashboardBackground>
  );
}