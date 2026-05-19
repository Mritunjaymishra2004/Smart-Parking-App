import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

import api from "../api/axios";

import {
  connectWebSocket,
  disconnectWebSocket,
} from "../websocket/websocketService";


// ======================================================
// CONTEXT
// ======================================================

const AuthContext =
  createContext(null);


// ======================================================
// TOKEN KEYS
// ======================================================

const TOKEN_KEYS = {

  access: "access",

  refresh: "refresh",

  role: "viewRole",
};


// ======================================================
// TOKEN HELPERS
// ======================================================

const getAccessToken =
  () => {

    return localStorage.getItem(
      TOKEN_KEYS.access
    );
  };


const getRefreshToken =
  () => {

    return localStorage.getItem(
      TOKEN_KEYS.refresh
    );
  };


const getStoredRole =
  () => {

    return (

      localStorage.getItem(
        TOKEN_KEYS.role
      )

      ||

      "user"
    );
  };


const setTokens =
  (
    access,
    refresh
  ) => {

    localStorage.setItem(
      TOKEN_KEYS.access,
      access
    );

    localStorage.setItem(
      TOKEN_KEYS.refresh,
      refresh
    );
  };


const clearTokens =
  () => {

    localStorage.removeItem(
      TOKEN_KEYS.access
    );

    localStorage.removeItem(
      TOKEN_KEYS.refresh
    );

    localStorage.removeItem(
      TOKEN_KEYS.role
    );
  };


// ======================================================
// PROVIDER
// ======================================================

