import {
  NavLink,
  useLocation,
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
} from "react-icons/fa";

import {
  useAuth,
} from "../../context/AuthContext";

// ======================================================
// SIDEBAR
// ======================================================

export default function Sidebar({

  closeSidebar,

}) {

  // ====================================================
  // HOOKS
  // ====================================================

  const {
    user,
    logout,
  } = useAuth();

  const location =
    useLocation();

  // ====================================================
  // NAVIGATION ITEMS
  // ====================================================

  const adminLinks = [

    {
      to: "/admin",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
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
      to: "/gate",
      label: "Gate Scanner",
      icon: <FaQrcode />,
    },
  ];

  const userLinks = [

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
  ];

  const links =
    user?.role === "admin"
      ? adminLinks
      : userLinks;

  // ====================================================
  // NAV LINK STYLE
  // ====================================================

  const navClass = (
    isActive
  ) => `

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

  const handleLogout = () => {

    logout();
  };

  // ====================================================
  // UI
  // ====================================================

  return (

    <aside className="
      h-full
      flex
      flex-col
      bg-slate-900/95
      text-white
    ">

      {/* ========================================== */}
      {/* BRAND */}
      {/* ========================================== */}

      <div className="
        px-6
        py-5
        border-b
        border-slate-800
      ">

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

      {/* ========================================== */}
      {/* USER INFO */}
      {/* ========================================== */}

      <div className="
        px-5
        py-4
        border-b
        border-slate-800
      ">

        <div className="
          flex
          items-center
          gap-3
        ">

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
          ">

            {user?.name?.[0] || "U"}

          </div>

          <div>

            <p className="
              font-semibold
              text-sm
            ">
              {user?.name || "User"}
            </p>

            <p className="
              text-xs
              text-slate-400
              capitalize
            ">
              {user?.role || "user"}
            </p>

          </div>

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

        {links.map((item) => {

          const isActive =
            location.pathname ===
            item.to;

          return (

            <NavLink
              key={item.to}

              to={item.to}

              onClick={() =>
                closeSidebar?.()
              }

              className={() =>
                navClass(isActive)
              }
            >

              <span className="
                text-lg
              ">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

            </NavLink>
          );
        })}

      </nav>

      {/* ========================================== */}
      {/* LOGOUT */}
      {/* ========================================== */}

      <div className="
        p-4
        border-t
        border-slate-800
      ">

        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            px-4
            py-3
            rounded-xl
            bg-red-500/10
            text-red-400
            hover:bg-red-500/20
            transition
          "
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </aside>
  );
}


// import { NavLink } from "react-router-dom";
// import {
//   FaTachometerAlt,
//   FaCarSide,
//   FaParking,
//   FaClipboardList,
//   FaMoneyBillWave,
//   FaQrcode,
//   FaHistory,
// } from "react-icons/fa";

// export default function Sidebar() {
//   const navClass = ({ isActive }) =>
//     `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
//      ${
//        isActive
//          ? "bg-emerald-500/20 text-emerald-400"
//          : "text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
//      }`;

//   return (
//     <aside className="w-64 bg-slate-900 border-r border-slate-800 h-full p-4 space-y-4">
      
//       <NavLink to="/admin" className={navClass}>
//         <FaTachometerAlt />
//         Dashboard
//       </NavLink>

//       <NavLink to="/user" className={navClass}>
//         <FaParking />
//         Book Slot
//       </NavLink>

//       <NavLink to="/history" className={navClass}>
//         <FaHistory />
//         My Bookings
//       </NavLink>

//       <NavLink to="/gate" className={navClass}>
//         <FaQrcode />
//         Gate Scanner
//       </NavLink>

//       <NavLink to="/vehicles" className={navClass}>
//         <FaCarSide />
//         Vehicles
//       </NavLink>

//       <NavLink to="/payments" className={navClass}>
//         <FaMoneyBillWave />
//         Payments
//       </NavLink>

//     </aside>
//   );
// }