let socket = null;
let listeners = [];
let reconnectTimer = null;

let manuallyClosed = false;

const WS_URL =
  "ws://127.0.0.1:8000/ws/parking/";


// ======================================================
// CONNECT
// ======================================================

export const connectWebSocket = () => {
  const token =
    localStorage.getItem("access");

  if (!token) {
    console.warn(
      "No auth token found"
    );
    return;
  }

  // Prevent duplicate connection
  if (
    socket &&
    (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    )
  ) {
    return;
  }

  manuallyClosed = false;

  socket = new WebSocket(
    `${WS_URL}?token=${token}`
  );

  socket.onopen = () => {
    console.log(
      "WebSocket connected"
    );

    if (reconnectTimer) {
      clearTimeout(
        reconnectTimer
      );
      reconnectTimer = null;
    }
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(
        event.data
      );

      listeners.forEach((cb) =>
        cb(data)
      );

    } catch (error) {
      console.error(
        "Invalid WebSocket message:",
        error
      );
    }
  };

  socket.onclose = (event) => {
    console.log(
      "Disconnected:",
      event.code
    );

    if (
      !manuallyClosed &&
      event.code !== 1000
    ) {
      reconnect();
    }
  };

  socket.onerror = (error) => {
    console.error(
      "WebSocket error:",
      error
    );
  };
};


// ======================================================
// RECONNECT
// ======================================================

const reconnect = () => {
  if (reconnectTimer) return;

  reconnectTimer =
    setTimeout(() => {
      reconnectTimer = null;
      connectWebSocket();
    }, 3000);
};


// ======================================================
// DISCONNECT
// ======================================================

export const disconnectWebSocket = () => {
  manuallyClosed = true;

  if (reconnectTimer) {
    clearTimeout(
      reconnectTimer
    );
    reconnectTimer = null;
  }

  if (socket) {
    console.log(
      "WebSocket disconnected manually"
    );

    socket.onopen = null;
    socket.onmessage = null;
    socket.onclose = null;
    socket.onerror = null;

    socket.close(1000);
    socket = null;
  }
};


// ======================================================
// SUBSCRIBE
// ======================================================

export const subscribe = (callback) => {
  listeners.push(callback);

  return () => {
    listeners =
      listeners.filter(
        (cb) =>
          cb !== callback
      );
  };
};


// ======================================================
// SEND
// ======================================================

export const sendMessage = (data) => {
  if (
    socket &&
    socket.readyState === WebSocket.OPEN
  ) {
    socket.send(
      JSON.stringify(data)
    );
  }
};


// ======================================================
// STATUS
// ======================================================

export const getConnectionStatus = () => {
  if (!socket)
    return "DISCONNECTED";

  switch (socket.readyState) {
    case WebSocket.CONNECTING:
      return "CONNECTING";

    case WebSocket.OPEN:
      return "CONNECTED";

    case WebSocket.CLOSING:
      return "CLOSING";

    case WebSocket.CLOSED:
      return "DISCONNECTED";

    default:
      return "DISCONNECTED";
  }
};