import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  ShieldAlert,
} from "lucide-react";

import {
  useAuth,
} from "../context/AuthContext";

import {
  memo,
} from "react";


// ======================================================
// LOADING SCREEN
// ======================================================

const LoadingScreen = memo(() => {

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
        gap-5
      ">

        <div className="
          w-14
          h-14

          border-4
          border-emerald-500
          border-t-transparent

          rounded-full

          animate-spin
        " />

        <p className="
          text-lg
          font-semibold
        ">

          Checking Authentication...

        </p>

      </div>

    </div>
  );
});


// ======================================================
// UNAUTHORIZED SCREEN
// ======================================================

const UnauthorizedScreen = memo(() => {

  return (

    <div className="
      min-h-screen

      flex
      flex-col
      items-center
      justify-center

      bg-slate-950
      text-white

      px-6
      text-center
    ">

      {/* ========================================== */}
      {/* ICON */}
      {/* ========================================== */}

      <div className="
        w-20
        h-20

        rounded-full

        bg-red-500/10

        flex
        items-center
        justify-center

        mb-6
      ">

        <ShieldAlert
          size={40}
          className="
            text-red-400
          "
        />

      </div>

      {/* ========================================== */}
      {/* TITLE */}
      {/* ========================================== */}

      <h1 className="
        text-5xl
        font-bold
        mb-4
      ">

        403

      </h1>

      {/* ========================================== */}
      {/* MESSAGE */}
      {/* ========================================== */}

      <p className="
        text-slate-300
        text-lg
        max-w-md
      ">

        You are not authorized
        to access this page.

      </p>

    </div>
  );
});


// ======================================================
// PROTECTED ROUTE
// ======================================================

export default function ProtectedRoute({

  children,

  role = null,

}) {

  // ====================================================
  // AUTH
  // ====================================================

  const {

    user,

    loading,

    viewRole = "user",

  } = useAuth();

  const location =
    useLocation();


  // ====================================================
  // LOADING STATE
  // ====================================================

  if (loading) {

    return <LoadingScreen />;
  }


  // ====================================================
  // NOT AUTHENTICATED
  // ====================================================

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


  // ====================================================
  // ROLE-BASED ACCESS
  // ====================================================

  if (role) {

    const allowedRoles =

      Array.isArray(role)

        ? role

        : [role];


    // ==============================================
    // ACCESS DENIED
    // ==============================================

    if (

      !allowedRoles.includes(
        viewRole
      )

    ) {

      return <UnauthorizedScreen />;
    }
  }


  // ====================================================
  // ACCESS GRANTED
  // ====================================================

  return children;
}