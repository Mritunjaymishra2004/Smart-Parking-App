import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../api/axios";


// ======================================================
// TOKEN HELPERS
// ======================================================

const TOKEN_KEYS = {
  access: "access",
  refresh: "refresh",
};

const AuthContext =
  createContext(null);


// ======================================================
// PROVIDER
// ======================================================

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [initialized, setInitialized] =
    useState(false);


  // APPLY TOKEN
  const applyToken =
    useCallback((token) => {
      if (token) {
        api.defaults.headers.common.Authorization =
          `Bearer ${token}`;
      } else {
        delete api.defaults.headers.common.Authorization;
      }
    }, []);


  // CLEAR
  const clearAuth =
    useCallback(() => {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      applyToken(null);
      setUser(null);
    }, [applyToken]);


  // LOAD USER
  const loadUser =
    useCallback(async () => {
      try {
        const token =
          localStorage.getItem(
            TOKEN_KEYS.access
          );

        if (!token) {
          setLoading(false);
          setInitialized(true);
          return;
        }

        applyToken(token);

        const res =
          await api.get(
            "/auth/me/"
          );

        setUser(res.data);

      } catch {
        clearAuth();

      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }, [
      applyToken,
      clearAuth,
    ]);


  useEffect(() => {
    loadUser();
  }, [loadUser]);


  // ======================================================
  // LOGIN
  // ======================================================

  const login =
    useCallback(async (
      email,
      password
    ) => {
      const res =
        await api.post(
          "/auth/login/",
          {
            email,
            password,
          }
        );

      const {
        access,
        refresh,
        user,
      } = res.data;

      localStorage.setItem(
        "access",
        access
      );

      localStorage.setItem(
        "refresh",
        refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      applyToken(access);

      setUser(user);

      return user;
    }, [applyToken]);


  // SIGNUP
  const signup =
    useCallback(async (
      email,
      password,
      name,
      role = "user"
    ) => {
      await api.post(
        "/auth/signup/",
        {
          email,
          password,
          name,
          role,
        }
      );

      return await login(
        email,
        password
      );
    }, [login]);


  // LOGOUT
  const logout =
    useCallback(() => {
      clearAuth();
      window.location.href =
        "/login";
    }, [clearAuth]);


  const value =
    useMemo(() => ({
      user,
      setUser,
      loading,
      initialized,

      login,
      signup,
      logout,
      loadUser,

      isAuthenticated:
        !!user,

      isAdmin:
        user?.role ===
        "admin",
    }), [
      user,
      loading,
      initialized,
      login,
      signup,
      logout,
      loadUser,
    ]);


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ======================================================
// HOOK
// ======================================================

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}