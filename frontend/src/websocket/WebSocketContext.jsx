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
// CONSTANTS
// ======================================================

const MAX_NOTIFICATIONS =
  50;

const CACHE_TIMEOUT =
  5000;


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
  // REFS
  // ====================================================

  const mounted =
    useRef(true);

  const initialized =
    useRef(false);

  const notificationCache =
    useRef(new Set());


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
  // ADD NOTIFICATION
  // ====================================================

  const addNotification =
    useCallback((notification) => {

      if (!notification) {

        return;
      }

      const cacheKey =

        `${notification.title}-${notification.message}-${notification.type}`;

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


      // ==============================================
      // NOTIFICATION OBJECT
      // ==============================================

      const newNotification = {

        id:
          crypto.randomUUID(),

        read: false,

        created_at:
          new Date(),

        type:
          notification.type ||
          "info",

        title:
          notification.title ||
          "Notification",

        message:
          notification.message ||
          "",

        ...notification,
      };


      // ==============================================
      // UPDATE STATE
      // ==============================================

      safeSetState(

        setNotifications,

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

      }, CACHE_TIMEOUT);

    }, [safeSetState]);


  // ====================================================
  // MARK ALL READ
  // ====================================================

  const markAllRead =
    useCallback(() => {

      safeSetState(

        setNotifications,

        (prev) =>

          prev.map((item) => ({
            ...item,
            read: true,
          }))
      );

    }, [safeSetState]);


  // ====================================================
  // CLEAR NOTIFICATIONS
  // ====================================================

  const clearNotifications =
    useCallback(() => {

      safeSetState(
        setNotifications,
        []
      );

    }, [safeSetState]);


  // ====================================================
  // HANDLE EVENTS
  // ====================================================

  const handleEvent =
    useCallback((event) => {

      if (!event) {

        return;
      }

      // ==============================================
      // SAVE LAST MESSAGE
      // ==============================================

      safeSetState(
        setLastMessage,
        event
      );


      // ==============================================
      // EVENT TYPES
      // ==============================================

      switch (event.type) {

        // ============================================
        // CONNECTED
        // ============================================

        case "connected":

          safeSetState(
            setConnected,
            true
          );

          safeSetState(
            setReconnecting,
            false
          );

          safeSetState(
            setConnectionError,
            null
          );

          break;


        // ============================================
        // DISCONNECTED
        // ============================================

        case "disconnected":

          safeSetState(
            setConnected,
            false
          );

          break;


        // ============================================
        // RECONNECTING
        // ============================================

        case "reconnecting":

          safeSetState(
            setReconnecting,
            true
          );

          break;


        // ============================================
        // CONNECTION ERROR
        // ============================================

        case "connection_error":

          safeSetState(
            setConnected,
            false
          );

          safeSetState(
            setConnectionError,
            event.error
          );

          break;


        // ============================================
        // SLOT UPDATE
        // ============================================

        case "slots_update":

          safeSetState(
            setSlots,
            event.payload || []
          );

          break;


        // ============================================
        // BOOKING UPDATE
        // ============================================

        case "booking_update":

          safeSetState(
            setBookings,
            event.payload || []
          );

          break;


        // ============================================
        // PAYMENT UPDATE
        // ============================================

        case "payment_update":

          safeSetState(
            setPayments,
            event.payload || []
          );

          break;


        // ============================================
        // ANALYTICS UPDATE
        // ============================================

        case "analytics_update":

          safeSetState(
            setAnalytics,
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

          safeSetState(
            setConnected,
            false
          );

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

          safeSetState(
            setConnected,
            false
          );

          safeSetState(
            setReconnecting,
            false
          );

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


        // ============================================
        // DEFAULT
        // ============================================

        default:

          break;
      }

    }, [

      addNotification,

      safeSetState,
    ]);


  // ====================================================
  // INITIALIZE SOCKET
  // ====================================================

  useEffect(() => {

    mounted.current = true;

    // ==============================================
    // PREVENT DUPLICATE INIT
    // ==============================================

    if (
      initialized.current
    ) {

      return;
    }

    initialized.current =
      true;


    // ==============================================
    // CONNECT
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

    safeSetState(
      setConnected,
      status.connected
    );


    // ==============================================
    // CLEANUP
    // ==============================================

    return () => {

      mounted.current =
        false;

      unsubscribe?.();

      disconnectWebSocket();

      safeSetState(
        setConnected,
        false
      );
    };

  }, [

    handleEvent,

    safeSetState,
  ]);


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


      // ACTIONS

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
// CUSTOM HOOK
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