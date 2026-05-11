import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  User,
  LayoutDashboard,
  Shield,
  LogOut,
  Settings,
  Repeat,
  ChevronDown,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

// ======================================================
// PROFILE MENU
// ======================================================

export default function ProfileMenu() {

  // ====================================================
  // HOOKS
  // ====================================================

  const {
    user,
    logout,
    viewRole,
    switchRole,
  } = useAuth();

  const navigate =
    useNavigate();

  // ====================================================
  // STATE
  // ====================================================

  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef(null);

  // ====================================================
  // GUARD
  // ====================================================

  if (!user) return null;

  // ====================================================
  // USER DATA
  // ====================================================

  const displayName =

    user.username ||

    user.name ||

    "User";

  const isAdmin =

    user.role === "admin" ||

    user.is_staff ||

    user.is_superuser;

  // ====================================================
  // CLOSE HANDLERS
  // ====================================================

  useEffect(() => {

    const handleClickOutside = (
      event
    ) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {

        setOpen(false);
      }
    };

    const handleEscape = (
      event
    ) => {

      if (
        event.key === "Escape"
      ) {

        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };

  }, []);

  // ====================================================
  // MENU ITEM
  // ====================================================

  const MenuItem = ({
    icon,
    label,
    onClick,
    danger = false,
  }) => (

    <button
      onClick={() => {

        onClick?.();

        setOpen(false);
      }}

      className={`
        w-full

        flex
        items-center
        gap-3

        px-4
        py-3

        rounded-xl

        text-sm
        font-medium

        transition-all
        duration-200

        ${
          danger

            ? `
              text-red-400
              hover:bg-red-500/10
            `

            : `
              text-slate-300
              hover:bg-slate-800
              hover:text-white
            `
        }
      `}
    >

      <span className="
        text-base
      ">
        {icon}
      </span>

      <span>
        {label}
      </span>

    </button>
  );

  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {

    logout();

    navigate("/");
  };

  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      className="
        relative
      "
      ref={menuRef}
    >

      {/* ========================================== */}
      {/* TRIGGER */}
      {/* ========================================== */}

      <button
        onClick={() =>
          setOpen(!open)
        }

        className="
          flex
          items-center
          gap-3

          px-3
          py-2

          rounded-xl

          bg-slate-800/70
          border
          border-slate-700

          hover:bg-slate-700/70

          transition-all
          duration-200
        "
      >

        {/* ====================================== */}
        {/* AVATAR */}
        {/* ====================================== */}

        <div className="
          relative
        ">

          <div className="
            w-10
            h-10

            rounded-full

            bg-emerald-500/20
            border
            border-emerald-500/20

            flex
            items-center
            justify-center

            text-emerald-400
            font-bold
          ">

            {displayName?.[0]
              ?.toUpperCase()
            }

          </div>

          {/* ==================================== */}
          {/* ONLINE DOT */}
          {/* ==================================== */}

          <span className="
            absolute
            bottom-0
            right-0

            w-3
            h-3

            rounded-full

            bg-emerald-400

            border-2
            border-slate-900
          " />

        </div>

        {/* ====================================== */}
        {/* INFO */}
        {/* ====================================== */}

        <div className="
          hidden
          sm:block
          text-left
        ">

          <p className="
            text-sm
            font-semibold
            text-white
            leading-none
          ">

            {displayName}

          </p>

          <p className="
            text-xs
            text-slate-400
            mt-1
            capitalize
          ">

            {viewRole}

          </p>

        </div>

        {/* ====================================== */}
        {/* ARROW */}
        {/* ====================================== */}

        <ChevronDown
          size={18}
          className={`
            text-slate-400
            transition-transform
            duration-200

            ${open
              ? "rotate-180"
              : ""
            }
          `}
        />

      </button>

      {/* ========================================== */}
      {/* DROPDOWN */}
      {/* ========================================== */}

      {open && (

        <div className="
          absolute
          right-0
          top-16

          w-72

          rounded-2xl

          bg-slate-900/95
          backdrop-blur-xl

          border
          border-slate-800

          shadow-2xl

          overflow-hidden

          animate-fadeIn

          z-[9999]
        ">

          {/* ====================================== */}
          {/* PROFILE HEADER */}
          {/* ====================================== */}

          <div className="
            p-5
            border-b
            border-slate-800
          ">

            <div className="
              flex
              items-center
              gap-4
            ">

              <div className="
                w-14
                h-14

                rounded-full

                bg-emerald-500/20

                flex
                items-center
                justify-center

                text-xl
                font-bold
                text-emerald-400
              ">

                {displayName?.[0]
                  ?.toUpperCase()
                }

              </div>

              <div>

                <h3 className="
                  text-white
                  font-semibold
                ">

                  {displayName}

                </h3>

                <p className="
                  text-sm
                  text-slate-400
                ">

                  {user.email}

                </p>

                {/* ============================== */}
                {/* ROLE BADGE */}
                {/* ============================== */}

                <div className="
                  inline-flex
                  items-center

                  mt-2

                  px-2
                  py-1

                  rounded-lg

                  bg-emerald-500/10
                  text-emerald-400

                  text-xs
                  font-medium
                ">

                  {viewRole}

                </div>

              </div>

            </div>

          </div>

          {/* ====================================== */}
          {/* MENU */}
          {/* ====================================== */}

          <div className="
            p-3
            space-y-1
          ">

            <MenuItem
              icon={<LayoutDashboard />}
              label="Dashboard"
              onClick={() =>
                navigate(
                  viewRole === "admin"

                    ? "/admin"

                    : "/dashboard"
                )
              }
            />

            <MenuItem
              icon={<User />}
              label="My Profile"
              onClick={() =>
                navigate("/profile")
              }
            />

            <MenuItem
              icon={<Settings />}
              label="Settings"
              onClick={() =>
                navigate("/settings")
              }
            />

            {/* ==================================== */}
            {/* ADMIN CONTROLS */}
            {/* ==================================== */}

            {isAdmin && (

              <>
                <MenuItem
                  icon={<Shield />}
                  label="Admin Panel"
                  onClick={() =>
                    navigate("/admin")
                  }
                />

                <MenuItem
                  icon={<Repeat />}
                  label={
                    viewRole === "admin"

                      ? "Switch to User View"

                      : "Switch to Admin View"
                  }

                  onClick={() =>

                    switchRole(

                      viewRole === "admin"

                        ? "user"

                        : "admin"
                    )
                  }
                />
              </>
            )}

          </div>

          {/* ====================================== */}
          {/* FOOTER */}
          {/* ====================================== */}

          <div className="
            border-t
            border-slate-800
            p-3
          ">

            <MenuItem
              icon={<LogOut />}
              label="Logout"
              danger
              onClick={
                handleLogout
              }
            />

          </div>

        </div>
      )}

    </div>
  );
}












// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export default function ProfileMenu() {
//   const { user, logout, viewRole, switchRole } = useAuth();
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   const menuRef = useRef();

//   if (!user) return null;

//   const isAdmin =
//     user.role === "admin" || user.is_staff || user.is_superuser;

//   // ===============================
//   // 🔹 CLOSE ON OUTSIDE CLICK
//   // ===============================
//   useEffect(() => {
//     const handleClick = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };

//     const handleEscape = (e) => {
//       if (e.key === "Escape") setOpen(false);
//     };

//     document.addEventListener("mousedown", handleClick);
//     document.addEventListener("keydown", handleEscape);

//     return () => {
//       document.removeEventListener("mousedown", handleClick);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   const displayName = user.username || user.name || "User";

//   return (
//     <div className="relative" ref={menuRef}>
//       {/* ================= AVATAR ================= */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 transition"
//       >
//         <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
//           {displayName[0]?.toUpperCase()}
//         </div>

//         <span className="text-white hidden sm:block">
//           {displayName}
//         </span>
//       </button>

//       {/* ================= DROPDOWN ================= */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 animate-fadeIn">

//           {/* USER INFO */}
//           <div className="p-4 border-b border-gray-700">
//             <p className="font-bold text-white">{displayName}</p>
//             <p className="text-sm text-gray-400">{user.email}</p>

//             <p className="text-xs mt-1">
//               Role:
//               <span className="ml-2 text-emerald-400 font-semibold">
//                 {viewRole}
//               </span>
//             </p>
//           </div>

//           {/* NAVIGATION */}
//           <button
//             onClick={() => {
//               navigate("/dashboard");
//               setOpen(false);
//             }}
//             className="w-full px-4 py-2 text-left hover:bg-gray-800 transition"
//           >
//             Dashboard
//           </button>

//           <button
//             onClick={() => {
//               navigate("/profile");
//               setOpen(false);
//             }}
//             className="w-full px-4 py-2 text-left hover:bg-gray-800 transition"
//           >
//             Profile
//           </button>

//           {/* ADMIN SECTION */}
//           {isAdmin && (
//             <>
//               <button
//                 onClick={() => {
//                   navigate("/admin");
//                   setOpen(false);
//                 }}
//                 className="w-full px-4 py-2 text-left text-yellow-400 hover:bg-gray-800 transition"
//               >
//                 Admin Panel
//               </button>

//               <button
//                 onClick={() => {
//                   switchRole(viewRole === "admin" ? "user" : "admin");
//                   setOpen(false);
//                 }}
//                 className="w-full px-4 py-2 text-left hover:bg-gray-800 transition"
//               >
//                 Switch to{" "}
//                 {viewRole === "admin" ? "User View" : "Admin View"}
//               </button>
//             </>
//           )}

//           {/* LOGOUT */}
//           <button
//             onClick={() => {
//               logout();
//               navigate("/");
//               setOpen(false);
//             }}
//             className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-800 transition"
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }