import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";


// ======================================================
// CONTEXT
// ======================================================

const ThemeContext =
  createContext(null);


// ======================================================
// STORAGE
// ======================================================

const STORAGE_KEY =
  "smart-parking-theme";


// ======================================================
// HELPERS
// ======================================================

const getStoredTheme = () => {
  try {
    return localStorage.getItem(
      STORAGE_KEY
    );
  } catch {
    return null;
  }
};

const saveTheme = (
  theme
) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      theme
    );
  } catch {}
};

const getSystemTheme =
  () => {
    if (
      typeof window ===
      "undefined"
    ) {
      return "dark";
    }

    return window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
      ? "dark"
      : "light";
  };

const getInitialTheme =
  () => {
    const stored =
      getStoredTheme();

    if (
      stored === "dark" ||
      stored === "light"
    ) {
      return stored;
    }

    return getSystemTheme();
  };


// ======================================================
// PROVIDER
// ======================================================

export function ThemeProvider({
  children,
}) {
  const [theme, setTheme] =
    useState(
      getInitialTheme
    );

  const [mounted, setMounted] =
    useState(false);


  // ====================================================
  // MOUNT
  // ====================================================

  useEffect(() => {
    setMounted(true);
  }, []);


  // ====================================================
  // APPLY THEME
  // ====================================================

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.remove(
      "light",
      "dark"
    );

    root.classList.add(
      theme
    );

    root.style.colorScheme =
      theme;

    saveTheme(theme);
  }, [theme]);


  // ====================================================
  // SYSTEM THEME LISTENER
  // ====================================================

  useEffect(() => {
    const media =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handler = (
      event
    ) => {
      const stored =
        getStoredTheme();

      if (!stored) {
        setTheme(
          event.matches
            ? "dark"
            : "light"
        );
      }
    };

    media.addEventListener(
      "change",
      handler
    );

    return () =>
      media.removeEventListener(
        "change",
        handler
      );
  }, []);


  // ====================================================
  // ACTIONS
  // ====================================================

  const toggleTheme =
    useCallback(() => {
      setTheme((prev) =>
        prev === "dark"
          ? "light"
          : "dark"
      );
    }, []);

  const setDarkTheme =
    useCallback(() => {
      setTheme("dark");
    }, []);

  const setLightTheme =
    useCallback(() => {
      setTheme("light");
    }, []);


  // ====================================================
  // VALUE
  // ====================================================

  const value =
    useMemo(() => ({
      theme,
      mounted,

      darkMode:
        theme === "dark",

      isDark:
        theme === "dark",

      isLight:
        theme === "light",

      toggleTheme,
      setDarkTheme,
      setLightTheme,
    }), [
      theme,
      mounted,
      toggleTheme,
      setDarkTheme,
      setLightTheme,
    ]);


  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}


// ======================================================
// HOOK
// ======================================================

export function useTheme() {
  const context =
    useContext(
      ThemeContext
    );

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}