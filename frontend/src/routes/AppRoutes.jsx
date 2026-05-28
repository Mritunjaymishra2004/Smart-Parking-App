import React, {
  Suspense,
  memo,
} from "react";

import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import adminRoutes
  from "./adminRoutes";

import userRoutes
  from "./userRoutes";

import publicRoutes
  from "./publicRoutes";

import Loader
  from "../shared/ui/Loader";


// ======================================================
// NOT FOUND
// ======================================================

const NotFound = memo(() => {
  const navigate =
    useNavigate();

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

      <h1 className="
        text-8xl
        font-bold
        text-emerald-400
      ">
        404
      </h1>

      <p className="
        mt-4
        text-slate-400
        text-lg
      ">
        Page not found
      </p>

      <button
        onClick={() =>
          navigate("/login", {
            replace: true,
          })
        }
        className="
          mt-8
          px-6
          py-3
          rounded-2xl
          bg-emerald-500
          hover:bg-emerald-400
          text-black
          font-semibold
          transition-all
        "
      >
        Go to Login
      </button>

    </div>
  );
});


// ======================================================
// APP ROUTES
// ======================================================

function AppRoutes() {
  return (
    <Suspense
      fallback={<Loader />}
    >
      <Routes>

        {/* PUBLIC */}
        {publicRoutes}

        {/* USER */}
        {userRoutes}

        {/* ADMIN */}
        {adminRoutes}

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </Suspense>
  );
}


// ======================================================
// EXPORT
// ======================================================

export default memo(
  AppRoutes
);