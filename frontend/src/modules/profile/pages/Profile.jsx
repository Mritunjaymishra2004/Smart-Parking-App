import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  LogOut,
  Save,
  Phone,
  Car,
  Activity,
  Clock3,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

function ProfileRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-slate-800">
      <div className="flex items-center gap-4 text-slate-300">
        <div className="p-3 rounded-xl bg-slate-800 text-emerald-400">
          {icon}
        </div>
        <span>{label}</span>
      </div>

      <span className="font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();

  const [phone, setPhone] =
    useState("");

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">
            My Profile
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your account
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <div className="flex flex-col items-center">

              <div className="w-28 h-28 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <User size={48} />
              </div>

              <h2 className="text-xl font-bold text-white">
                {user?.username || "User"}
              </h2>

              <p className="text-slate-400 mt-2">
                {user?.email}
              </p>

              <button
                onClick={logout}
                className="mt-8 w-full py-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-2 space-y-8">

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <Car className="text-emerald-400 mb-3" />
                <p className="text-slate-400">
                  Vehicles
                </p>
                <h3 className="text-3xl font-bold text-white">
                  2
                </h3>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <Clock3 className="text-blue-400 mb-3" />
                <p className="text-slate-400">
                  Bookings
                </p>
                <h3 className="text-3xl font-bold text-white">
                  18
                </h3>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <Activity className="text-cyan-400 mb-3" />
                <p className="text-slate-400">
                  Activity
                </p>
                <h3 className="text-3xl font-bold text-white">
                  High
                </h3>
              </div>

            </div>

            {/* Account Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

              <h2 className="text-2xl font-bold text-white mb-6">
                Account Details
              </h2>

              <ProfileRow
                icon={<User />}
                label="Username"
                value={
                  user?.username ||
                  "User"
                }
              />

              <ProfileRow
                icon={<Mail />}
                label="Email"
                value={
                  user?.email
                }
              />

              <ProfileRow
                icon={<Shield />}
                label="Role"
                value={
                  user?.role ||
                  "User"
                }
              />

            </div>

            {/* Edit */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

              <h2 className="text-2xl font-bold text-white mb-6">
                Edit Profile
              </h2>

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                className="w-full p-4 rounded-2xl bg-slate-800 text-white mb-6"
              />

              <button className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-semibold flex items-center justify-center gap-2">
                <Save size={18} />
                Save Changes
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}