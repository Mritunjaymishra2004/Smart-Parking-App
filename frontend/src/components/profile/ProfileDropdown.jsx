import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";

import {
  ChevronDown,
  LogOut,
  Settings,
  User,
  ShieldCheck,
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
// MENU ITEM
// ======================================================

function MenuItem({

  icon,

  label,

  onClick,

  danger = false,

}) {

  return (

    <button

      onClick={onClick}

      className={`
        w-full

        flex
        items-center
        gap-3

        px-4
        py-3

        rounded-xl

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

      {icon}

      <span className="
        text-sm
        font-medium
      ">

        {label}

      </span>

    </button>
  );
}


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

    viewRole = "user",

  } = useAuth();


  // ====================================================
  // REFS
  // ====================================================

  const dropdownRef =
    useRef(null);


  // ====================================================
  // STATE
  // ====================================================

  const [open,
    setOpen] =
    useState(false);


  // ====================================================
  // USER DATA
  // ====================================================

  const displayName =
    useMemo(() => {

      return (

        user?.name ||

        user?.username ||

        "User"
      );

    }, [user]);


  const avatarLetter =
    useMemo(() => {

      return (
        displayName?.[0]?.toUpperCase()

        ||

        "U"
      );

    }, [displayName]);


  // ====================================================
  // CLOSE DROPDOWN
  // ====================================================

  const closeDropdown =
    useCallback(() => {

      setOpen(false);

    }, []);


  // ====================================================
  // OUTSIDE CLICK + ESCAPE
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

          closeDropdown();
        }
      };


    const handleEscape =
      (event) => {

        if (
          event.key === "Escape"
        ) {

          closeDropdown();
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

  }, [closeDropdown]);


  // ====================================================
  // NAVIGATION
  // ====================================================

  const navigateTo =
    useCallback((path) => {

      navigate(path);

      closeDropdown();

    }, [

      navigate,

      closeDropdown,
    ]);


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout =
    useCallback(async () => {

      try {

        await logout();

      } catch (error) {

        console.error(
          "Logout failed:",
          error
        );

      } finally {

        closeDropdown();

        navigate("/login");
      }

    }, [

      logout,

      navigate,

      closeDropdown,
    ]);


  // ====================================================
  // TOGGLE
  // ====================================================

  const toggleDropdown =
    () => {

      setOpen(
        (prev) => !prev
      );
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div

      ref={dropdownRef}

      className="
        relative
        z-[9999]
      "
    >

      {/* ========================================== */}
      {/* TRIGGER */}
      {/* ========================================== */}

      <button

        onClick={toggleDropdown}

        className="
          flex
          items-center
          gap-3

          px-3
          py-2

          rounded-2xl

          border
          border-slate-700

          bg-slate-900/80

          hover:bg-slate-800

          transition-all
          duration-200
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

          shrink-0
        ">

          {avatarLetter}

        </div>


        {/* USER */}

        <div className="
          hidden
          md:block

          text-left
        ">

          <p className="
            text-sm
            font-medium
            text-white

            leading-none
          ">

            {displayName}

          </p>

          <p className="
            text-xs
            text-slate-400

            capitalize

            mt-1
          ">

            {viewRole}

          </p>

        </div>


        {/* ICON */}

        <ChevronDown

          size={16}

          className={`
            text-slate-400

            transition-transform
            duration-200

            ${
              open

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

          w-[300px]

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

              {/* AVATAR */}

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

                {avatarLetter}

              </div>


              {/* INFO */}

              <div className="
                min-w-0
              ">

                <h3 className="
                  font-semibold
                  text-white

                  truncate
                ">

                  {displayName}

                </h3>

                <p className="
                  text-sm
                  text-slate-400

                  truncate
                ">

                  {user?.email}

                </p>


                {/* ROLE */}

                <div className="
                  mt-2

                  inline-flex
                  items-center
                  gap-2

                  px-2
                  py-1

                  rounded-lg

                  bg-emerald-500/10

                  text-emerald-400

                  text-xs
                  font-medium
                ">

                  <ShieldCheck
                    size={12}
                  />

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
            space-y-2
          ">

            <MenuItem

              icon={
                <User size={18} />
              }

              label="Profile"

              onClick={() =>
                navigateTo(
                  "/profile"
                )
              }

            />


            <MenuItem

              icon={
                <Settings
                  size={18}
                />
              }

              label="Settings"

              onClick={() =>
                navigateTo(
                  "/admin/settings"
                )
              }

            />


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

            <MenuItem

              icon={
                <LogOut
                  size={18}
                />
              }

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