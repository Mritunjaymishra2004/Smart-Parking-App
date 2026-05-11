let socket = null;

let reconnectTimeout = null;

let manuallyClosed = false;


// =====================================================
// CONNECT
// =====================================================

export const connectWebSocket = (onMessage) => {

  // Prevent duplicate sockets
  if (
    socket &&
    (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    )
  ) {

    return socket;
  }

  manuallyClosed = false;

  const wsUrl =
    "ws://127.0.0.1:8000/ws/parking/";

  console.log(
    "Connecting WebSocket:",
    wsUrl
  );

  socket = new WebSocket(wsUrl);


  // =====================================================
  // OPEN
  // =====================================================

  socket.onopen = () => {

    console.log(
      "WebSocket connected"
    );
  };


  // =====================================================
  // MESSAGE
  // =====================================================

  socket.onmessage = (event) => {

    try {

      const data = JSON.parse(
        event.data
      );

      console.log(
        "WebSocket message:",
        data
      );

      onMessage?.(data);

    } catch (err) {

      console.error(
        "Invalid websocket message",
        err
      );
    }
  };


  // =====================================================
  // ERROR
  // =====================================================

  socket.onerror = (err) => {

    console.error(
      "WebSocket error",
      err
    );
  };


  // =====================================================
  // CLOSE
  // =====================================================

  socket.onclose = () => {

    console.warn(
      "WebSocket disconnected"
    );

    socket = null;

    // Prevent infinite reconnect loop
    if (!manuallyClosed) {

      clearTimeout(
        reconnectTimeout
      );

      reconnectTimeout = setTimeout(() => {

        connectWebSocket(
          onMessage
        );

      }, 5000);
    }
  };

  return socket;
};


// =====================================================
// DISCONNECT
// =====================================================

export const disconnectWebSocket = () => {

  manuallyClosed = true;

  clearTimeout(
    reconnectTimeout
  );

  if (socket) {

    socket.close();

    socket = null;
  }
};