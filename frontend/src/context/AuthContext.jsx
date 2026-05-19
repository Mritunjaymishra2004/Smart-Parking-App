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

  connectSocket,

  disconnectSocket,

} from "../utils/socket";


// ======================================================
// CONTEXT
// ======================================================

const AuthContext =
  createContext(null);


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
    setViewRole] =
    useState("user");

  const [loading,
    setLoading] =
    useState(true);

  const [authError,
    setAuthError] =
    useState("");


  // ====================================================
  // REFS
  // ====================================================

  const initialized =
    useRef(false);

  const mounted =
    useRef(true);

  const socketConnected =
    useRef(false);


  // ====================================================
  // SOCKET HELPERS
  // ====================================================

  const safeConnectSocket =
    useCallback(() => {

      if (
        socketConnected.current
      ) {

        return;
      }

      connectSocket();

      socketConnected.current =
        true;

    }, []);


  const safeDisconnectSocket =
    useCallback(() => {

      if (
        !socketConnected.current
      ) {

        return;
      }

      disconnectSocket();

      socketConnected.current =
        false;

    }, []);


  // ====================================================
  // TOKEN HELPERS
  // ====================================================

  const getAccessToken =
    () => {

      return localStorage.getItem(
        "access"
      );
    };


  const getRefreshToken =
    () => {

      return localStorage.getItem(
        "refresh"
      );
    };


  const setTokens =
    (
      access,
      refresh
    ) => {

      localStorage.setItem(
        "access",
        access
      );

      localStorage.setItem(
        "refresh",
        refresh
      );
    };


  const clearAuthData =
    () => {

      localStorage.removeItem(
        "access"
      );

      localStorage.removeItem(
        "refresh"
      );
    };


  // ====================================================
  // LOGOUT CLEANUP
  // ====================================================

  const performLogoutCleanup =
    useCallback(() => {

      clearAuthData();

      safeDisconnectSocket();

      if (mounted.current) {

        setUser(null);

        setViewRole("user");

      }

    }, [safeDisconnectSocket]);


  // ====================================================
  // REFRESH TOKEN
  // ====================================================

  const refreshAccessToken =
    useCallback(async () => {

      try {

        const refresh =
          getRefreshToken();

        if (!refresh) {

          throw new Error(
            "No refresh token"
          );
        }

        const response =
          await api.post(
            "/auth/refresh/",
            {
              refresh,
            }
          );

        localStorage.setItem(

          "access",

          response.data.access
        );

        return response.data.access;

      } catch (error) {

        console.error(
          "Token refresh failed:",
          error
        );

        performLogoutCleanup();

        throw error;
      }

    }, [performLogoutCleanup]);


  // ====================================================
  // LOAD USER
  // ====================================================

  const loadUser =
    useCallback(async () => {

      try {

        setAuthError("");

        const token =
          getAccessToken();

        if (!token) {

          if (mounted.current) {

            setUser(null);

            setLoading(false);
          }

          return;
        }

        const response =
          await api.get(
            "/auth/me/"
          );

        if (!mounted.current) {

          return;
        }

        setUser(
          response.data
        );

        setViewRole(

          response.data.role ||

          "user"
        );

        safeConnectSocket();

      } catch (error) {

        console.error(
          "Load user failed:",
          error
        );

        // ==========================================
        // TRY REFRESH TOKEN
        // ==========================================

        try {

          await refreshAccessToken();

          const retryResponse =
            await api.get(
              "/auth/me/"
            );

          if (!mounted.current) {

            return;
          }

          setUser(
            retryResponse.data
          );

          setViewRole(

            retryResponse.data.role ||

            "user"
          );

          safeConnectSocket();

        } catch {

          performLogoutCleanup();

          if (mounted.current) {

            setAuthError(
              "Session expired"
            );
          }
        }

      } finally {

        if (mounted.current) {

          setLoading(false);
        }
      }

    }, [

      refreshAccessToken,

      safeConnectSocket,

      performLogoutCleanup,
    ]);


  // ====================================================
  // INITIALIZE
  // ====================================================

  useEffect(() => {

    mounted.current = true;

    if (
      initialized.current
    ) {

      return;
    }

    initialized.current =
      true;

    loadUser();

    return () => {

      mounted.current =
        false;

      safeDisconnectSocket();
    };

  }, [

    loadUser,

    safeDisconnectSocket,
  ]);


  // ====================================================
  // LOGIN
  // ====================================================

  const login =
    async (
      email,
      password
    ) => {

      try {

        setAuthError("");

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

        if (mounted.current) {

          setAuthError(

            error?.response?.data
              ?.detail

            ||

            "Login failed"
          );
        }

        return {

          success: false,

          error,
        };
      }
    };


  // ====================================================
  // SIGNUP
  // ====================================================

  const signup =
    async (
      email,
      password,
      name
    ) => {

      try {

        setAuthError("");

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

        if (mounted.current) {

          setAuthError(

            error?.response?.data
              ?.detail

            ||

            "Signup failed"
          );
        }

        return {

          success: false,

          error,
        };
      }
    };


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

      setViewRole(role);

    }, []);


  // ====================================================
  // VALUE
  // ====================================================

  const value =
    useMemo(() => ({

      user,

      loading,

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
// HOOK
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