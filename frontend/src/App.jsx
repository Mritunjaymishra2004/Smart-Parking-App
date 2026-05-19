import React, {
  Suspense,
  lazy,
} from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "./context/AuthContext";

import ProtectedRoute
from "./components/ProtectedRoute";


// ======================================================
// PUBLIC PAGES
// ======================================================

const PublicDashboard = lazy(() =>
  import("./pages/PublicDashboard")
);

const Login = lazy(() =>
  import("./pages/auth/Login")
);

const Signup = lazy(() =>
  import("./pages/auth/Signup")
);


// ======================================================
// USER PAGES
// ======================================================

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

const Profile = lazy(() =>
  import("./pages/Profile")
);


// ======================================================
// ADMIN PAGES
// ======================================================

const AdminDashboard = lazy(() =>
  import("./pages/admin/AdminDashboard")
);

const Analytics = lazy(() =>
  import("./pages/admin/Analytics")
);

const Reports = lazy(() =>
  import("./pages/admin/Reports")
);

const UserManagement = lazy(() =>
  import("./pages/admin/UserManagement")
);



const VehicleManagement = lazy(() =>
  import("./pages/vehicles/VehicleManagement")
);

const GateScanner = lazy(() =>
  import("./pages/gate/GateScanner")
);
// ======================================================
// LOADING SCREEN
// ======================================================

function LoadingScreen() {

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-950
      text-white
    ">

      <div className="
        flex
        flex-col
        items-center
        gap-4
      ">

        <div className="
          w-14
          h-14
          rounded-full
          border-4
          border-emerald-500
          border-t-transparent
          animate-spin
        " />

        <p className="
          text-lg
          font-semibold
        ">

          Loading Smart Parking...

        </p>

      </div>

    </div>
  );
}


// ======================================================
// DASHBOARD REDIRECT
// ======================================================

function DashboardRedirect() {

  const {

    user,

    viewRole,

  } = useAuth();

  // ==============================================
  // NOT LOGGED IN
  // ==============================================

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==============================================
  // ADMIN
  // ==============================================

  const currentRole =

    user?.role ||

    viewRole ||

    "user";

  if (

    currentRole === "admin"

  ) {

    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  // ==============================================
  // USER
  // ==============================================

  return (
    <Navigate
      to="/user-dashboard"
      replace
    />
  );
}


// ======================================================
// APP
// ======================================================

export default function App() {

  const {

    user,

    loading,

  } = useAuth();


  // ====================================================
  // GLOBAL LOADING
  // ====================================================

  if (loading) {

    return <LoadingScreen />;
  }


  // ====================================================
  // ROUTES
  // ====================================================

  return (

    <Suspense
      fallback={<LoadingScreen />}
    >

      <Routes>

        {/* ========================================= */}
        {/* PUBLIC */}
        {/* ========================================= */}

        <Route
          path="/"
          element={<PublicDashboard />}
        />

        <Route
          path="/login"
          element={

            user

              ? (
                <Navigate
                  to="/dashboard"
                  replace
                />
              )

              : <Login />
          }
        />

        <Route
          path="/signup"
          element={

            user

              ? (
                <Navigate
                  to="/dashboard"
                  replace
                />
              )

              : <Signup />
          }
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

            <ProtectedRoute
              role="user"
            >

              <UserDashboard />

            </ProtectedRoute>
          }
        />

        <Route
          path="/slots"
          element={

            <ProtectedRoute
              role="user"
            >

              <Slots />

            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:slotId"
          element={

            <ProtectedRoute
              role="user"
            >

              <BookSlot />

            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={

            <ProtectedRoute
              role="user"
            >

              <MyBookings />

            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={

            <ProtectedRoute>

              <Profile />

            </ProtectedRoute>
          }
        />


        {/* ========================================= */}
        {/* ADMIN ROUTES */}
        {/* ========================================= */}

        <Route
          path="/admin"
          element={

            <ProtectedRoute
              role="admin"
            >

              <AdminDashboard />

            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={

            <ProtectedRoute
              role="admin"
            >

              <Analytics />

            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={

            <ProtectedRoute
              role="admin"
            >

              <Reports />

            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/users"
          element={

            <ProtectedRoute
              role="admin"
            >

              <UserManagement />

            </ProtectedRoute>
          }
        />
        
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <VehicleManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gate"
          element={
            <ProtectedRoute role="admin">
                <GateScanner />
            </ProtectedRoute>
        }
        />

        {/* ========================================= */}
        {/* FALLBACK */}
        {/* ========================================= */}

        <Route
          path="*"
          element={

            <Navigate
              to={
                user
                  ? "/dashboard"
                  : "/login"
              }
              replace
            />
          }
        />

      </Routes>

    </Suspense>
  );
}