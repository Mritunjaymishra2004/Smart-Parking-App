import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import api from "../api/axios";

import {
  connectSocket,
  disconnectSocket,
} from "../utils/socket";

// ======================================================
// CONTEXT
// ======================================================

const AuthContext = createContext();

// ======================================================
// PROVIDER
// ======================================================

export const AuthProvider = ({
  children,
}) => {

  // ====================================================
  // STATE
  // ====================================================

  const [user, setUser] =
    useState(null);

  const [viewRole, setViewRole] =
    useState("user");

  const [loading, setLoading] =
    useState(true);

  // ====================================================
  // REFS
  // ====================================================

  const initialized =
    useRef(false);

  const socketConnected =
    useRef(false);

  // ====================================================
  // SOCKET HELPERS
  // ====================================================

  const safeConnectSocket = () => {

    if (!socketConnected.current) {

      connectSocket();

      socketConnected.current = true;
    }
  };

  const safeDisconnectSocket = () => {

    if (socketConnected.current) {

      disconnectSocket();

      socketConnected.current = false;
    }
  };

  // ====================================================
  // TOKEN HELPERS
  // ====================================================

  const clearAuthData = () => {

    localStorage.removeItem("access");

    localStorage.removeItem("refresh");
  };

  // ====================================================
  // LOGOUT
  // ====================================================

  const logout = () => {

    clearAuthData();

    safeDisconnectSocket();

    setUser(null);

    setViewRole("user");
  };

  // ====================================================
  // LOAD USER
  // ====================================================

  useEffect(() => {

    if (initialized.current) return;

    initialized.current = true;

    let mounted = true;

    const loadUser = async () => {

      const token =
        localStorage.getItem("access");

      // ================================================
      // NO TOKEN
      // ================================================

      if (!token) {

        if (mounted) {

          setUser(null);

          setLoading(false);
        }

        return;
      }

      try {

        const res =
          await api.get("/auth/me/");

        // ==============================================
        // COMPONENT STILL ACTIVE
        // ==============================================

        if (mounted) {

          setUser(res.data);

          setViewRole(
            res.data.role || "user"
          );

          safeConnectSocket();
        }

      } catch (err) {

        console.error(
          "User load failed:",
          err?.response?.data || err.message
        );

        clearAuthData();

        safeDisconnectSocket();

        if (mounted) {

          setUser(null);
        }

      } finally {

        if (mounted) {

          setLoading(false);
        }
      }
    };

    loadUser();

    // ================================================
    // CLEANUP
    // ================================================

    return () => {

      mounted = false;

      safeDisconnectSocket();
    };

  }, []);

  // ====================================================
  // LOGIN
  // ====================================================

  const login = async (
    email,
    password
  ) => {

    try {

      const res =
        await api.post(
          "/auth/login/",
          {
            email,
            password,
          }
        );

      // ==============================================
      // STORE TOKENS
      // ==============================================

      localStorage.setItem(
        "access",
        res.data.access
      );

      localStorage.setItem(
        "refresh",
        res.data.refresh
      );

      // ==============================================
      // LOAD USER
      // ==============================================

      const me =
        await api.get("/auth/me/");

      setUser(me.data);

      setViewRole(
        me.data.role || "user"
      );

      safeConnectSocket();

      return me.data;

    } catch (err) {

      console.error(
        "Login failed:",
        err?.response?.data || err.message
      );

      throw (
        err?.response?.data || {
          detail: "Login failed",
        }
      );
    }
  };

  // ====================================================
  // SIGNUP
  // ====================================================

  const signup = async (
    email,
    password,
    name
  ) => {

    try {

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

    } catch (err) {

      console.error(
        "Signup failed:",
        err?.response?.data || err.message
      );

      throw (
        err?.response?.data || {
          detail: "Signup failed",
        }
      );
    }
  };

  // ====================================================
  // SWITCH ROLE
  // ====================================================

  const switchRole = (
    role
  ) => {

    setViewRole(role);
  };

  // ====================================================
  // MEMOIZED VALUE
  // ====================================================

  const value = useMemo(() => ({
    user,

    login,

    signup,

    logout,

    loading,

    viewRole,

    switchRole,

    isAuthenticated: !!user,
  }), [
    user,
    loading,
    viewRole,
  ]);

  // ====================================================
  // PROVIDER
  // ====================================================

  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>
  );
};

// ======================================================
// HOOK
// ======================================================

export const useAuth = () => {

  return useContext(AuthContext);
};












// import { createContext, useContext, useEffect, useRef, useState } from "react";
// import api from "../services/api";
// import { connectSocket, disconnectSocket } from "../utils/socket";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [viewRole, setViewRole] = useState("user");
//   const [loading, setLoading] = useState(true);

//   const initialized = useRef(false);
//   const socketConnected = useRef(false);

//   // ===============================
//   // 🔹 SAFE SOCKET CONNECT
//   // ===============================
//   const safeConnectSocket = () => {
//     if (!socketConnected.current) {
//       connectSocket();
//       socketConnected.current = true;
//     }
//   };

//   const safeDisconnectSocket = () => {
//     if (socketConnected.current) {
//       disconnectSocket();
//       socketConnected.current = false;
//     }
//   };

//   // ===============================
//   // 🔹 LOAD USER
//   // ===============================
//   useEffect(() => {
//     if (initialized.current) return;
//     initialized.current = true;

//     const loadUser = async () => {
//       const token = localStorage.getItem("access");

//       if (!token) {
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await api.get("/auth/me/");
//         setUser(res.data);
//         setViewRole(res.data.role || "user");
//         safeConnectSocket();
//       } catch (err) {
//         console.error("Auth error");
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//         safeDisconnectSocket();
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();

//     // ✅ CLEANUP
//     return () => {
//       safeDisconnectSocket();
//     };
//   }, []);

//   // ===============================
//   // 🔹 LOGIN
//   // ===============================
//   const login = async (email, password) => {
//     try {
//       const res = await api.post("/auth/login/", {
//         email,
//         password,
//       });

//       localStorage.setItem("access", res.data.access);
//       localStorage.setItem("refresh", res.data.refresh);

//       const me = await api.get("/auth/me/");
//       setUser(me.data);
//       setViewRole(me.data.role || "user");
//       safeConnectSocket();

//       return me.data;
//     } catch (err) {
//       console.error("Login failed");
//       throw err.response?.data || err;
//     }
//   };

//   // ===============================
//   // 🔹 SIGNUP
//   // ===============================
//   const signup = async (email, password, name) => {
//     try {
//       await api.post("/auth/signup/", {
//         email,
//         password,
//         name,
//         role: "user",
//       });

//       return await login(email, password);
//     } catch (err) {
//       console.error("Signup failed");
//       throw err.response?.data || err;
//     }
//   };

//   // ===============================
//   // 🔹 LOGOUT
//   // ===============================
//   const logout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     safeDisconnectSocket();
//     setUser(null);
//     setViewRole("user");
//   };

//   // ===============================
//   // 🔹 SWITCH ROLE
//   // ===============================
//   const switchRole = (role) => {
//     setViewRole(role);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         signup,
//         logout,
//         viewRole,
//         switchRole,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);