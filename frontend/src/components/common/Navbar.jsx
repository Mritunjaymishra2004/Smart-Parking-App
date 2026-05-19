import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Wifi,
  WifiOff,
  Activity,
} from "lucide-react";

import {
  useMemo,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useWebSocket,
} from "../../websocket/WebSocketContext";

import {
  useNotification,
} from "../../context/NotificationContext";

import GlobalSearch
  from "../search/GlobalSearch";

import ThemeToggle
  from "../ui/ThemeToggle";

import NotificationDropdown
  from "../notifications/NotificationDropdown";

import ProfileDropdown
  from "../profile/ProfileDropdown";


// ======================================================
// NAVBAR
// ======================================================

export default function Navbar() {

  // ====================================================
  // HOOKS
  // ====================================================

  const {
    user,
    viewRole = "user",
  } = useAuth();

  const {
    connected,
  } = useWebSocket();

  const {
    notifications = [],
    clearNotifications,
    markAllRead,
  } = useNotification();

  const navigate =
    useNavigate();

  const location =
    useLocation();


  // ====================================================
  // ACTIVE LINK
  // ====================================================

  const isActive =
    (path) => {

      return location.pathname
        .startsWith(path)

        ? `
          text-emerald-400
          bg-emerald-500/10
          border
          border-emerald-500/20
        `

        : `
          text-slate-300
          hover:text-white
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
      to: "/admin/analytics",
      label: "Analytics",
    },

    {
      to: "/admin/reports",
      label: "Reports",
    },

    {
      to: "/admin/map",
      label: "Live Map",
    },
  ];

  const navLinks =
    viewRole === "admin"

      ? adminLinks

      : userLinks;


  // ====================================================
  // SEARCH DATA
  // ====================================================

  const searchData =
    useMemo(() => [

      {
        id: 1,
        name:
          "Admin Dashboard",
        route:
          "/admin",
        type:
          "dashboard",
      },

      {
        id: 2,
        name:
          "Parking Slots",
        route:
          "/slots",
        type:
          "slots",
      },

      {
        id: 3,
        name:
          "Analytics",
        route:
          "/admin/analytics",
        type:
          "analytics",
      },

      {
        id: 4,
        name:
          "Reports",
        route:
          "/admin/reports",
        type:
          "reports",
      },

      {
        id: 5,
        name:
          "Payments",
        route:
          "/admin/payments",
        type:
          "payments",
      },

    ], []);


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
      z-40
    ">

      {/* ========================================== */}
      {/* LEFT */}
      {/* ========================================== */}

      <div className="
        flex
        items-center
        gap-6

        min-w-0
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
            shrink-0
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


          <div className="
            hidden
            sm:block
          ">

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

              {
                viewRole === "admin"

                  ? "Admin Control Center"

                  : "Smart Parking Platform"
              }

            </p>

          </div>

        </div>


        {/* ====================================== */}
        {/* NAV LINKS */}
        {/* ====================================== */}

        {user && (

          <div className="
            hidden
            xl:flex
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

        min-w-0
      ">

        {/* ====================================== */}
        {/* SEARCH */}
        {/* ====================================== */}

        {user && (

          <div className="
            hidden
            lg:block
            w-[320px]
          ">

            <GlobalSearch
              data={searchData}
            />

          </div>
        )}


        {/* ====================================== */}
        {/* REALTIME */}
        {/* ====================================== */}

        {user && (

          <div className="
            hidden
            md:flex

            items-center
            gap-2

            px-3
            py-2

            rounded-xl

            border
            border-slate-700

            bg-slate-800/60
          ">

            {
              connected

                ? (

                  <Wifi
                    size={16}
                    className="
                      text-emerald-400
                    "
                  />
                )

                : (

                  <WifiOff
                    size={16}
                    className="
                      text-red-400
                    "
                  />
                )
            }

            <span className="
              text-xs
              text-slate-300
            ">

              {
                connected

                  ? "Realtime"

                  : "Offline"
              }

            </span>

          </div>
        )}


        {/* ====================================== */}
        {/* LIVE */}
        {/* ====================================== */}

        {user && (

          <div className="
            hidden
            xl:flex

            items-center
            gap-2

            px-3
            py-2

            rounded-xl

            border
            border-slate-700

            bg-slate-800/60
          ">

            <Activity
              size={16}
              className="
                text-blue-400
              "
            />

            <span className="
              text-xs
              text-slate-300
            ">

              Live Analytics

            </span>

          </div>
        )}


        {/* ====================================== */}
        {/* THEME */}
        {/* ====================================== */}

        <ThemeToggle
          iconOnly
        />


        {/* ====================================== */}
        {/* NOTIFICATIONS */}
        {/* ====================================== */}

        {user && (

          <NotificationDropdown

            notifications={
              notifications
            }

            onClearAll={
              clearNotifications
            }

            onMarkAllRead={
              markAllRead
            }

          />
        )}


        {/* ====================================== */}
        {/* PROFILE */}
        {/* ====================================== */}

        {user ? (

          <ProfileDropdown />

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