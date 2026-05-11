import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import DashboardBackground from "../components/common/DashboardBackground";
import Navbar from "../components/common/Navbar";

export default function Profile() {
  const { user, viewRole, logout, switchRole } = useAuth();
  const [mode, setMode] = useState("login");

  const [profile, setProfile] = useState({
    phone: "",
    address: "",
    city: "",
    photo: ""
  });

  // =========================
  // Photo upload preview
  // =========================
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setProfile({
      ...profile,
      photo: preview
    });
  };

  // =========================
  // Save profile
  // =========================
  const saveProfile = () => {
    alert("Profile saved (frontend demo)");
  };

  // =========================
  // Not logged in
  // =========================
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

  // =========================
  // Logged in profile
  // =========================
  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="min-h-screen flex justify-center items-start pt-20 text-white">

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-xl">

            <h2 className="text-2xl font-bold mb-6">
              👤 My Profile
            </h2>

            {/* ================= PROFILE PHOTO ================= */}
            <div className="flex flex-col items-center mb-6">

              <img
                src={profile.photo || "/default-user.png"}
                className="w-24 h-24 rounded-full object-cover mb-2"
              />

              <input
                type="file"
                className="text-sm"
                onChange={handlePhotoChange}
              />

            </div>

            {/* ================= USER DETAILS ================= */}
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

            {/* ================= EDIT PROFILE ================= */}
            <div className="border-t border-slate-700 pt-6 mt-6">

              <h3 className="text-lg font-semibold mb-4">
                Edit Profile
              </h3>

              <input
                placeholder="Phone Number"
                className="w-full mb-3 p-2 bg-slate-800 rounded"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />

              <input
                placeholder="Address"
                className="w-full mb-3 p-2 bg-slate-800 rounded"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              />

              <input
                placeholder="City"
                className="w-full mb-4 p-2 bg-slate-800 rounded"
                value={profile.city}
                onChange={(e) =>
                  setProfile({ ...profile, city: e.target.value })
                }
              />

              <button
                onClick={saveProfile}
                className="bg-emerald-600 w-full py-2 rounded hover:bg-emerald-700"
              >
                Save Profile
              </button>

            </div>

            {/* ================= ACTION BUTTONS ================= */}
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

/* -------------------- UI Helper -------------------- */

function ProfileRow({ label, value, badge }) {
  return (
    <div className="flex justify-between items-center">

      <span className="text-slate-400">
        {label}
      </span>

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
        <span className="text-white">
          {value}
        </span>
      )}

    </div>
  );
}











// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import Login from "./auth/Login";
// import Signup from "./auth/Signup";
// import DashboardBackground from "../components/common/DashboardBackground";
// import Navbar from "../components/common/Navbar";

// export default function Profile() {
//   const { user, viewRole, logout, switchRole } = useAuth();
//   const [mode, setMode] = useState("login"); // login | signup

//   // Not logged in → Login / Signup
//   if (!user) {
//     return (
//       <DashboardBackground>
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md border border-slate-700">

//             <div className="flex justify-center gap-4 mb-6">
//               <button
//                 onClick={() => setMode("login")}
//                 className={`px-4 py-1.5 rounded ${
//                   mode === "login" ? "bg-emerald-600" : "bg-slate-700"
//                 }`}
//               >
//                 Login
//               </button>
//               <button
//                 onClick={() => setMode("signup")}
//                 className={`px-4 py-1.5 rounded ${
//                   mode === "signup" ? "bg-emerald-600" : "bg-slate-700"
//                 }`}
//               >
//                 Signup
//               </button>
//             </div>

//             {mode === "login" ? <Login embedded /> : <Signup embedded />}
//           </div>
//         </div>
//       </DashboardBackground>
//     );
//   }

//   // Logged in → Profile
//   return (
//     <>
//       <Navbar />

//       <DashboardBackground>
//         <div className="min-h-screen flex justify-center items-start pt-20 text-white">

//           <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-xl">

//             <h2 className="text-2xl font-bold mb-6">
//               👤 My Profile
//             </h2>

//             <div className="space-y-4 text-sm">

//               <ProfileRow label="Username" value={user.username} />
//               <ProfileRow label="Email" value={user.email} />

//               <ProfileRow
//                 label="Actual Role"
//                 value={user.role}
//                 badge="emerald"
//               />

//               <ProfileRow
//                 label="Current View"
//                 value={viewRole}
//                 badge="blue"
//               />

//             </div>

//             <div className="flex gap-3 mt-8">

//               {user.role === "admin" && (
//                 <button
//                   onClick={() =>
//                     switchRole(viewRole === "admin" ? "user" : "admin")
//                   }
//                   className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded"
//                 >
//                   Switch to {viewRole === "admin" ? "User" : "Admin"} View
//                 </button>
//               )}

//               <button
//                 onClick={logout}
//                 className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
//               >
//                 Logout
//               </button>

//             </div>

//           </div>

//         </div>
//       </DashboardBackground>
//     </>
//   );
// }

// /* -------------------- UI Helpers -------------------- */

// function ProfileRow({ label, value, badge }) {
//   return (
//     <div className="flex justify-between items-center">
//       <span className="text-slate-400">{label}</span>

//       {badge ? (
//         <span
//           className={`px-3 py-1 text-xs rounded-full ${
//             badge === "emerald"
//               ? "bg-emerald-600"
//               : "bg-blue-600"
//           }`}
//         >
//           {value}
//         </span>
//       ) : (
//         <span className="text-white">{value}</span>
//       )}
//     </div>
//   );
// }


