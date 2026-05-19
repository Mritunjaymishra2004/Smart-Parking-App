import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import ThemeToggle
from "../ui/ThemeToggle";


// ======================================================
// PROFILE DROPDOWN
// ======================================================

export default function ProfileDropdown() {

  // ====================================================
  // HOOKS
  // ====================================================

  const navigate =
    useNavigate();

  const {

    user,

    logout,

  } = useAuth();

  const dropdownRef =
    useRef(null);


  // ====================================================
  // STATE
  // ====================================================

  const [open, setOpen] =
    useState(false);


  // ====================================================
  // CLOSE OUTSIDE
  // ====================================================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (

          dropdownRef.current &&

          !dropdownRef.current.contains(
            event.target
          )

        ) {

          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout =
    () => {

      logout();

      navigate("/login");
    };


  // ====================================================
  // PROFILE NAVIGATION
  // ====================================================

  const goToProfile =
    () => {

      navigate("/profile");

      setOpen(false);
    };


  // ====================================================
  // SETTINGS NAVIGATION
  // ====================================================

  const goToSettings =
    () => {

      navigate("/admin/settings");

      setOpen(false);
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      ref={dropdownRef}
      className="
        relative
      "
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

          border
          border-slate-700

          bg-slate-900/80
          hover:bg-slate-800

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

          {user?.name?.[0] || "U"}

        </div>


        {/* INFO */}

        <div className="
          hidden
          md:block
          text-left
        ">

          <p className="
            text-sm
            font-medium
            text-white
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


        {/* ICON */}

        <ChevronDown
          size={16}
          className="
            text-slate-400
          "
        />

      </button>


      {/* ========================================== */}
      {/* DROPDOWN */}
      {/* ========================================== */}

      {open && (

        <div className="
          absolute
          right-0
          mt-3

          w-[280px]

          bg-slate-900/95
          backdrop-blur-xl

          border
          border-slate-800

          rounded-2xl

          shadow-2xl

          overflow-hidden

          z-50
        ">

          {/* ====================================== */}
          {/* HEADER */}
          {/* ====================================== */}

          <div className="
            px-5
            py-5

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

                {user?.name?.[0] || "U"}

              </div>


              <div>

                <h3 className="
                  font-semibold
                  text-white
                ">

                  {user?.name || "User"}

                </h3>

                <p className="
                  text-sm
                  text-slate-400
                ">

                  {user?.email}

                </p>

              </div>

            </div>

          </div>


          {/* ====================================== */}
          {/* MENU */}
          {/* ====================================== */}

          <div className="
            p-3
            space-y-2
          ">

            {/* PROFILE */}

            <button

              onClick={
                goToProfile
              }

              className="
                w-full

                flex
                items-center
                gap-3

                px-4
                py-3

                rounded-xl

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

              onClick={
                goToSettings
              }

              className="
                w-full

                flex
                items-center
                gap-3

                px-4
                py-3

                rounded-xl

                text-slate-300
                hover:bg-slate-800
                hover:text-white

                transition-all
              "
            >

              <Settings size={18} />

              Settings

            </button>


            {/* THEME */}

            <div className="
              px-2
              py-2
            ">

              <ThemeToggle
                className="w-full"
              />

            </div>

          </div>


          {/* ====================================== */}
          {/* FOOTER */}
          {/* ====================================== */}

          <div className="
            p-3

            border-t
            border-slate-800
          ">

            <button

              onClick={
                handleLogout
              }

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