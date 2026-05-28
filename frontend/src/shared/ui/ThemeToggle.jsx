import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "../../context/ThemeContext";


// ======================================================
// THEME TOGGLE
// ======================================================

export default function ThemeToggle() {
  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        darkMode
          ? "Switch to Light Mode"
          : "Switch to Dark Mode"
      }
      title={
        darkMode
          ? "Switch to Light Mode"
          : "Switch to Dark Mode"
      }
      className="
        relative
        p-3
        rounded-xl
        bg-slate-800
        hover:bg-slate-700
        border border-white/10
        text-white
        transition-all duration-300
        flex items-center justify-center
        hover:scale-105
        active:scale-95
      "
    >

      <span className="
        absolute inset-0
        rounded-xl
        bg-gradient-to-br
        from-emerald-500/10
        to-blue-500/10
        opacity-0
        hover:opacity-100
        transition-opacity
      " />

      <span className="relative z-10">
        {darkMode ? (
          <Sun
            size={18}
            className="
              text-yellow-400
              transition-transform
              duration-300
              rotate-0
            "
          />
        ) : (
          <Moon
            size={18}
            className="
              text-slate-200
              transition-transform
              duration-300
              rotate-12
            "
          />
        )}
      </span>

    </button>
  );
}