import {
  memo,
  useMemo,
} from "react";

import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ShieldAlert,
  ArrowLeft,
  Home,
  Lock,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


// ======================================================
// LOADING
// ======================================================

const LoadingScreen = memo(() => (
  <div className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-gradient-to-br
    from-slate-950
    via-slate-900
    to-slate-950
    text-white
  ">
    <div className="flex flex-col items-center gap-5">

      <div className="
        w-16 h-16
        border-4
        border-emerald-500
        border-t-transparent
        rounded-full
        animate-spin
      " />

      <p className="text-lg font-semibold text-slate-300">
        Verifying Access...
      </p>

    </div>
  </div>
));


// ======================================================
// UNAUTHORIZED
// ======================================================

const UnauthorizedScreen = memo(() => {
  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const homeRoute =
    user?.role === "admin"
      ? "/admin/dashboard"
      : "/user/dashboard";

  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-950
      via-slate-900
      to-slate-950
      px-6
      text-white
    ">

      <div className="
        max-w-lg
        w-full
        rounded-3xl
        bg-slate-900/80
        border border-red-500/20
        backdrop-blur-xl
        p-10
        text-center
        shadow-2xl
      ">

        <div className="
          w-24 h-24
          rounded-3xl
          bg-red-500/10
          flex items-center justify-center
          mx-auto mb-8
        ">
          <ShieldAlert
            size={46}
            className="text-red-400"
          />
        </div>

        <h1 className="text-5xl font-bold text-red-400">
          403
        </h1>

        <h2 className="text-2xl font-semibold mt-4">
          Access Denied
        </h2>

        <p className="text-slate-400 mt-4">
          You do not have permission to access this page.
        </p>

        <div className="flex gap-4 justify-center mt-8">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              flex items-center gap-2
              px-5 py-3
              rounded-2xl
              bg-slate-800
              hover:bg-slate-700
              transition
            "
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={() =>
              navigate(homeRoute)
            }
            className="
              flex items-center gap-2
              px-5 py-3
              rounded-2xl
              bg-emerald-500
              hover:bg-emerald-600
              text-black
              font-semibold
              transition
            "
          >
            <Home size={18} />
            Dashboard
          </button>

        </div>

      </div>

    </div>
  );
});


// ======================================================
// PROTECTED ROUTE
// ======================================================

function ProtectedRoute({
  children,
  role = null,
}) {
  const {
    user,
    loading,
    initialized,
  } = useAuth();

  const location =
    useLocation();


  const allowedRoles =
    useMemo(() => {
      if (!role) return null;

      return Array.isArray(role)
        ? role
        : [role];
    }, [role]);


  // LOADING
  if (
    !initialized ||
    loading
  ) {
    return <LoadingScreen />;
  }


  // NOT AUTHENTICATED
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }


  // ROLE VALIDATION
  if (allowedRoles) {
    const userRole =
      user?.role || "user";

    if (
      !allowedRoles.includes(
        userRole
      )
    ) {
      return (
        <UnauthorizedScreen />
      );
    }
  }

  return children;
}


// ======================================================
// EXPORT
// ======================================================

export default memo(
  ProtectedRoute
);