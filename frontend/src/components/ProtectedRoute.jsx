import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

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
      bg-slate-900
      text-white
      text-xl
      font-semibold
    ">
      Checking Authentication...
    </div>
  );
}

// ======================================================
// UNAUTHORIZED SCREEN
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
    ">

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

  const {
    user,
    loading,
    isAuthenticated,
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
  // NOT AUTHENTICATED
  // ====================================================

  if (!isAuthenticated || !user) {

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

    // ================================================
    // SUPPORT ARRAY OF ROLES
    // ================================================

    const allowedRoles =
      Array.isArray(role)
        ? role
        : [role];

    if (
      !allowedRoles.includes(
        user.role
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











// import { useAuth } from "../context/AuthContext";
// import { Navigate, useLocation } from "react-router-dom";

// export default function ProtectedRoute({ children, role }) {
//   const { user, loading } = useAuth();
//   const location = useLocation(); // ✅ NEW

//   // ===============================
//   // 🔹 LOADING STATE (UX IMPROVED)
//   // ===============================
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
//         Loading...
//       </div>
//     );
//   }

//   // ===============================
//   // 🔹 NOT LOGGED IN
//   // ===============================
//   if (!user) {
//     return (
//       <Navigate
//         to="/login"
//         replace
//         state={{ from: location }} // ✅ preserve route
//       />
//     );
//   }

//   // ===============================
//   // 🔹 ROLE-BASED PROTECTION (NEW)
//   // ===============================
//   if (role && user.role !== role) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   // ===============================
//   // 🔹 ALLOWED
//   // ===============================
//   return children;
// }