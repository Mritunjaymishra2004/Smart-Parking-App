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
// STORAGE KEY
// ======================================================

const STORAGE_KEY =
  "smart-parking-theme";


// ======================================================
// SAFE BROWSER CHECK
// ======================================================

const isBrowser =
  typeof window !==
  "undefined";


// ======================================================
// SAFE STORAGE GET
// ======================================================

const getStoredTheme =
  () => {

    try {

      return localStorage.getItem(
        STORAGE_KEY
      );

    } catch {

      return null;
    }
  };


// ======================================================
// SAFE STORAGE SET
// ======================================================

const saveTheme =
  (theme) => {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        theme
      );

    } catch (error) {

      console.error(
        "Failed to save theme:",
        error
      );
    }
  };


// ======================================================
// SYSTEM THEME
// ======================================================

const getSystemTheme =
  () => {

    if (!isBrowser) {

      return "dark";
    }

    try {

      return window.matchMedia(

        "(prefers-color-scheme: dark)"

      ).matches

        ? "dark"

        : "light";

    } catch {

      return "dark";
    }
  };


// ======================================================
// INITIAL THEME
// ======================================================

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

  // ====================================================
  // STATE
  // ====================================================

  const [theme,
    setTheme] =
    useState(
      getInitialTheme
    );

  const [mounted,
    setMounted] =
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

    if (!isBrowser) {

      return;
    }

    const root =
      document.documentElement;

    // REMOVE OLD
    root.classList.remove(
      "light",
      "dark"
    );

    // ADD NEW
    root.classList.add(
      theme );

    // SAVE
    saveTheme(theme);

  }, [theme]);


  // ====================================================
  // SYSTEM THEME LISTENER
  // ====================================================

  useEffect(() => {

    if (!isBrowser) {

      return;
    }

    const mediaQuery =
      window.matchMedia(

        "(prefers-color-scheme: dark)"
      );

    const handleChange =
      (event) => {

        const storedTheme =
          getStoredTheme();

        // ==========================================
        // AUTO SWITCH ONLY IF
        // USER NEVER MANUALLY CHANGED
        // ==========================================

        if (

          !storedTheme ||

          storedTheme ===
          "system"

        ) {

          setTheme(

            event.matches

              ? "dark"

              : "light"
          );
        }
      };


    // ==============================================
    // LISTENER
    // ==============================================

    try {

      mediaQuery.addEventListener(

        "change",

        handleChange
      );

    } catch {

      mediaQuery.addListener(
        handleChange
      );
    }


    // ==============================================
    // CLEANUP
    // ==============================================

    return () => {

      try {

        mediaQuery.removeEventListener(

          "change",

          handleChange
        );

      } catch {

        mediaQuery.removeListener(
          handleChange
        );
      }
    };

  }, []);


  // ====================================================
  // TOGGLE THEME
  // ====================================================

  const toggleTheme =
    useCallback(() => {

      setTheme((prev) =>

        prev === "dark"

          ? "light"

          : "dark"
      );

    }, []);


  // ====================================================
  // SET LIGHT
  // ====================================================

  const setLightTheme =
    useCallback(() => {

      setTheme("light");

    }, []);


  // ====================================================
  // SET DARK
  // ====================================================

  const setDarkTheme =
    useCallback(() => {

      setTheme("dark");

    }, []);


  // ====================================================
  // VALUE
  // ====================================================

  const value =
    useMemo(() => ({

      theme,

      mounted,

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


  // ====================================================
  // PROVIDER
  // ====================================================

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

    console.error(
      "ThemeContext missing"
    );

    // ==============================================
    // SAFE FALLBACK
    // ==============================================

    return {

      theme: "dark",

      mounted: true,

      isDark: true,

      isLight: false,

      toggleTheme:
        () => {},

      setDarkTheme:
        () => {},

      setLightTheme:
        () => {},
    };
  }

  return context;
}