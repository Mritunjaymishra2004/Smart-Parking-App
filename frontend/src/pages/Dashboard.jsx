import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./user/UserDashboard";

export default function Dashboard() {
  const { viewRole } = useAuth();

  return viewRole === "admin" ? <AdminDashboard /> : <UserDashboard />;
}