export const AuthProvider = ({
  children,
}) => {

  // ====================================================
  // STATE
  // ====================================================

  const [user,
    setUser] =
    useState(null);

  const [viewRole,
    setViewRoleState] =
    useState(
      getStoredRole()
    );

  const [loading,
    setLoading] =
    useState(true);

  const [authError,
    setAuthError] =
    useState("");

  const [initialized,
    setInitialized] =
    useState(false);


  // ====================================================
  // REFS
  // ====================================================

  const mounted =
    useRef(false);

  const loadingUser =
    useRef(false);

  const refreshingToken =
    useRef(false);


  // ====================================================
  // SAFE STATE UPDATE
  // ====================================================

  const safeSetState =
    useCallback((setter, value) => {

      if (
        mounted.current
      ) {

        setter(value);
      }

    }, []);


  // ====================================================
  // SOCKET CONNECT
  // ====================================================

  const startRealtime =
    useCallback(() => {

      connectWebSocket();

    }, []);


  // ====================================================
  // SOCKET DISCONNECT
  // ====================================================

  const stopRealtime =
    useCallback(() => {

      disconnectWebSocket();

    }, []);


  // ====================================================
  // CLEANUP
  // ====================================================

  const performLogoutCleanup =
    useCallback(() => {

      clearTokens();

      stopRealtime();

      safeSetState(
        setUser,
        null
      );

      safeSetState(
        setViewRoleState,
        "user"
      );

    }, [

      stopRealtime,

      safeSetState,
    ]);


  // ====================================================
  // REFRESH TOKEN
  // ====================================================

  const refreshAccessToken =
    useCallback(async () => {

      if (
        refreshingToken.current
      ) {

        return null;
      }

      try {

        refreshingToken.current =
          true;

        const refresh =
          getRefreshToken();

        if (!refresh) {

          throw new Error(
            "Missing refresh token"
          );
        }

        const response =
          await api.post(
            "/auth/refresh/",
            {
              refresh,
            }
          );

        const newAccess =
          response.data.access;

        localStorage.setItem(
          TOKEN_KEYS.access,
          newAccess
        );

        return newAccess;

      } catch (error) {

        console.error(
          "Token refresh failed:",
          error
        );

        performLogoutCleanup();

        throw error;

      } finally {

        refreshingToken.current =
          false;
      }

    }, [performLogoutCleanup]);


  // ====================================================
  // LOAD USER
  // ====================================================

  const loadUser =
    useCallback(async () => {

      if (
        loadingUser.current
      ) {

        return;
      }

      try {

        loadingUser.current =
          true;

        safeSetState(
          setAuthError,
          ""
        );

        const token =
          getAccessToken();

        // ==============================================
        // NO TOKEN
        // ==============================================

        if (!token) {

          safeSetState(
            setUser,
            null
          );

          return;
        }

        // ==============================================
        // FETCH USER
        // ==============================================

        const response =
          await api.get(
            "/auth/me/"
          );

        const userData =
          response.data;

        safeSetState(
          setUser,
          userData
        );

        // ==============================================
        // ROLE
        // ==============================================

        const role =

          userData.role ||

          "user";

        safeSetState(
          setViewRoleState,
          role
        );

        localStorage.setItem(
          TOKEN_KEYS.role,
          role
        );

        // ==============================================
        // START REALTIME
        // ==============================================

        startRealtime();

      } catch (error) {

        console.error(
          "Load user failed:",
          error
        );

        // ==============================================
        // TRY REFRESH
        // ==============================================

        try {

          await refreshAccessToken();

          const retry =
            await api.get(
              "/auth/me/"
            );

          const retryUser =
            retry.data;

          safeSetState(
            setUser,
            retryUser
          );

          const role =

            retryUser.role ||

            "user";

          safeSetState(
            setViewRoleState,
            role
          );

          localStorage.setItem(
            TOKEN_KEYS.role,
            role
          );

          startRealtime();

        } catch {

          performLogoutCleanup();

          safeSetState(
            setAuthError,
            "Session expired"
          );
        }

      } finally {

        loadingUser.current =
          false;

        safeSetState(
          setLoading,
          false
        );

        safeSetState(
          setInitialized,
          true
        );
      }

    }, [

      refreshAccessToken,

      performLogoutCleanup,

      startRealtime,

      safeSetState,
    ]);


  // ====================================================
  // INIT
  // ====================================================

  useEffect(() => {

    mounted.current = true;

    loadUser();

    return () => {

      mounted.current =
        false;

      stopRealtime();
    };

  }, [

    loadUser,

    stopRealtime,
  ]);


  // ====================================================
  // LOGIN
  // ====================================================

  const login =
    useCallback(async (

      email,
      password

    ) => {

      try {

        safeSetState(
          setAuthError,
          ""
        );

        const response =
          await api.post(
            "/auth/login/",
            {
              email,
              password,
            }
          );

        setTokens(

          response.data.access,

          response.data.refresh
        );

        await loadUser();

        return {

          success: true,
        };

      } catch (error) {

        console.error(
          "Login failed:",
          error
        );

        safeSetState(

          setAuthError,

          error?.response?.data
            ?.detail

          ||

          "Login failed"
        );

        return {

          success: false,

          error,
        };
      }

    }, [

      loadUser,

      safeSetState,
    ]);


  // ====================================================
  // SIGNUP
  // ====================================================

  const signup =
    useCallback(async (

      email,
      password,
      name

    ) => {

      try {

        safeSetState(
          setAuthError,
          ""
        );

        await api.post(
          "/auth/signup/",
          {
            email,
            password,
            name,
            role: "user",
          }
        );

        return await login(
          email,
          password
        );

      } catch (error) {

        console.error(
          "Signup failed:",
          error
        );

        safeSetState(

          setAuthError,

          error?.response?.data
            ?.detail

          ||

          "Signup failed"
        );

        return {

          success: false,

          error,
        };
      }

    }, [

      login,

      safeSetState,
    ]);


  // ====================================================
  // LOGOUT
  // ====================================================

  const logout =
    useCallback(() => {

      performLogoutCleanup();

    }, [performLogoutCleanup]);


  // ====================================================
  // SWITCH ROLE
  // ====================================================

  const switchRole =
    useCallback((role) => {

      setViewRoleState(role);

      localStorage.setItem(
        TOKEN_KEYS.role,
        role
      );

    }, []);


  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value =
    useMemo(() => ({

      user,

      loading,

      initialized,

      authError,

      login,

      signup,

      logout,

      viewRole,

      switchRole,

      refreshUser:
        loadUser,

      isAuthenticated:
        !!user,

    }), [

      user,

      loading,

      initialized,

      authError,

      login,

      signup,

      logout,

      viewRole,

      switchRole,

      loadUser,
    ]);


  // ====================================================
  // PROVIDER
  // ====================================================

  return (

    <AuthContext.Provider
      value={value}
    >

      {children}

    </AuthContext.Provider>
  );
};


// ======================================================
// CUSTOM HOOK
// ======================================================

export const useAuth =
  () => {

    const context =
      useContext(
        AuthContext
      );

    if (!context) {

      throw new Error(

        "useAuth must be used within AuthProvider"
      );
    }

    return context;
  };