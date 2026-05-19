import {

  createContext,

  useContext,

  useEffect,

  useMemo,

  useState,

  useCallback,

  useRef,

} from "react";

import {

  connectWebSocket,

  disconnectWebSocket,

  subscribe,

  getConnectionStatus,

} from "./websocketService";


// ======================================================
// CONTEXT
// ======================================================

const WebSocketContext =
  createContext(null);


// ======================================================
// MAX NOTIFICATIONS
// ======================================================

const MAX_NOTIFICATIONS =
  50;


// ======================================================
// PROVIDER
// ======================================================

export function WebSocketProvider({

  children,

}) {

  // ====================================================
  // CONNECTION STATE
  // ====================================================

  const [connected,
    setConnected] =
    useState(false);

  const [reconnecting,
    setReconnecting] =
    useState(false);

  const [connectionError,
    setConnectionError] =
    useState(null);


  // ====================================================
  // REALTIME DATA
  // ====================================================

  const [slots,
    setSlots] =
    useState([]);

  const [bookings,
    setBookings] =
    useState([]);

  const [payments,
    setPayments] =
    useState([]);

  const [analytics,
    setAnalytics] =
    useState({});

  const [notifications,
    setNotifications] =
    useState([]);

  const [lastMessage,
    setLastMessage] =
    useState(null);


  // ====================================================
  // DUPLICATE PREVENTION
  // ====================================================

  const notificationCache =
    useRef(new Set());


  // ====================================================
  // ADD NOTIFICATION
  // ====================================================

  const addNotification =
    useCallback((notification) => {

      const cacheKey =

        `${notification.title}-${notification.message}`;

      // ==============================================
      // PREVENT DUPLICATES
      // ==============================================

      if (

        notificationCache.current.has(
          cacheKey
        )

      ) {

        return;
      }

      notificationCache.current.add(
        cacheKey
      );

      const newNotification = {

        id:
          Date.now() +
          Math.random(),

        read: false,

        created_at:
          new Date(),

        type:
          notification.type ||
          "info",

        ...notification,
      };

      setNotifications(
        (prev) => [

          newNotification,

          ...prev,
        ].slice(
          0,
          MAX_NOTIFICATIONS
        )
      );

      // ==============================================
      // CLEAN CACHE
      // ==============================================

      setTimeout(() => {

        notificationCache.current.delete(
          cacheKey
        );

      }, 5000);

    }, []);


  // ====================================================
  // MARK ALL READ
  // ====================================================

  const markAllRead =
    useCallback(() => {

      setNotifications(
        (prev) =>

          prev.map((item) => ({
            ...item,
            read: true,
          }))
      );

    }, []);


  // ====================================================
  // CLEAR NOTIFICATIONS
  // ====================================================

  const clearNotifications =
    useCallback(() => {

      setNotifications([]);

    }, []);


  // ====================================================
  // HANDLE EVENTS
  // ====================================================

  const handleEvent =
    useCallback((event) => {

      // ==============================================
      // SAVE LAST MESSAGE
      // ==============================================

      setLastMessage(event);

      // ==============================================
      // EVENT TYPES
      // ==============================================

      switch (event.type) {

        // ============================================
        // CONNECTED
        // ============================================

        case "connected":

          setConnected(true);

          setReconnecting(false);

          setConnectionError(null);

          break;


        // ============================================
        // DISCONNECTED
        // ============================================

        case "disconnected":

          setConnected(false);

          break;


        // ============================================
        // RECONNECTING
        // ============================================

        case "reconnecting":

          setReconnecting(true);

          break;


        // ============================================
        // CONNECTION ERROR
        // ============================================

        case "connection_error":

          setConnected(false);

          setConnectionError(
            event.error
          );

          break;


        // ============================================
        // SLOT UPDATE
        // ============================================

        case "slots_update":

          setSlots(
            event.payload || []
          );

          break;


        // ============================================
        // BOOKING UPDATE
        // ============================================

        case "booking_update":

          setBookings(
            event.payload || []
          );

          break;


        // ============================================
        // PAYMENT UPDATE
        // ============================================

        case "payment_update":

          setPayments(
            event.payload || []
          );

          break;


        // ============================================
        // ANALYTICS UPDATE
        // ============================================

        case "analytics_update":

          setAnalytics(
            event.payload || {}
          );

          break;


        // ============================================
        // NOTIFICATION
        // ============================================

        case "notification":

          addNotification(
            event.payload
          );

          break;


        // ============================================
        // SESSION EXPIRED
        // ============================================

        case "session_expired":

          setConnected(false);

          addNotification({

            title:
              "Session Expired",

            message:
              "Please login again.",

            type:
              "warning",
          });

          break;


        // ============================================
        // RECONNECT FAILED
        // ============================================

        case "reconnect_failed":

          setConnected(false);

          setReconnecting(false);

          addNotification({

            title:
              "Connection Lost",

            message:
              "Realtime server unavailable.",

            type:
              "error",
          });

          break;


        // ============================================
        // HEARTBEAT
        // ============================================

        case "heartbeat":

          break;


        default:

          break;
      }

    }, [addNotification]);


  // ====================================================
  // CONNECT
  // ====================================================

  useEffect(() => {

    // ==============================================
    // START ENGINE
    // ==============================================

    connectWebSocket();

    // ==============================================
    // SUBSCRIBE
    // ==============================================

    const unsubscribe =
      subscribe(handleEvent);

    // ==============================================
    // INITIAL STATUS
    // ==============================================

    const status =
      getConnectionStatus();

    setConnected(
      status.connected
    );

    // ==============================================
    // CLEANUP
    // ==============================================

    return () => {

      unsubscribe();

      disconnectWebSocket();

      setConnected(false);
    };

  }, [handleEvent]);


  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value =
    useMemo(() => ({

      // CONNECTION

      connected,

      reconnecting,

      connectionError,

      // REALTIME DATA

      slots,

      bookings,

      payments,

      analytics,

      notifications,

      lastMessage,

      // NOTIFICATIONS

      addNotification,

      markAllRead,

      clearNotifications,

    }), [

      connected,

      reconnecting,

      connectionError,

      slots,

      bookings,

      payments,

      analytics,

      notifications,

      lastMessage,

      addNotification,

      markAllRead,

      clearNotifications,
    ]);


  // ====================================================
  // PROVIDER
  // ====================================================

  return (

    <WebSocketContext.Provider
      value={value}
    >

      {children}

    </WebSocketContext.Provider>
  );
}


// ======================================================
// HOOK
// ======================================================

export const useWebSocket =
  () => {

    const context =
      useContext(
        WebSocketContext
      );

    if (!context) {

      throw new Error(

        "useWebSocket must be used within WebSocketProvider"
      );
    }

    return context;
  };