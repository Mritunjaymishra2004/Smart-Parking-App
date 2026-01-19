import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import DashboardBackground from "../components/common/DashboardBackground";
import Navbar from "../components/common/Navbar";

export default function Profile() {
  const { user, viewRole, logout, switchRole } = useAuth();
  const [mode, setMode] = useState("login"); // login | signup

  // 🔓 Not logged in → Login / Signup
  if (!user) {
    return (
      <DashboardBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md border border-slate-700">

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setMode("login")}
                className={`px-4 py-1.5 rounded ${
                  mode === "login" ? "bg-emerald-600" : "bg-slate-700"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`px-4 py-1.5 rounded ${
                  mode === "signup" ? "bg-emerald-600" : "bg-slate-700"
                }`}
              >
                Signup
              </button>
            </div>

            {mode === "login" ? <Login embedded /> : <Signup embedded />}
          </div>
        </div>
      </DashboardBackground>
    );
  }

  // 🔐 Logged in → Profile
  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="min-h-screen flex justify-center items-start pt-20 text-white">

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-xl">

            <h2 className="text-2xl font-bold mb-6">
              👤 My Profile
            </h2>

            <div className="space-y-4 text-sm">

              <ProfileRow label="Username" value={user.username} />
              <ProfileRow label="Email" value={user.email} />

              <ProfileRow
                label="Actual Role"
                value={user.role}
                badge="emerald"
              />

              <ProfileRow
                label="Current View"
                value={viewRole}
                badge="blue"
              />

            </div>

            <div className="flex gap-3 mt-8">

              {user.role === "admin" && (
                <button
                  onClick={() =>
                    switchRole(viewRole === "admin" ? "user" : "admin")
                  }
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded"
                >
                  Switch to {viewRole === "admin" ? "User" : "Admin"} View
                </button>
              )}

              <button
                onClick={logout}
                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      </DashboardBackground>
    </>
  );
}

/* -------------------- UI Helpers -------------------- */

function ProfileRow({ label, value, badge }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400">{label}</span>

      {badge ? (
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            badge === "emerald"
              ? "bg-emerald-600"
              : "bg-blue-600"
          }`}
        >
          {value}
        </span>
      ) : (
        <span className="text-white">{value}</span>
      )}
    </div>
  );
}










