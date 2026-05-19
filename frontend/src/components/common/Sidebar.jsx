import {
  NavLink,
} from "react-router-dom";

import {
  FaTachometerAlt,
  FaCarSide,
  FaParking,
  FaMoneyBillWave,
  FaQrcode,
  FaHistory,
  FaUsers,
  FaMapMarkedAlt,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaCog,
  FaChartPie,
  FaFileAlt,
  FaTimes,
} from "react-icons/fa";

import {
  useMemo,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";


// ======================================================
// SIDEBAR
// ======================================================

export default function Sidebar({

  closeSidebar,

  collapsed = false,

}) {

  // ====================================================
  // AUTH
  // ====================================================

  const {

    user,

    logout,

    viewRole = "user",

  } = useAuth();


  // ====================================================
  // ADMIN NAVIGATION
  // ====================================================

  const adminLinks = useMemo(() => [

    {
      to: "/admin",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
    },

    {
      to: "/admin/analytics",
      label: "Analytics",
      icon: <FaChartPie />,
    },

    {
      to: "/admin/reports",
      label: "Reports",
      icon: <FaFileAlt />,
    },

    {
      to: "/admin/parking-lots",
      label: "Parking Lots",
      icon: <FaParking />,
    },

    {
      to: "/admin/slots",
      label: "Slots",
      icon: <FaParking />,
    },

    {
      to: "/admin/map",
      label: "Live Map",
      icon: <FaMapMarkedAlt />,
    },

    {
      to: "/admin/vehicles",
      label: "Vehicles",
      icon: <FaCarSide />,
    },

    {
      to: "/admin/bookings",
      label: "Bookings",
      icon: <FaHistory />,
    },

    {
      to: "/admin/payments",
      label: "Payments",
      icon: <FaMoneyBillWave />,
    },

    {
      to: "/admin/users",
      label: "Users",
      icon: <FaUsers />,
    },

    {
      to: "/admin/violations",
      label: "Violations",
      icon: <FaExclamationTriangle />,
    },

    {
      to: "/admin/settings",
      label: "Settings",
      icon: <FaCog />,
    },

    {
      to: "/gate",
      label: "Gate Scanner",
      icon: <FaQrcode />,
    },

  ], []);


  // ====================================================
  // USER NAVIGATION
  // ====================================================

  const userLinks = useMemo(() => [

    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
    },

    {
      to: "/slots",
      label: "Book Slot",
      icon: <FaParking />,
    },

    {
      to: "/my-bookings",
      label: "My Bookings",
      icon: <FaHistory />,
    },

    {
      to: "/vehicles",
      label: "Vehicles",
      icon: <FaCarSide />,
    },

    {
      to: "/payment",
      label: "Payments",
      icon: <FaMoneyBillWave />,
    },

  ], []);


  // ====================================================
  // LINKS
  // ====================================================

  const links =

    viewRole === "admin"

      ? adminLinks

      : userLinks;


  // ====================================================
  // NAV STYLE
  // ====================================================

  const navClass =
    ({ isActive }) => `

      group
      flex
      items-center

      ${
        collapsed

          ? "justify-center"

          : "gap-3"
      }

      px-4
      py-3

      rounded-xl

      text-sm
      font-medium

      transition-all
      duration-200

      relative

      ${
        isActive

          ? `
            bg-emerald-500/15
            text-emerald-400
            border
            border-emerald-500/20
            shadow-lg
          `

          : `
            text-slate-300
            hover:bg-slate-800/70
            hover:text-white
          `
      }
    `;


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout =
    async () => {

      try {

        await logout();

      } catch (error) {

        console.error(
          "Logout failed:",
          error
        );

      } finally {

        closeSidebar?.();
      }
    };


  // ====================================================
  // USER DATA
  // ====================================================

  const displayName =

    user?.username ||

    user?.name ||

    "User";

  const displayRole =

    viewRole ||

    "user";

  const avatarLetter =

    displayName?.[0]?.toUpperCase()

    ||

    "U";


  // ====================================================
  // UI
  // ====================================================

  return (

    <aside className="
      h-screen
      flex
      flex-col

      bg-slate-900/95
      backdrop-blur-xl

      border-r
      border-slate-800

      text-white
    ">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="
        sticky
        top-0
        z-20

        px-5
        py-5

        border-b
        border-slate-800

        bg-slate-900/95
        backdrop-blur-xl
      ">

        <div className="
          flex
          items-center
          justify-between
        ">

          {!collapsed && (

            <div>

              <h1 className="
                text-2xl
                font-bold
                text-emerald-400
              ">

                Smart Parking

              </h1>

              <p className="
                text-xs
                text-slate-400
                mt-1
              ">

                IoT Parking Platform

              </p>

            </div>
          )}

          {/* MOBILE CLOSE */}

          <button

            onClick={closeSidebar}

            className="
              lg:hidden
              text-slate-400
              hover:text-white
            "
          >

            <FaTimes />

          </button>

        </div>

      </div>


      {/* ========================================== */}
      {/* PROFILE */}
      {/* ========================================== */}

      <div className="
        px-4
        py-4
        border-b
        border-slate-800
      ">

        <div className={`
          flex
          items-center

          ${
            collapsed

              ? "justify-center"

              : "gap-3"
          }
        `}>

          {/* AVATAR */}

          <div className="
            w-11
            h-11

            rounded-full

            bg-emerald-500/20

            flex
            items-center
            justify-center

            text-emerald-400
            font-bold
            text-lg

            shrink-0
          ">

            {avatarLetter}

          </div>


          {/* USER INFO */}

          {!collapsed && (

            <div className="
              overflow-hidden
            ">

              <p className="
                font-semibold
                text-sm
                truncate
              ">

                {displayName}

              </p>

              <p className="
                text-xs
                text-slate-400
                capitalize
              ">

                {displayRole}

              </p>

            </div>
          )}

        </div>

      </div>


      {/* ========================================== */}
      {/* NAVIGATION */}
      {/* ========================================== */}

      <nav className="
        flex-1
        overflow-y-auto

        p-4
        space-y-2
      ">

        {links.map((item) => (

          <NavLink

            key={item.to}

            to={item.to}

            onClick={() =>
              closeSidebar?.()
            }

            className={navClass}
          >

            {/* ICON */}

            <span className="
              text-lg
              shrink-0
            ">

              {item.icon}

            </span>


            {/* LABEL */}

            {!collapsed && (

              <span className="
                truncate
              ">

                {item.label}

              </span>
            )}

          </NavLink>
        ))}

      </nav>


      {/* ========================================== */}
      {/* FOOTER */}
      {/* ========================================== */}

      <div className="
        p-4
        border-t
        border-slate-800
      ">

        <button

          onClick={handleLogout}

          className={`
            w-full

            flex
            items-center

            ${
              collapsed

                ? "justify-center"

                : "justify-center gap-3"
            }

            px-4
            py-3

            rounded-xl

            bg-red-500/10
            text-red-400

            hover:bg-red-500/20

            transition-all
          `}
        >

          <FaSignOutAlt />

          {!collapsed && "Logout"}

        </button>

      </div>

    </aside>
  );
}