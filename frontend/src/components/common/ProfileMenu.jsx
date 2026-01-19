
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const { user, logout, viewRole, switchRole } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const isAdmin = user.role === "admin" || user.is_staff || user.is_superuser;

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {user.username?.[0]?.toUpperCase()}
        </div>
        <span className="text-white">{user.username}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">

          {/* User Info */}
          <div className="p-4 border-b border-gray-700">
            <p className="font-bold text-white">{user.username}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
            <p className="text-xs mt-1">
              Role:
              <span className="ml-2 text-emerald-400 font-semibold">
                {viewRole}
              </span>
            </p>
          </div>

          {/* Navigation */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full px-4 py-2 text-left hover:bg-gray-800"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-full px-4 py-2 text-left hover:bg-gray-800"
          >
            Profile
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => navigate("/admin")}
                className="w-full px-4 py-2 text-left text-yellow-400 hover:bg-gray-800"
              >
                Admin Panel
              </button>

              <button
                onClick={() => switchRole(viewRole === "admin" ? "user" : "admin")}
                className="w-full px-4 py-2 text-left hover:bg-gray-800"
              >
                Switch to {viewRole === "admin" ? "User View" : "Admin View"}
              </button>
            </>
          )}

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-800"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}




