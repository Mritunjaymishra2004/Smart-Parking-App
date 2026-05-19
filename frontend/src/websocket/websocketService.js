// =====================================================
// ENV CONFIG
// =====================================================

const API_BASE_URL =

  import.meta.env
    .VITE_API_BASE_URL

  ||

  "http://127.0.0.1:8000/api/v1";


// =====================================================
// CONFIG
// =====================================================

const POLLING_INTERVAL =
  5000;

const HEARTBEAT_INTERVAL =
  30000;

const MAX_RETRIES =
  10;

const MAX_BACKOFF =
  30000;


// =====================================================
// INTERNAL STATE
// =====================================================

let pollingInterval = null;

let heartbeatInterval = null;

let reconnectTimeout = null;

let reconnectAttempts = 0;

let isConnected = false;

let listeners = [];

let isPolling = false;

let lastHeartbeat =
  Date.now();

let authWarningShown =
  false;


// =====================================================
// EMIT EVENT
// =====================================================

const emit =
  (event) => {

    listeners.forEach(
      (listener) => {

        try {

          listener(event);

        } catch (error) {

          console.error(
            "Listener error:",
            error
          );
        }
      }
    );
  };


// =====================================================
// SUBSCRIBE
// =====================================================

export const subscribe =
  (callback) => {

    listeners.push(callback);

    return () => {

      listeners =
        listeners.filter(
          (listener) =>

            listener !== callback
        );
    };
  };


// =====================================================
// TOKEN
// =====================================================

const getToken =
  () => {

    return localStorage.getItem(
      "access"
    );
  };


// =====================================================
// AUTH
// =====================================================

const isAuthenticated =
  () => {

    return !!getToken();
  };


// =====================================================
// CONNECTION STATE
// =====================================================

const setConnectionState =
  (state) => {

    isConnected = state;

    emit({

      type:

        state

          ? "connected"

          : "disconnected",
    });
  };


// =====================================================
// FETCH ENDPOINT
// =====================================================

