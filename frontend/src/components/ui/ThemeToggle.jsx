import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useTheme,
} from "../../context/ThemeContext";


// ======================================================
// THEME TOGGLE
// ======================================================

export default function ThemeToggle({

  className = "",

  iconOnly = false,

}) {

  // ====================================================
  // MOUNTED
  // ====================================================

  const [mounted,
    setMounted] =
    useState(false);


  // ====================================================
  // THEME CONTEXT
  // ====================================================

  let theme = "dark";

  let isDark = true;

  let toggleTheme =
    () => {};

  try {

    const themeContext =
      useTheme();

    theme =
      themeContext?.theme
      || "dark";

    isDark =
      themeContext?.isDark
      ?? true;

    toggleTheme =
      themeContext?.toggleTheme
      || (() => {});

  } catch (error) {

    console.error(
      "Theme context error:",
      error
    );
  }


  // ====================================================
  // MOUNT
  // ====================================================

  useEffect(() => {

    setMounted(true);

  }, []);


  // ====================================================
  // THEME LABEL
  // ====================================================

  const themeLabel =
    useMemo(() => (

      isDark

        ? "Light Mode"

        : "Dark Mode"

    ), [isDark]);


  // ====================================================
  // ICON
  // ====================================================

  const icon =
    useMemo(() => (

      isDark

        ? (
          <Sun
            size={18}
            className="
              text-yellow-400
            "
          />
        )

        : (
          <Moon
            size={18}
            className="
              text-slate-300
            "
          />
        )

    ), [isDark]);


  // ====================================================
  // PREVENT HYDRATION MISMATCH
  // ====================================================

  if (!mounted) {

    return null;
  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <button

      type="button"

      onClick={toggleTheme}

      aria-label={
        `Switch to ${themeLabel}`
      }

      title={
        `Switch to ${themeLabel}`
      }

      className={`
        flex
        items-center
        justify-center
        gap-2

        px-4
        py-2.5

        rounded-xl

        border
        border-slate-700

        bg-slate-900/80
        hover:bg-slate-800

        text-slate-300
        hover:text-white

        transition-all
        duration-200

        shadow-lg

        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500/50

        active:scale-95

        ${className}
      `}
    >

      {/* ======================================== */}
      {/* ICON */}
      {/* ======================================== */}

      <span className="
        transition-transform
        duration-300
      ">

        {icon}

      </span>


      {/* ======================================== */}
      {/* LABEL */}
      {/* ======================================== */}

      {!iconOnly && (

        <span className="
          text-sm
          font-medium
          whitespace-nowrap
        ">

          {themeLabel}

        </span>
      )}

    </button>
  );
}