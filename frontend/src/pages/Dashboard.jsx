// import { useAuth } from "../context/AuthContext";
// import AdminDashboard from "./admin/AdminDashboard";
// import UserDashboard from "./user/UserDashboard";

// export default function Dashboard() {
//   const { viewRole } = useAuth();

//   return viewRole === "admin" ? <AdminDashboard /> : <UserDashboard />;
// }





import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./user/UserDashboard";

export default function Dashboard() {
  const { viewRole, loading, user } = useAuth();

  // ===============================
  // 🔒 LOADING GUARD
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  // ===============================
  // 🔒 SAFETY (NOT LOGGED IN)
  // ===============================
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Not authenticated
      </div>
    );
  }

  // ===============================
  // 🔥 ROLE-BASED RENDER
  // ===============================
  if (viewRole === "admin") {
    return <AdminDashboard />;
  }

  // ✅ DEFAULT FALLBACK → USER
  return <UserDashboard />;
}