const fetchEndpoint =
  async (
    endpoint,
    eventType
  ) => {

    try {

      const response =
        await fetch(

          `${API_BASE_URL}${endpoint}`,

          {

            method: "GET",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${getToken()}`,
            },
          }
        );

      // ==============================================
      // TOKEN EXPIRED
      // ==============================================

      if (

        response.status === 401

      ) {

        localStorage.removeItem(
          "access"
        );

        localStorage.removeItem(
          "refresh"
        );

        disconnectWebSocket();

        emit({

          type:
            "session_expired",
        });

        return null;
      }

      // ==============================================
      // OTHER ERRORS
      // ==============================================

      if (!response.ok) {

        throw new Error(
          `${eventType} failed`
        );
      }

      return await response.json();

    } catch (error) {

      console.error(
        `${eventType} error:`,
        error
      );

      throw error;
    }
  };


// =====================================================
// FETCH REALTIME DATA
// =====================================================

const fetchRealtimeData =
  async () => {

    if (

      isPolling ||

      !isAuthenticated()

    ) {

      return;
    }

    try {

      isPolling = true;

      const [

        slots,

        bookings,

        payments,

        analytics,

      ] = await Promise.all([

        fetchEndpoint(
          "/slots/",
          "slots_update"
        ),

        fetchEndpoint(
          "/admin/bookings/",
          "booking_update"
        ),

        fetchEndpoint(
          "/admin/payments/",
          "payment_update"
        ),

        fetchEndpoint(
          "/analytics/dashboard/",
          "analytics_update"
        ),
      ]);

      // ==============================================
      // EMIT EVENTS
      // ==============================================

      if (slots) {

        emit({

          type:
            "slots_update",

          payload:
            slots,
        });
      }

      if (bookings) {

        emit({

          type:
            "booking_update",

          payload:
            bookings,
        });
      }

      if (payments) {

        emit({

          type:
            "payment_update",

          payload:
            payments,
        });
      }

      if (analytics) {

        emit({

          type:
            "analytics_update",

          payload:
            analytics,
        });
      }

      reconnectAttempts = 0;

      setConnectionState(
        true
      );

    } catch (error) {

      setConnectionState(
        false
      );

      emit({

        type:
          "connection_error",

        error:
          error.message,
      });

      attemptReconnect();

    } finally {

      isPolling = false;
    }
  };


// =====================================================
// HEARTBEAT
// =====================================================

const startHeartbeat =
  () => {

    stopHeartbeat();

    heartbeatInterval =
      setInterval(() => {

        if (!isAuthenticated()) {

          disconnectWebSocket();

          return;
        }

        lastHeartbeat =
          Date.now();

        emit({

          type:
            "heartbeat",

          timestamp:
            lastHeartbeat,
        });

      }, HEARTBEAT_INTERVAL);
  };


// =====================================================
// STOP HEARTBEAT
// =====================================================

const stopHeartbeat =
  () => {

    if (heartbeatInterval) {

      clearInterval(
        heartbeatInterval
      );

      heartbeatInterval = null;
    }
  };


// =====================================================
// RECONNECT
// =====================================================

const attemptReconnect =
  () => {

    // ==============================================
    // STOP IF LOGGED OUT
    // ==============================================

    if (!isAuthenticated()) {

      return;
    }

    // ==============================================
    // MAX RETRIES
    // ==============================================

    if (

      reconnectAttempts >=
      MAX_RETRIES

    ) {

      emit({

        type:
          "reconnect_failed",
      });

      console.error(
        "Max reconnect attempts reached"
      );

      return;
    }

    reconnectAttempts++;

    const delay = Math.min(

      1000 *

      Math.pow(
        2,
        reconnectAttempts
      )

      +

      Math.random() * 1000,

      MAX_BACKOFF
    );

    emit({

      type:
        "reconnecting",

      attempt:
        reconnectAttempts,

      delay,
    });

    reconnectTimeout =
      setTimeout(() => {

        console.log(
          `Reconnect attempt ${reconnectAttempts}`
        );

        connectWebSocket();

      }, delay);
  };


// =====================================================
// ONLINE
// =====================================================

const handleOnline =
  () => {

    console.log(
      "Browser online"
    );

    connectWebSocket();
  };


// =====================================================
// OFFLINE
// =====================================================

const handleOffline =
  () => {

    console.log(
      "Browser offline"
    );

    disconnectWebSocket();
  };


// =====================================================
// VISIBILITY CHANGE
// =====================================================

const handleVisibilityChange =
  () => {

    if (

      document.visibilityState ===
      "visible"

    ) {

      fetchRealtimeData();
    }
  };


// =====================================================
// CONNECT
// =====================================================

export const connectWebSocket =
  () => {

    // ==============================================
    // LOGIN CHECK
    // ==============================================

    if (!isAuthenticated()) {

      // ============================================
      // PREVENT LOG SPAM
      // ============================================

      if (!authWarningShown) {

        console.info(
          "Realtime waiting for login..."
        );

        authWarningShown = true;
      }

      return;
    }

    authWarningShown = false;

    // ==============================================
    // PREVENT DUPLICATE
    // ==============================================

    if (pollingInterval) {

      return;
    }

    console.log(
      "Realtime engine started"
    );

    setConnectionState(
      true
    );

    // ==============================================
    // INITIAL FETCH
    // ==============================================

    fetchRealtimeData();

    // ==============================================
    // START POLLING
    // ==============================================

    pollingInterval =
      setInterval(() => {

        fetchRealtimeData();

      }, POLLING_INTERVAL);

    // ==============================================
    // HEARTBEAT
    // ==============================================

    startHeartbeat();

    // ==============================================
    // BROWSER EVENTS
    // ==============================================

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
  };


// =====================================================
// DISCONNECT
// =====================================================

export const disconnectWebSocket =
  () => {

    if (pollingInterval) {

      clearInterval(
        pollingInterval
      );

      pollingInterval = null;
    }

    stopHeartbeat();

    if (reconnectTimeout) {

      clearTimeout(
        reconnectTimeout
      );

      reconnectTimeout = null;
    }

    window.removeEventListener(
      "online",
      handleOnline
    );

    window.removeEventListener(
      "offline",
      handleOffline
    );

    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    setConnectionState(
      false
    );

    reconnectAttempts = 0;

    console.log(
      "Realtime engine stopped"
    );
  };


// =====================================================
// STATUS
// =====================================================

export const getConnectionStatus =
  () => {

    return {

      connected:
        isConnected,

      reconnectAttempts,

      lastHeartbeat,
    };
  };