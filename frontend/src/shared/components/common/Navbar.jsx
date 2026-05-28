import {
  Bell,
  Car,
  Wifi,
} from "lucide-react";

import ThemeToggle
  from "../../ui/ThemeToggle";

import {
  useAuth,
} from "../../../context/AuthContext";

import {
  useNotification,
} from "../../../context/NotificationContext";

export default function Navbar() {
  const { user } =
    useAuth();

  const {
    notifications = [],
  } = useNotification();

  const notificationCount =
    notifications.length;

  const username =
    user?.username || "User";

  const avatarLetter =
    username[0]
      ?.toUpperCase() || "U";

  return (
    <header className="
      h-16
      backdrop-blur-xl
      bg-slate-900/70
      border-b border-white/10
      flex items-center
      justify-between
      px-4 sm:px-6
      text-white
      w-full
    ">

      {/* LEFT */}
      <div className="
        flex items-center gap-4
        min-w-0
      ">

        {/* BRAND */}
        <div className="
          flex items-center gap-3
          min-w-0
        ">

          <div className="
            w-10 h-10
            rounded-2xl
            bg-gradient-to-br
            from-emerald-500
            to-blue-500
            flex items-center justify-center
            shadow-lg
            shrink-0
          ">
            <Car size={20} />
          </div>

          <div className="truncate">
            <h1 className="
              text-lg font-bold
              tracking-wide
              truncate
            ">
              Smart Parking
            </h1>

            <p className="
              text-xs
              text-slate-400
              hidden sm:block
            ">
              IoT Control Panel
            </p>
          </div>

        </div>

      </div>


      {/* RIGHT */}
      <div className="
        flex items-center
        gap-3 sm:gap-4
      ">

        {/* LIVE STATUS */}
        <div className="
          hidden md:flex
          items-center gap-2
          px-3 py-2
          rounded-xl
          bg-emerald-500/10
          border border-emerald-500/20
        ">
          <Wifi
            size={14}
            className="text-emerald-400"
          />

          <span className="
            text-xs
            text-emerald-300
            font-medium
          ">
            Live
          </span>
        </div>


        {/* NOTIFICATIONS */}
        <button className="
          relative
          p-2 rounded-xl
          hover:bg-white/10
          transition
        ">
          <Bell size={20} />

          {notificationCount > 0 && (
            <span className="
              absolute
              -top-1 -right-1
              min-w-[18px]
              h-[18px]
              px-1
              flex items-center justify-center
              bg-red-500
              text-[10px]
              rounded-full
              font-semibold
            ">
              {notificationCount > 99
                ? "99+"
                : notificationCount}
            </span>
          )}

        </button>


        {/* THEME */}
        <div className="
          p-2 rounded-xl
          bg-white/5
          border border-white/10
        ">
          <ThemeToggle />
        </div>


        {/* USER */}
        <div className="
          flex items-center
          gap-3
          px-3 sm:px-4
          py-2
          rounded-2xl
          bg-white/5
          border border-white/10
          hover:bg-white/10
          transition
          cursor-pointer
        ">

          <div className="
            w-10 h-10
            rounded-full
            bg-gradient-to-br
            from-emerald-500
            to-blue-500
            flex items-center justify-center
            font-bold
            shadow-lg
          ">
            {avatarLetter}
          </div>

          <div className="hidden sm:block">
            <p className="
              text-sm
              font-semibold
            ">
              {username}
            </p>

            <p className="
              text-xs
              text-slate-400
            ">
              Active Session
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}