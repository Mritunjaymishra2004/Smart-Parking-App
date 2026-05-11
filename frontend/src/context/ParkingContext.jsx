import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

import {
  useAuth,
} from "./AuthContext";

import {
  useWebSocket,
} from "../websocket/WebSocketContext";

// ======================================================
// CONTEXT
// ======================================================

const ParkingContext =
  createContext(null);

// ======================================================
// PROVIDER
// ======================================================

export function ParkingProvider({
  children,
}) {

  // ====================================================
  // STATE
  // ====================================================

  const [session, setSession] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [initialized, setInitialized] =
    useState(false);

  // ====================================================
  // HOOKS
  // ====================================================

  const navigate =
    useNavigate();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    lastMessage,
  } = useWebSocket();

  // ====================================================
  // REFS
  // ====================================================

  const sessionLoaded =
    useRef(false);

  const previousUserId =
    useRef(null);

  // ====================================================
  // LOAD ACTIVE SESSION
  // ====================================================

  const loadSession =
    useCallback(async () => {

      try {

        setLoading(true);

        const response =
          await api.get(
            "/parking/active/"
          );

        const data =
          response.data;

        setSession(

          data &&
          Object.keys(data).length
            ? data
            : null
        );

      } catch (error) {

        console.warn(
          "No active session"
        );

        // ==============================================
        // AUTH EXPIRED
        // ==============================================

        if (
          error.response?.status === 401
        ) {

          localStorage.removeItem(
            "access"
          );

          localStorage.removeItem(
            "refresh"
          );
        }

        setSession(null);

      } finally {

        setLoading(false);

        setInitialized(true);
      }

    }, []);

  // ====================================================
  // INITIAL SESSION LOAD
  // ====================================================

  useEffect(() => {

    if (authLoading) return;

    // ================================================
    // USER LOGGED OUT
    // ================================================

    if (!user) {

      sessionLoaded.current =
        false;

      previousUserId.current =
        null;

      setSession(null);

      setInitialized(true);

      return;
    }

    // ================================================
    // PREVENT DUPLICATE LOAD
    // ================================================

    if (
      sessionLoaded.current &&

      previousUserId.current ===
      user.id
    ) {

      return;
    }

    sessionLoaded.current =
      true;

    previousUserId.current =
      user.id;

    loadSession();

  }, [
    user,
    authLoading,
    loadSession,
  ]);

  // ====================================================
  // WEBSOCKET LIVE SESSION UPDATES
  // ====================================================

  useEffect(() => {

    if (!lastMessage) return;

    // ================================================
    // SESSION UPDATE
    // ================================================

    if (
      lastMessage.type ===
      "session_update"
    ) {

      setSession(
        lastMessage.session
      );
    }

    // ================================================
    // SESSION ENDED
    // ================================================

    if (
      lastMessage.type ===
      "session_ended"
    ) {

      setSession(null);
    }

  }, [lastMessage]);

  // ====================================================
  // START PARKING
  // ====================================================

  const startParking =
    async (
      slot,
      vehicle
    ) => {

      if (loading) return;

      try {

        setLoading(true);

        const response =
          await api.post(
            "/parking/start/",
            {
              slot_id:
                slot.id,

              vehicle_id:
                vehicle.id,
            }
          );

        const data =
          response.data;

        // ==============================================
        // UPDATE SESSION
        // ==============================================

        setSession(data);

        // ==============================================
        // NAVIGATE
        // ==============================================

        navigate(
          "/navigate",
          {
            state: {
              slot,
              vehicle,
            },
          }
        );

      } catch (error) {

        console.error(
          "Start parking failed",
          error
        );

        alert(

          error?.response?.data
            ?.message ||

          "Unable to start parking"
        );

      } finally {

        setLoading(false);
      }
    };

  // ====================================================
  // STOP PARKING
  // ====================================================

  const stopParking =
    async () => {

      if (loading) return;

      try {

        setLoading(true);

        const response =
          await api.post(
            "/parking/stop/"
          );

        const data =
          response.data;

        // ==============================================
        // CLEAR SESSION
        // ==============================================

        setSession(null);

        // ==============================================
        // GO TO PAYMENT
        // ==============================================

        navigate(
          `/payment?booking_id=${data.booking_id}`
        );

      } catch (error) {

        console.error(
          "Stop parking failed",
          error
        );

        alert(

          error?.response?.data
            ?.message ||

          "Failed to stop parking"
        );

      } finally {

        setLoading(false);
      }
    };

  // ====================================================
  // REFRESH SESSION
  // ====================================================

  const refreshSession =
    async () => {

      try {

        const response =
          await api.get(
            "/parking/active/"
          );

        setSession(

          response.data || null
        );

      } catch {

        setSession(null);
      }
    };

  // ====================================================
  // CLEAR SESSION
  // ====================================================

  const clearSession =
    () => {

      setSession(null);
    };

  // ====================================================
  // MEMOIZED VALUE
  // ====================================================

  const value =
    useMemo(() => ({

      session,

      loading,

      initialized,

      startParking,

      stopParking,

      refreshSession,

      clearSession,

      hasActiveSession:
        !!session,

    }), [
      session,
      loading,
      initialized,
    ]);

  // ====================================================
  // INITIAL LOADING
  // ====================================================

  if (!initialized) {

    return null;
  }

  // ====================================================
  // PROVIDER
  // ====================================================

  return (

    <ParkingContext.Provider
      value={value}
    >

      {children}

    </ParkingContext.Provider>
  );
}

// ======================================================
// HOOK
// ======================================================

export const useParking = () => {

  const context =
    useContext(
      ParkingContext
    );

  if (!context) {

    throw new Error(
      "useParking must be used inside ParkingProvider"
    );
  }

  return context;
};
















// import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
// import api from "../services/api";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// const ParkingContext = createContext(null);

// export function ParkingProvider({ children }) {
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [initialized, setInitialized] = useState(false);

//   const navigate = useNavigate();
//   const { user, loading: authLoading } = useAuth();
//   const sessionLoaded = useRef(false);
//   const previousUserId = useRef(null);

//   const loadSession = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/parking/active/");
//       setSession(res.data && Object.keys(res.data).length > 0 ? res.data : null);
//     } catch (err) {
//       console.warn("No active session or expired");
//       if (err.response?.status === 401) {
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");
//       }
//       setSession(null);
//     } finally {
//       setLoading(false);
//       setInitialized(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       sessionLoaded.current = false;
//       previousUserId.current = null;
//       setSession(null);
//       setInitialized(true);
//       return;
//     }

//     if (sessionLoaded.current && previousUserId.current === user.id) {
//       return;
//     }

//     sessionLoaded.current = true;
//     previousUserId.current = user.id;
//     loadSession();
//   }, [user, authLoading, loadSession]);

//   const startParking = async (slot, vehicle) => {
//     if (loading) return;
//     try {
//       setLoading(true);
//       const res = await api.post("/parking/start/", {
//         slot_id: slot.id,
//         vehicle_id: vehicle.id,
//       });
//       setSession(res.data);
//       navigate("/navigate", { state: { slot, vehicle } });
//     } catch (err) {
//       console.error("Start parking failed:", err);
//       alert(err?.response?.data?.message || "Unable to start parking. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const stopParking = async () => {
//     if (loading) return;
//     try {
//       setLoading(true);
//       const res = await api.post("/parking/stop/");
//       setSession(null);
//       navigate(`/payment?booking_id=${res.data.booking_id}`);
//     } catch (err) {
//       console.error("Stop parking failed:", err);
//       alert(err?.response?.data?.message || "Failed to stop parking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshSession = async () => {
//     try {
//       const res = await api.get("/parking/active/");
//       setSession(res.data || null);
//     } catch {
//       setSession(null);
//     }
//   };

//   const clearSession = () => setSession(null);

//   if (!initialized) {
//     return null;
//   }

//   return (
//     <ParkingContext.Provider
//       value={{
//         session,
//         startParking,
//         stopParking,
//         refreshSession,
//         clearSession,
//         loading,
//       }}
//     >
//       {children}
//     </ParkingContext.Provider>
//   );
// }

// export const useParking = () => {
//   const context = useContext(ParkingContext);
//   if (!context) {
//     throw new Error("useParking must be used inside ParkingProvider");
//   }
//   return context;
// };

