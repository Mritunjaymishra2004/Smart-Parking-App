import {
  NavLink,
  useLocation,
} from "react-router-dom";

import {
  FaTachometerAlt,
  FaCarSide,
  FaParking,
  FaQrcode,
  FaHistory,
  FaUsers,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaCog,
  FaChartPie,
  FaFileAlt,
  FaTimes,
  FaMoon,
  FaWifi,
  FaCreditCard,
} from "react-icons/fa";

import {
  useMemo,
  memo,
} from "react";

import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";


// ======================================================
// NAV ITEM
// ======================================================

const NavItem = memo(({
  item,
  collapsed,
  closeSidebar,
}) => {
  const location =
    useLocation();

  const isActive =
    location.pathname === item.to ||
    (
      item.to !== "/" &&
      location.pathname.startsWith(item.to)
    );

  return (
    <NavLink
      to={item.to}
      onClick={() =>
        closeSidebar?.()
      }
      title={
        collapsed
          ? item.label
          : ""
      }
      className={`
        group flex items-center
        ${collapsed
          ? "justify-center"
          : "gap-4"}
        px-4 py-3 rounded-2xl
        text-sm font-medium
        transition-all duration-300
        relative overflow-hidden
        ${
          isActive
            ? `
              bg-gradient-to-r
              from-emerald-500/20
              to-blue-500/10
              text-emerald-300
              border border-emerald-500/20
            `
            : `
              text-slate-300
              hover:bg-white/5
              hover:text-white
            `
        }
      `}
    >
      {isActive && (
        <div className="
          absolute left-0
          top-2 bottom-2
          w-1 rounded-full
          bg-emerald-400
        " />
      )}

      <span className="text-lg">
        {item.icon}
      </span>

      {!collapsed && (
        <span>
          {item.label}
        </span>
      )}
    </NavLink>
  );
});


// ======================================================
// SIDEBAR
// ======================================================

export default function Sidebar({
  closeSidebar,
  collapsed = false,
  isAdmin = false,
}) {
  const {
    user,
    logout,
  } = useAuth();

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  const currentRole =
    user?.role || "user";

  const isAdminUser =
    currentRole === "admin" ||
    isAdmin;


  // ADMIN LINKS
  const adminLinks =
    useMemo(() => [
      {
        to: "/admin/dashboard",
        label: "Dashboard",
        icon: <FaTachometerAlt />,
      },
      {
        to: "/admin/analytics",
        label: "Analytics",
        icon: <FaChartPie />,
      },
      {
        to: "/admin/users",
        label: "Users",
        icon: <FaUsers />,
      },
      {
        to: "/admin/parking-lots",
        label: "Parking Lots",
        icon: <FaParking />,
      },
      {
        to: "/admin/bookings",
        label: "Bookings",
        icon: <FaHistory />,
      },
      {
        to: "/admin/payments",
        label: "Payments",
        icon: <FaCreditCard />,
      },
      {
        to: "/admin/live-map",
        label: "Live Map",
        icon: <FaMapMarkedAlt />,
      },
      {
        to: "/admin/gate",
        label: "Gate Scanner",
        icon: <FaQrcode />,
      },
      {
        to: "/admin/reports",
        label: "Reports",
        icon: <FaFileAlt />,
      },
      {
        to: "/admin/settings",
        label: "Settings",
        icon: <FaCog />,
      },
    ], []);


  // USER LINKS
  const userLinks =
    useMemo(() => [
      {
        to: "/user/dashboard",
        label: "Dashboard",
        icon: <FaTachometerAlt />,
      },
      {
        to: "/user/slots",
        label: "Slots",
        icon: <FaParking />,
      },
      {
        to: "/user/bookings",
        label: "Bookings",
        icon: <FaHistory />,
      },
      {
        to: "/user/payment",
        label: "Payment",
        icon: <FaCreditCard />,
      },
      {
        to: "/user/vehicles",
        label: "Vehicles",
        icon: <FaCarSide />,
      },
      {
        to: "/user/live-map",
        label: "Live Map",
        icon: <FaMapMarkedAlt />,
      },
      {
        to: "/user/settings",
        label: "Settings",
        icon: <FaCog />,
      },
    ], []);


  const links =
    isAdminUser
      ? adminLinks
      : userLinks;


  const handleLogout =
    async () => {
      await logout();
      closeSidebar?.();
    };


  const displayName =
    user?.username ||
    user?.email ||
    "User";

  const avatarLetter =
    displayName[0]
      ?.toUpperCase() || "U";


  return (
    <aside className="
      h-full
      flex flex-col
      bg-slate-900/95
      backdrop-blur-xl
      border-r border-white/10
      text-white
    ">

      {/* HEADER */}
      <div className="px-5 py-5 border-b border-white/10">

        <div className="flex items-center justify-between">

          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-emerald-400">
                Smart Parking
              </h1>

              <div className="flex items-center gap-2 mt-1 text-xs text-emerald-400">
                <FaWifi />
                Live Connected
              </div>
            </div>
          )}

          <button
            onClick={closeSidebar}
            className="lg:hidden"
          >
            <FaTimes />
          </button>

        </div>
      </div>


      {/* PROFILE */}
      <div className="px-4 py-5 border-b border-white/10">

        <div className={`flex items-center ${
          collapsed
            ? "justify-center"
            : "gap-3"
        }`}>

          <div className="
            w-12 h-12
            rounded-2xl
            bg-gradient-to-br
            from-emerald-500
            to-blue-500
            flex items-center justify-center
            font-bold
          ">
            {avatarLetter}
          </div>

          {!collapsed && (
            <div>
              <p className="font-semibold">
                {displayName}
              </p>

              <p className="text-xs text-slate-400">
                {currentRole}
              </p>
            </div>
          )}

        </div>
      </div>


      {/* NAV */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {links.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            collapsed={collapsed}
            closeSidebar={closeSidebar}
          />
        ))}
      </nav>


      {/* FOOTER */}
      <div className="p-4 border-t border-white/10 space-y-3">

        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10"
        >
          <FaMoon />
          {!collapsed &&
            (darkMode
              ? "Light Mode"
              : "Dark Mode")}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
        >
          <FaSignOutAlt />
          {!collapsed &&
            "Logout"}
        </button>

      </div>

    </aside>
  );
}