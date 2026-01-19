import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import PublicDashboard from "./pages/PublicDashboard";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import UserDashboard from "./pages/user/UserDashboard";
import Slots from "./pages/user/Slots";
import BookSlot from "./pages/booking/BookSlot";
import MyBookings from "./pages/booking/MyBookings";
import PaymentPage from "./pages/PaymentPage";
import NavigationPage from "./pages/NavigationPage";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLiveMap from "./pages/admin/AdminLiveMap";
import AdminViolations from "./pages/admin/AdminViolations";

export default function App() {
  const { user, viewRole, loading } = useAuth();

  // ⏳ Wait for auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      {/* 🌍 Public */}
      <Route path="/" element={<PublicDashboard />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🔐 Must be logged in */}
      {!user && <Route path="*" element={<Navigate to="/login" />} />}

      {/* 🔄 Smart dashboard switch */}
      {user && (
        <Route
          path="/dashboard"
          element={
            user ? (
              viewRole === "admin" ? <AdminDashboard /> : <UserDashboard />
            ) : (
             <Navigate to="/login" />
            )
          }
        />
      )}

      {/* 👤 USER ROUTES */}
      {user && viewRole === "user" && (
        <>
          <Route path="/slots" element={<Slots />} />
          <Route path="/book/:slotId" element={<BookSlot />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/navigate" element={<NavigationPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </>
      )}

      {/* 🛠️ ADMIN ROUTES */}
      {user && viewRole === "admin" && (
        <>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/map" element={<AdminLiveMap />} />
          <Route path="/admin/violations" element={<AdminViolations />} />
        </>
      )}

      {/* 👤 Profile always allowed */}
      {user && <Route path="/profile" element={<Profile />} />}

      {/* 🚫 Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" />} />

    </Routes>
  );
}


