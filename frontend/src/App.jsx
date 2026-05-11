import React, {
  Suspense,
  lazy,
} from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

// ======================================================
// LAZY LOAD PAGES
// ======================================================

// Public
const PublicDashboard = lazy(() =>
  import("./pages/PublicDashboard")
);

const Login = lazy(() =>
  import("./pages/auth/Login")
);

const Signup = lazy(() =>
  import("./pages/auth/Signup")
);

const ForgotPassword = lazy(() =>
  import("./pages/auth/ForgotPassword")
);

const ResetPassword = lazy(() =>
  import("./pages/auth/ResetPassword")
);

// User
const UserDashboard = lazy(() =>
  import("./pages/user/UserDashboard")
);

const Slots = lazy(() =>
  import("./pages/user/Slots")
);

const BookSlot = lazy(() =>
  import("./pages/booking/BookSlot")
);

const MyBookings = lazy(() =>
  import("./pages/booking/MyBookings")
);

const PaymentPage = lazy(() =>
  import("./pages/PaymentPage")
);

const NavigationPage = lazy(() =>
  import("./pages/NavigationPage")
);

const Profile = lazy(() =>
  import("./pages/Profile")
);

const LiveParkingMap = lazy(() =>
  import("./components/map/LiveParkingMap")
);

// Admin
const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard")
);

const AdminLiveMap = lazy(() =>
  import("./pages/admin/AdminLiveMap")
);

const AdminViolations = lazy(() =>
  import("./pages/admin/AdminViolations")
);

// ======================================================
// DASHBOARD REDIRECT
// ======================================================

function DashboardRedirect() {

  const { viewRole } = useAuth();

  return viewRole === "admin"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/user-dashboard" replace />;
}

// ======================================================
// LOADING SCREEN
// ======================================================

function LoadingScreen() {

  return (
    <div className="
      h-screen
      flex
      items-center
      justify-center
      bg-slate-900
      text-white
      text-xl
      font-semibold
    ">
      Loading Smart Parking...
    </div>
  );
}

// ======================================================
// APP
// ======================================================

export default function App() {

  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (

    <Suspense fallback={<LoadingScreen />}>

      <Routes>

        {/* ========================================= */}
        {/* PUBLIC ROUTES */}
        {/* ========================================= */}

        <Route
          path="/"
          element={<PublicDashboard />}
        />

        <Route
          path="/login"
          element={
            !user
              ? <Login />
              : <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="/signup"
          element={
            !user
              ? <Signup />
              : <Navigate to="/dashboard" replace />
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* ========================================= */}
        {/* DASHBOARD REDIRECT */}
        {/* ========================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* ========================================= */}
        {/* USER ROUTES */}
        {/* ========================================= */}

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/slots"
          element={
            <ProtectedRoute role="user">
              <Slots />
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute role="user">
              <LiveParkingMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:slotId"
          element={
            <ProtectedRoute role="user">
              <BookSlot />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute role="user">
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/navigate"
          element={
            <ProtectedRoute role="user">
              <NavigationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute role="user">
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* ========================================= */}
        {/* ADMIN ROUTES */}
        {/* ========================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/map"
          element={
            <ProtectedRoute role="admin">
              <AdminLiveMap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/violations"
          element={
            <ProtectedRoute role="admin">
              <AdminViolations />
            </ProtectedRoute>
          }
        />

        {/* ========================================= */}
        {/* PROFILE */}
        {/* ========================================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ========================================= */}
        {/* FALLBACK */}
        {/* ========================================= */}

        <Route
          path="*"
          element={
            user
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

      </Routes>

    </Suspense>
  );
}
















// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// // Public Pages
// import PublicDashboard from "./pages/PublicDashboard";
// import Login from "./pages/auth/Login";
// import Signup from "./pages/auth/Signup";
// import ForgotPassword from "./pages/auth/ForgotPassword";
// import ResetPassword from "./pages/auth/ResetPassword";

// // User Pages
// import UserDashboard from "./pages/user/UserDashboard";
// import Slots from "./pages/user/Slots";
// import BookSlot from "./pages/booking/BookSlot";
// import MyBookings from "./pages/booking/MyBookings";
// import PaymentPage from "./pages/PaymentPage";
// import NavigationPage from "./pages/NavigationPage";
// import Profile from "./pages/Profile";
// import LiveParkingMap from "./components/map/LiveParkingMap";

// // Admin Pages
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminLiveMap from "./pages/admin/AdminLiveMap";
// import AdminViolations from "./pages/admin/AdminViolations";

// import ProtectedRoute from "./components/ProtectedRoute";

// function DashboardRedirect() {
//   const { viewRole } = useAuth();

//   return viewRole === "admin"
//     ? <Navigate to="/admin" replace />
//     : <Navigate to="/user-dashboard" replace />;
// }

// export default function App() {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-900 text-white text-lg">
//         Initializing App...
//       </div>
//     );
//   }

//   return (
//     <Routes>
//       <Route path="/" element={<PublicDashboard />} />

//       <Route
//         path="/login"
//         element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
//       />

//       <Route
//         path="/signup"
//         element={!user ? <Signup /> : <Navigate to="/dashboard" replace />}
//       />

//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       <Route path="/reset-password" element={<ResetPassword />} />

//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardRedirect />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/user-dashboard"
//         element={
//           <ProtectedRoute role="user">
//             <UserDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/slots"
//         element={
//           <ProtectedRoute role="user">
//             <Slots />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/map"
//         element={
//           <ProtectedRoute role="user">
//             <LiveParkingMap />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/book/:slotId"
//         element={
//           <ProtectedRoute role="user">
//             <BookSlot />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/my-bookings"
//         element={
//           <ProtectedRoute role="user">
//             <MyBookings />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/navigate"
//         element={
//           <ProtectedRoute role="user">
//             <NavigationPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/payment"
//         element={
//           <ProtectedRoute role="user">
//             <PaymentPage />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute role="admin">
//             <AdminDashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/map"
//         element={
//           <ProtectedRoute role="admin">
//             <AdminLiveMap />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin/violations"
//         element={
//           <ProtectedRoute role="admin">
//             <AdminViolations />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="*"
//         element={
//           user
//             ? <Navigate to="/dashboard" replace />
//             : <Navigate to="/login" replace />
//         }
//       />
//     </Routes>
//   );
// }

