import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const { user, viewRole } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="h-16 bg-black/60 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 shadow-lg text-white fixed top-0 w-full z-50">

      {/* Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-9 h-9 bg-emerald-500 text-black rounded-lg flex items-center justify-center font-bold">
          P
        </div>
        <h1 className="text-xl font-bold text-emerald-400">
          Smart Parking
        </h1>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-8 text-slate-300">
        <Link to="/dashboard" className="hover:text-emerald-400 transition">
          Dashboard
        </Link>

        {viewRole === "user" && (
          <>
            <Link to="/slots" className="hover:text-emerald-400 transition">
              Live Slots
            </Link>
            <Link to="/map" className="hover:text-emerald-400 transition">
              Live Map
            </Link>
            <Link to="/pricing" className="hover:text-emerald-400 transition">
              Pricing
            </Link>
          </>
        )}

        {viewRole === "admin" && (
          <>
            <Link to="/admin" className="hover:text-emerald-400 transition">
              Admin Dashboard
            </Link>
            <Link to="/admin/live" className="hover:text-emerald-400 transition">
              Live Control
            </Link>
            <Link to="/admin/violations" className="hover:text-emerald-400 transition">
              Violations
            </Link>
          </>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {user ? (
          <ProfileMenu />
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1.5 border border-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-1.5 bg-emerald-500 text-black rounded-lg hover:bg-emerald-600 transition"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}













