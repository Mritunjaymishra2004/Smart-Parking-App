import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Wifi,
  WifiOff,
  Activity,
  Shield,
  UserCog,
  Settings,
  Building2,
  Users,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  User,
  Bell,
} from "lucide-react";

import {
  useMemo,
  memo,
  useState,
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


// ======================================================
// NAV ITEM
// ======================================================

const NavItem = memo(({

  link,

  active,

}) => {

  return (

    <Link

      to={link.to}

      className={`
        px-4
        py-2

        rounded-2xl

        text-sm
        font-medium

        transition-all
        duration-200

        whitespace-nowrap

        ${
          active

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
            `
        }
      `}
    >

      {link.label}

    </Link>
  );
});


// ======================================================
// STATUS BADGE
// ======================================================

const StatusBadge = memo(({

  icon,

  text,

  color,

}) => {

  return (

    <div className="
      hidden
      xl:flex

      items-center
      gap-2

      px-3
      py-2

      rounded-2xl

      border
      border-slate-700

      bg-slate-800/60
    ">

      <div className={color}>

        {icon}

      </div>

      <span className="
        text-xs
        text-slate-300
      ">

        {text}

      </span>

    </div>
  );
});


// ======================================================
// PROFILE DROPDOWN
// ======================================================

function ProfileMenu({

  user,

  role,

  logout,

  navigate,

}) {

  const [open,
    setOpen] =
    useState(false);

  const isAdmin =
    role === "admin";

  return (

    <div className="
      relative
    ">

      {/* BUTTON */}

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

          rounded-2xl

          bg-slate-800/70

          border
          border-slate-700

          hover:border-emerald-500/30

          transition-all
        "
      >

        {/* AVATAR */}

        <div className="
          w-10
          h-10

          rounded-full

          bg-emerald-500/20

          flex
          items-center
          justify-center

          text-emerald-400
          font-bold
        ">

          {
            user?.username?.[0]
              ?.toUpperCase()

            ||

            "U"
          }

        </div>


        {/* USER */}

        <div className="
          hidden
          lg:block

          text-left
        ">

          <p className="
            text-sm
            font-semibold
            text-white
          ">

            {
              user?.username

              ||

              "User"
            }

          </p>

          <p className="
            text-xs
            text-slate-400
            capitalize
          ">

            {role}

          </p>

        </div>

        <ChevronDown
          size={16}
          className="
            text-slate-400
          "
        />

      </button>


      {/* DROPDOWN */}

      {open && (

        <div className="
          absolute
          right-0
          mt-3

          w-80

          rounded-3xl

          border
          border-slate-700

          bg-slate-900

          shadow-2xl

          overflow-hidden

          z-[9999]
        ">

          {/* HEADER */}

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

                text-2xl
                font-bold

                text-emerald-400
              ">

                {
                  user?.username?.[0]
                    ?.toUpperCase()

                  ||

                  "U"
                }

              </div>

              <div>

                <h3 className="
                  text-lg
                  font-bold
                  text-white
                ">

                  {
                    user?.username
                  }

                </h3>

                <p className="
                  text-sm
                  text-slate-400
                ">

                  {
                    user?.email
                  }

                </p>

                <p className="
                  text-xs
                  text-emerald-400
                  mt-1
                  capitalize
                ">

                  {role}

                </p>

              </div>

            </div>

          </div>


          {/* MENU */}

          <div className="
            p-3
            space-y-2
          ">

            {/* PROFILE */}

            <button

              onClick={() => {

                navigate("/profile");

                setOpen(false);
              }}

              className="
                w-full

                flex
                items-center
                gap-3

                px-4
                py-3

                rounded-2xl

                text-slate-300

                hover:bg-slate-800
                hover:text-white

                transition-all
              "
            >

              <User size={18} />

              Profile

            </button>


            {/* SETTINGS */}

            <button

              onClick={() => {

                navigate("/settings");

                setOpen(false);
              }}

              className="
                w-full

                flex
                items-center
                gap-3

                px-4
                py-3

                rounded-2xl

                text-slate-300

                hover:bg-slate-800
                hover:text-white

                transition-all
              "
            >

              <Settings size={18} />

              Settings

            </button>


            {/* ADMIN FEATURES */}

            {isAdmin && (

              <>

                {/* SWITCH ACCOUNT */}

                <button

                  onClick={() => {

                    navigate(
                      "/admin/users"
                    );

                    setOpen(false);
                  }}

                  className="
                    w-full

                    flex
                    items-center
                    gap-3

                    px-4
                    py-3

                    rounded-2xl

                    text-slate-300

                    hover:bg-slate-800
                    hover:text-white

                    transition-all
                  "
                >

                  <Users size={18} />

                  Switch User Access

                </button>


                {/* APP MANAGEMENT */}

                <button

                  onClick={() => {

                    navigate(
                      "/admin/settings"
                    );

                    setOpen(false);
                  }}

                  className="
                    w-full

                    flex
                    items-center
                    gap-3

                    px-4
                    py-3

                    rounded-2xl

                    text-slate-300

                    hover:bg-slate-800
                    hover:text-white

                    transition-all
                  "
                >

                  <Shield size={18} />

                  Application Management

                </button>


                {/* COMPANY */}

                <button

                  onClick={() => {

                    navigate(
                      "/admin/company"
                    );

                    setOpen(false);
                  }}

                  className="
                    w-full

                    flex
                    items-center
                    gap-3

                    px-4
                    py-3

                    rounded-2xl

                    text-slate-300

                    hover:bg-slate-800
                    hover:text-white

                    transition-all
                  "
                >

                  <Building2 size={18} />

                  Company Settings

                </button>

              </>
            )}


            {/* THEME */}

            <div className="
              flex
              items-center
              justify-between

              px-4
              py-3

              rounded-2xl

              bg-slate-800/60
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <Moon size={18} />

                <span className="
                  text-sm
                  text-slate-300
                ">

                  Theme

                </span>

              </div>

              <ThemeToggle />

            </div>


            {/* LOGOUT */}

            <button

              onClick={() => {

                logout();

                setOpen(false);
              }}

              className="
                w-full

                flex
                items-center
                gap-3

                px-4
                py-3

                rounded-2xl

                text-red-400

                hover:bg-red-500/10

                transition-all
              "
            >

              <LogOut size={18} />

              Logout

            </button>

          </div>

        </div>
      )}

    </div>
  );
}


// ======================================================
// NAVBAR
// ======================================================

export default function Navbar() {

  const {

    user,

    logout,

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
  // ROLE
  // ====================================================

  const role =

    user?.role ||

    viewRole ||

    "user";


  // ====================================================
  // ACTIVE
  // ====================================================

  const isActive =
    (path) => {

      return location.pathname
        .startsWith(path);
    };


  // ====================================================
  // NAV LINKS
  // ====================================================

  const navLinks =
    useMemo(() => {

      if (role === "admin") {

        return [

          {
            to: "/admin",
            label: "Dashboard",
          },

          {
            to: "/admin/analytics",
            label: "Analytics",
          },

          {
            to: "/admin/users",
            label: "Users",
          },

          {
            to: "/admin/settings",
            label: "Settings",
          },
        ];
      }

      return [

        {
          to: "/user-dashboard",
          label: "Dashboard",
        },

        {
          to: "/slots",
          label: "Slots",
        },

        {
          to: "/my-bookings",
          label: "Bookings",
        },
      ];

    }, [role]);


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
      z-[1000]
    ">

      {/* LEFT */}

      <div className="
        flex
        items-center
        gap-6
      ">

        <div

          onClick={() =>
            navigate("/")
          }

          className="
            flex
            items-center
            gap-3

            cursor-pointer
          "
        >

          <div className="
            w-10
            h-10

            rounded-2xl

            bg-emerald-500

            flex
            items-center
            justify-center

            text-black
            font-bold
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
            ">

              Smart Parking

            </h1>

            <p className="
              text-[11px]
              text-slate-400
            ">

              {
                role === "admin"

                  ? "Admin Control Center"

                  : "Smart Parking Platform"
              }

            </p>

          </div>

        </div>


        {/* NAVIGATION */}

        {user && (

          <div className="
            hidden
            xl:flex

            items-center
            gap-2
          ">

            {navLinks.map((link) => (

              <NavItem

                key={link.to}

                link={link}

                active={isActive(
                  link.to
                )}

              />

            ))}

          </div>
        )}

      </div>


      {/* RIGHT */}

      <div className="
        flex
        items-center
        gap-3
      ">

        {/* SEARCH */}

        {user && (

          <div className="
            hidden
            lg:block

            w-[320px]
          ">

            <GlobalSearch
              data={[]}
            />

          </div>
        )}


        {/* STATUS */}

        {user && (

          <StatusBadge

            icon={
              connected

                ? <Wifi size={16} />

                : <WifiOff size={16} />
            }

            text={
              connected

                ? "Realtime"

                : "Offline"
            }

            color={
              connected

                ? "text-emerald-400"

                : "text-red-400"
            }

          />
        )}


        {/* ANALYTICS */}

        {user && (

          <StatusBadge

            icon={
              <Activity size={16} />
            }

            text="Live Analytics"

            color="text-blue-400"

          />
        )}


        {/* NOTIFICATIONS */}

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


        {/* PROFILE */}

        {user ? (

          <ProfileMenu

            user={user}

            role={role}

            logout={logout}

            navigate={navigate}

          />

        ) : (

          <button

            onClick={() =>
              navigate("/login")
            }

            className="
              px-4
              py-2

              rounded-2xl

              bg-emerald-500

              text-black
              font-medium
            "
          >

            Login

          </button>
        )}

      </div>

    </nav>
  );
}