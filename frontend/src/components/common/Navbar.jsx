import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Bell,
  Wifi,
  WifiOff,
  Search,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useWebSocket,
} from "../../websocket/WebSocketContext";

import ProfileMenu from "./ProfileMenu";

// ======================================================
// NAVBAR
// ======================================================

export default function Navbar() {

  // ====================================================
  // HOOKS
  // ====================================================

  const {
    user,
    viewRole,
  } = useAuth();

  const {
    connected,
  } = useWebSocket();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // ====================================================
  // ACTIVE LINK
  // ====================================================

  const isActive = (
    path
  ) => {

    return location.pathname === path

      ? `
        text-emerald-400
        bg-emerald-500/10
      `

      : `
        text-slate-300
        hover:text-emerald-400
        hover:bg-slate-800/70
      `;
  };

  // ====================================================
  // NAV LINKS
  // ====================================================

  const userLinks = [

    {
      to: "/dashboard",
      label: "Dashboard",
    },

    {
      to: "/slots",
      label: "Slots",
    },

    {
      to: "/map",
      label: "Live Map",
    },
  ];

  const adminLinks = [

    {
      to: "/admin",
      label: "Dashboard",
    },

    {
      to: "/admin/map",
      label: "Live Map",
    },

    {
      to: "/admin/violations",
      label: "Violations",
    },
  ];

  const navLinks =
    viewRole === "admin"
      ? adminLinks
      : userLinks;

  // ====================================================
  // UI
  // ====================================================

  return (

    <nav className="
      h-16
      px-4
      sm:px-6
      flex
      items-center
      justify-between
      bg-slate-900/70
      backdrop-blur-xl
      border-b
      border-slate-800
      text-white
      relative
      overflow-visible
      z-[1000]
    ">

      {/* ========================================== */}
      {/* LEFT */}
      {/* ========================================== */}

      <div className="
        flex
        items-center
        gap-8
      ">

        {/* ====================================== */}
        {/* LOGO */}
        {/* ====================================== */}

        <div
          onClick={() =>
            navigate("/")
          }
          className="
            flex
            items-center
            gap-3
            cursor-pointer
            select-none
          "
        >

          <div className="
            w-10
            h-10
            rounded-xl
            bg-emerald-500
            text-black
            font-bold
            flex
            items-center
            justify-center
            shadow-lg
          ">
            P
          </div>

          <div className="hidden sm:block">

            <h1 className="
              text-lg
              font-bold
              text-emerald-400
              leading-none
            ">
              Smart Parking
            </h1>

            <p className="
              text-[11px]
              text-slate-400
              mt-1
            ">

              {viewRole === "admin"

                ? "Admin Control Center"

                : "Smart Parking Platform"
              }

            </p>

          </div>

        </div>

        {/* ====================================== */}
        {/* DESKTOP NAV */}
        {/* ====================================== */}

        {user && (

          <div className="
            hidden
            lg:flex
            items-center
            gap-2
          ">

            {navLinks.map(
              (link) => (

                <Link
                  key={link.to}

                  to={link.to}

                  className={`
                    px-4
                    py-2
                    rounded-xl
                    text-sm
                    font-medium
                    transition-all
                    duration-200

                    ${isActive(
                      link.to
                    )}
                  `}
                >

                  {link.label}

                </Link>
              )
            )}

          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* RIGHT */}
      {/* ========================================== */}

      <div className="
        flex
        items-center
        gap-3
      ">

        {/* ====================================== */}
        {/* SEARCH */}
        {/* ====================================== */}

        {user && (

          <div className="
            hidden
            md:flex
            items-center
            gap-2
            bg-slate-800/70
            border
            border-slate-700
            px-3
            py-2
            rounded-xl
            min-w-[220px]
          ">

            <Search
              size={16}
              className="
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                bg-transparent
                outline-none
                text-sm
                w-full
                placeholder:text-slate-500
              "
            />

          </div>
        )}

        {/* ====================================== */}
        {/* WEBSOCKET STATUS */}
        {/* ====================================== */}

        {user && (

          <div className="
            hidden
            sm:flex
            items-center
            gap-2
            px-3
            py-2
            rounded-xl
            border
            border-slate-700
            bg-slate-800/60
          ">

            {connected ? (

              <Wifi
                size={16}
                className="
                  text-emerald-400
                "
              />

            ) : (

              <WifiOff
                size={16}
                className="
                  text-red-400
                "
              />
            )}

            <span className="
              text-xs
              text-slate-300
            ">

              {connected
                ? "Live"
                : "Offline"
              }

            </span>

          </div>
        )}

        {/* ====================================== */}
        {/* NOTIFICATIONS */}
        {/* ====================================== */}

        {user && (

          <button className="
            relative
            p-2.5
            rounded-xl
            bg-slate-800/60
            border
            border-slate-700
            hover:bg-slate-700
            transition
          ">

            <Bell
              size={18}
            />

            <span className="
              absolute
              top-1
              right-1
              w-2
              h-2
              rounded-full
              bg-emerald-400
            " />

          </button>
        )}

        {/* ====================================== */}
        {/* AUTH */}
        {/* ====================================== */}

        {user ? (

          <ProfileMenu />

        ) : (

          <div className="
            flex
            items-center
            gap-3
          ">

            <button
              onClick={() =>
                navigate("/login")
              }
              className="
                px-4
                py-2
                rounded-xl
                border
                border-emerald-500
                text-emerald-400
                hover:bg-emerald-500
                hover:text-black
                transition
              "
            >
              Login
            </button>

            <button
              onClick={() =>
                navigate("/signup")
              }
              className="
                px-4
                py-2
                rounded-xl
                bg-emerald-500
                text-black
                font-medium
                hover:bg-emerald-600
                transition
              "
            >
              Sign Up
            </button>

          </div>
        )}

      </div>

    </nav>
  );
}



















// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useState } from "react";
// import ProfileMenu from "./ProfileMenu";

// export default function Navbar() {
//   const { user, viewRole } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [mobileOpen, setMobileOpen] = useState(false);

//   // ===============================
//   // 🔹 ACTIVE LINK HELPER
//   // ===============================
//   const isActive = (path) =>
//     location.pathname === path
//       ? "text-emerald-400"
//       : "text-slate-300 hover:text-emerald-400";

//   return (
//     <nav className="h-16 bg-black/60 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 shadow-lg text-white fixed top-0 w-full z-50">

//       {/* ================= LOGO ================= */}
//       <div
//         className="flex items-center gap-3 cursor-pointer"
//         onClick={() => navigate("/")}
//       >
//         <div className="w-9 h-9 bg-emerald-500 text-black rounded-lg flex items-center justify-center font-bold">
//           P
//         </div>

//         <div>
//           <h1 className="text-xl font-bold text-emerald-400">
//             Smart Parking
//           </h1>
//           {user && (
//             <span className="text-xs text-slate-400">
//               {viewRole === "admin" ? "Admin Mode" : "User Mode"}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* ================= DESKTOP NAV ================= */}
//       <div className="hidden md:flex items-center gap-8">

//         <Link to="/dashboard" className={isActive("/dashboard")}>
//           Dashboard
//         </Link>

//         {viewRole === "user" && (
//           <>
//             <Link to="/slots" className={isActive("/slots")}>
//               Live Slots
//             </Link>

//             <Link to="/map" className={isActive("/map")}>
//               Live Map
//             </Link>

//             <Link to="/pricing" className={isActive("/pricing")}>
//               Pricing
//             </Link>
//           </>
//         )}

//         {viewRole === "admin" && (
//           <>
//             <Link to="/admin" className={isActive("/admin")}>
//               Admin Dashboard
//             </Link>

//             <Link to="/admin/live" className={isActive("/admin/live")}>
//               Live Control
//             </Link>

//             <Link to="/admin/violations" className={isActive("/admin/violations")}>
//               Violations
//             </Link>
//           </>
//         )}
//       </div>

//       {/* ================= RIGHT ================= */}
//       <div className="flex items-center gap-4">

//         {/* MOBILE MENU BUTTON */}
//         <button
//           onClick={() => setMobileOpen(!mobileOpen)}
//           className="md:hidden text-slate-300"
//         >
//           ☰
//         </button>

//         {user ? (
//           <ProfileMenu />
//         ) : (
//           <>
//             <button
//               onClick={() => navigate("/login")}
//               className="px-4 py-1.5 border border-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-black transition"
//             >
//               Login
//             </button>

//             <button
//               onClick={() => navigate("/signup")}
//               className="px-4 py-1.5 bg-emerald-500 text-black rounded-lg hover:bg-emerald-600 transition"
//             >
//               Sign Up
//             </button>
//           </>
//         )}
//       </div>

//       {/* ================= MOBILE MENU ================= */}
//       {mobileOpen && (
//         <div className="absolute top-16 left-0 w-full bg-black border-t border-slate-800 flex flex-col items-center py-4 gap-4 md:hidden">

//           <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
//             Dashboard
//           </Link>

//           {viewRole === "user" && (
//             <>
//               <Link to="/slots" onClick={() => setMobileOpen(false)}>
//                 Live Slots
//               </Link>

//               <Link to="/map" onClick={() => setMobileOpen(false)}>
//                 Live Map
//               </Link>

//               <Link to="/pricing" onClick={() => setMobileOpen(false)}>
//                 Pricing
//               </Link>
//             </>
//           )}

//           {viewRole === "admin" && (
//             <>
//               <Link to="/admin" onClick={() => setMobileOpen(false)}>
//                 Admin Dashboard
//               </Link>

//               <Link to="/admin/live" onClick={() => setMobileOpen(false)}>
//                 Live Control
//               </Link>

//               <Link to="/admin/violations" onClick={() => setMobileOpen(false)}>
//                 Violations
//               </Link>
//             </>
//           )}

//         </div>
//       )}
//     </nav>
//   );
// }