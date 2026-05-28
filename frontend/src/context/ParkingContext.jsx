import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

import api from "../api/axios";

import { useAuth } from "./AuthContext";
import { useWebSocket } from "./WebSocketContext";

import Loader from "../shared/ui/Loader";


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
  const [session, setSession] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [initialized, setInitialized] =
    useState(false);

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    messages = [],
  } = useWebSocket();

  const sessionLoaded =
    useRef(false);

  const previousUserId =
    useRef(null);


  // ====================================================
  // NORMALIZE SESSION
  // ====================================================

  const normalizeSession =
    useCallback((data) => {
      if (
        !data ||
        Object.keys(data).length === 0
      ) {
        return null;
      }

      return data;
    }, []);


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

        setSession(
          normalizeSession(
            response.data
          )
        );

      } catch (error) {
        console.error(
          "Session load failed:",
          error
        );

        setSession(null);

      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }, [
      normalizeSession
    ]);


  // ====================================================
  // AUTH INIT
  // ====================================================

  useEffect(() => {
    if (authLoading)
      return;

    if (!user) {
      sessionLoaded.current =
        false;

      previousUserId.current =
        null;

      setSession(null);
      setInitialized(true);

      return;
    }

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
  // LIVE WEBSOCKET UPDATE
  // ====================================================

  useEffect(() => {
    if (!messages.length)
      return;

    const latest =
      messages[
        messages.length - 1
      ];

    if (!latest?.type)
      return;

    switch (latest.type) {
      case "session_update":
        setSession(
          normalizeSession(
            latest.payload ||
            latest.session
          )
        );
        break;

      case "session_ended":
        setSession(null);
        break;

      default:
        break;
    }

  }, [
    messages,
    normalizeSession,
  ]);


  // ====================================================
  // START PARKING
  // ====================================================

  const startParking =
    useCallback(async (
      slot,
      vehicle
    ) => {
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

        const newSession =
          normalizeSession(
            response.data
          );

        setSession(
          newSession
        );

        return {
          success: true,
          data: newSession,
        };

      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.detail ||
            "Failed to start parking",
        };

      } finally {
        setLoading(false);
      }
    }, [
      normalizeSession
    ]);


  // ====================================================
  // STOP PARKING
  // ====================================================

  const stopParking =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await api.post(
            "/parking/stop/"
          );

        setSession(null);

        return {
          success: true,
          bookingId:
            response.data?.booking_id,
        };

      } catch (error) {
        return {
          success: false,
          error:
            error.response?.data?.detail ||
            "Failed to stop parking",
        };

      } finally {
        setLoading(false);
      }
    }, []);


  // ====================================================
  // HELPERS
  // ====================================================

  const refreshSession =
    useCallback(() => {
      return loadSession();
    }, [loadSession]);

  const clearSession =
    useCallback(() => {
      setSession(null);
    }, []);


  // ====================================================
  // VALUE
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
      startParking,
      stopParking,
      refreshSession,
      clearSession,
    ]);


  // ====================================================
  // INIT LOADER
  // ====================================================

  if (!initialized) {
    return (
      <Loader
        text="Initializing Parking System..."
      />
    );
  }


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

export function useParking() {
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
}