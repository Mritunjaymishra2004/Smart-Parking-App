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
}


// ======================================================
// UNAUTHORIZED
// ======================================================

function UnauthorizedScreen() {

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

      <h1 className="
        text-5xl
        font-bold
        mb-4
      ">

        403

      </h1>

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
}


// ======================================================
// PROTECTED ROUTE
// ======================================================

export default function ProtectedRoute({

  children,

  role,

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
  // LOADING
  // ====================================================

  if (loading) {

    return <LoadingScreen />;
  }


  // ====================================================
  // NOT LOGGED IN
  // ====================================================

  if (!user) {

    return (

      <Navigate

        to="/login"

        replace

        state={{
          from: location,
        }}
      />
    );
  }


  // ====================================================
  // ROLE CHECK
  // ====================================================

  if (role) {

    const allowedRoles =

      Array.isArray(role)

        ? role

        : [role];

    // ==============================================
    // SAFE ROLE CHECK
    // ==============================================

    if (

      !allowedRoles.includes(
        viewRole
      )

    ) {

      return (
        <UnauthorizedScreen />
      );
    }
  }


  // ====================================================
  // ACCESS GRANTED
  // ====================================================

  return children;
}