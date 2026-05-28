import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";

import {
  useAuth,
} from "./AuthContext";


// ======================================================
// CONTEXT
// ======================================================

const WebSocketContext =
  createContext(null);


// ======================================================
// PROVIDER
// ======================================================

export function WebSocketProvider({
  children,
}) {
  const { user } =
    useAuth();

  const socketRef =
    useRef(null);

  const reconnectRef =
    useRef(null);

  const [connected,
    setConnected] =
    useState(false);

  const [status,
    setStatus] =
    useState("DISCONNECTED");

  const [messages,
    setMessages] =
    useState([]);

  const [analytics,
    setAnalytics] =
    useState({});

  const [bookings,
    setBookings] =
    useState([]);

  const [slots,
    setSlots] =
    useState([]);

  const [notifications,
    setNotifications] =
    useState([]);


  // ======================================================
  // HANDLE MESSAGE
  // ======================================================

  const handleMessage =
    useCallback(
      (data) => {
        if (!data) return;

        setMessages((prev) => [
          ...prev.slice(-49),
          data,
        ]);

        switch (
          data.type
        ) {
          case "analytics":
            setAnalytics(
              data.payload || {}
            );
            break;

          case "booking":
            setBookings(
              (prev) => [
                data.payload,
                ...prev.slice(
                  0,
                  19
                ),
              ]
            );
            break;

          case "slot":
            setSlots(
              data.payload || []
            );
            break;

          case "notification":
            setNotifications(
              (prev) => [
                data.payload,
                ...prev.slice(
                  0,
                  19
                ),
              ]
            );
            break;

          default:
            break;
        }
      },
      []
    );


  // ======================================================
  // CONNECT
  // ======================================================

  const connect =
    useCallback(() => {
      const token =
        localStorage.getItem(
          "access"
        );

      if (
        !token ||
        socketRef.current
      )
        return;

      setStatus(
        "CONNECTING"
      );

      const socket =
        new WebSocket(
          `ws://127.0.0.1:8000/ws/parking/?token=${token}`
        );

      socketRef.current =
        socket;

      socket.onopen =
        () => {
          setConnected(
            true
          );

          setStatus(
            "CONNECTED"
          );

          console.log(
            "WebSocket Connected"
          );
        };

      socket.onmessage =
        (event) => {
          const data =
            JSON.parse(
              event.data
            );

          handleMessage(
            data
          );
        };

      socket.onerror =
        (error) => {
          console.error(
            "WebSocket Error:",
            error
          );

          setStatus(
            "ERROR"
          );
        };

      socket.onclose =
        () => {
          setConnected(
            false
          );

          setStatus(
            "DISCONNECTED"
          );

          socketRef.current =
            null;

          if (user) {
            reconnectRef.current =
              setTimeout(
                connect,
                3000
              );
          }
        };
    }, [
      handleMessage,
      user,
    ]);


  // ======================================================
  // DISCONNECT
  // ======================================================

  const disconnect =
    useCallback(() => {
      if (
        reconnectRef.current
      ) {
        clearTimeout(
          reconnectRef.current
        );
      }

      if (
        socketRef.current
      ) {
        socketRef.current.close();
        socketRef.current =
          null;
      }

      setConnected(
        false
      );

      setStatus(
        "DISCONNECTED"
      );
    }, []);


  // ======================================================
  // SEND
  // ======================================================

  const send =
    useCallback(
      (data) => {
        if (
          socketRef.current &&
          connected
        ) {
          socketRef.current.send(
            JSON.stringify(
              data
            )
          );

          return true;
        }

        return false;
      },
      [connected]
    );


  // ======================================================
  // AUTO CONNECT
  // ======================================================

  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }

    return () =>
      disconnect();
  }, [
    user,
    connect,
    disconnect,
  ]);


  // ======================================================
  // HEARTBEAT
  // ======================================================

  useEffect(() => {
    if (!connected)
      return;

    const interval =
      setInterval(
        () => {
          send({
            type: "ping",
          });
        },
        30000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [
    connected,
    send,
  ]);


  // ======================================================
  // VALUE
  // ======================================================

  const value =
    useMemo(
      () => ({
        connected,
        status,

        messages,
        analytics,
        bookings,
        slots,
        notifications,

        connect,
        disconnect,
        send,
      }),
      [
        connected,
        status,
        messages,
        analytics,
        bookings,
        slots,
        notifications,
        connect,
        disconnect,
        send,
      ]
    );


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

export function useWebSocket() {
  const context =
    useContext(
      WebSocketContext
    );

  if (!context) {
    throw new Error(
      "useWebSocket must be used inside WebSocketProvider"
    );
  }

  return context;
}