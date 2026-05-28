import React, {
  lazy,
  memo,
} from "react";

import {
  Route,
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import AuthLayout
  from "../shared/layouts/AuthLayout";

import Landing
  from "../modules/auth/pages/Landing";


// ======================================================
// LAZY PAGES
// ======================================================

const Login = lazy(() =>
  import("../modules/auth/pages/Login")
);

const Signup = lazy(() =>
  import("../modules/auth/pages/Signup")
);

const ForgotPassword = lazy(() =>
  import("../modules/auth/pages/ForgotPassword")
);

const ResetPassword = lazy(() =>
  import("../modules/auth/pages/ResetPassword")
);


// ======================================================
// GUEST ROUTE
// ======================================================

const GuestRoute = memo(({
  children,
}) => {
  const {
    isAuthenticated,
    user,
    loading,
  } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {

    if (user?.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/user/dashboard"
        replace
      />
    );
  }

  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
});


// ======================================================
// PUBLIC ROUTES
// ======================================================

const publicRoutes = (
  <>

    {/* LANDING */}
    <Route
      path="/"
      element={<Landing />}
    />

    {/* LOGIN */}
    <Route
      path="/login"
      element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      }
    />

    {/* SIGNUP */}
    <Route
      path="/signup"
      element={
        <GuestRoute>
          <Signup />
        </GuestRoute>
      }
    />

    {/* FORGOT PASSWORD */}
    <Route
      path="/forgot-password"
      element={
        <GuestRoute>
          <ForgotPassword />
        </GuestRoute>
      }
    />

    {/* RESET PASSWORD */}
    <Route
      path="/reset-password/:token"
      element={
        <GuestRoute>
          <ResetPassword />
        </GuestRoute>
      }
    />

  </>
);


// ======================================================
// EXPORT
// ======================================================

export default publicRoutes;