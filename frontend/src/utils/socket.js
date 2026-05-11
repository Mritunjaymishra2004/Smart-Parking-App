let socket = null;


// =====================================================
// BASE WS URL
// =====================================================

const BASE_WS_URL =
  "ws://127.0.0.1:8000";


// =====================================================
// CONNECT GLOBAL SOCKET
// =====================================================

export const connectSocket = (
  onMessage
) => {

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

  const url =
    `${BASE_WS_URL}/ws/parking/`;

  console.log(
    "Connecting WebSocket:",
    url
  );

  socket = new WebSocket(url);


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

      onMessage?.(data);

    } catch (err) {

      console.error(
        "WebSocket parse error",
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
  };

  return socket;
};


// =====================================================
// VEHICLE UPDATES
// =====================================================

export const connectVehicleUpdates =
  connectSocket;


// =====================================================
// DISCONNECT
// =====================================================

export const disconnectSocket = () => {

  if (socket) {

    socket.close();

    socket = null;

    console.log(
      "WebSocket manually disconnected"
    );
  }
};












// let slotSocket = null;

// let vehicleSocket = null;

// // ======================================================
// // RECONNECT SETTINGS
// // ======================================================

// const MAX_RECONNECT_ATTEMPTS = 10;

// const RECONNECT_DELAY = 3000;

// // ======================================================
// // RECONNECT TRACKERS
// // ======================================================

// let slotReconnectAttempts = 0;

// let vehicleReconnectAttempts = 0;

// // ======================================================
// // SOCKET URL
// // ======================================================

// const getWebSocketUrl = (
//   path
// ) => {

//   const protocol =
//     window.location.protocol === "https:"
//       ? "wss"
//       : "ws";

//   return `${protocol}://${window.location.host}${path}`;
// };

// // ======================================================
// // CREATE SOCKET
// // ======================================================

// const createSocket = ({
//   path,
//   existingSocket,
//   setSocket,
//   reconnectAttemptsRef,
//   onMessage,
//   socketName,
// }) => {

//   // ====================================================
//   // ALREADY CONNECTED
//   // ====================================================

//   if (
//     existingSocket &&
//     (
//       existingSocket.readyState ===
//       WebSocket.OPEN ||

//       existingSocket.readyState ===
//       WebSocket.CONNECTING
//     )
//   ) {

//     return;
//   }

//   // ====================================================
//   // TOKEN CHECK
//   // ====================================================

//   const token =
//     localStorage.getItem("access");

//   if (!token) return;

//   // ====================================================
//   // MAX RECONNECT LIMIT
//   // ====================================================

//   if (
//     reconnectAttemptsRef.value >=
//     MAX_RECONNECT_ATTEMPTS
//   ) {

//     console.warn(
//       `${socketName} reconnect limit reached`
//     );

//     return;
//   }

//   // ====================================================
//   // SOCKET URL
//   // ====================================================

//   const url =
//     getWebSocketUrl(
//       `${path}?token=${token}`
//     );

//   const socket =
//     new WebSocket(url);

//   setSocket(socket);

//   // ====================================================
//   // OPEN
//   // ====================================================

//   socket.onopen = () => {

//     console.log(
//       `${socketName} connected`
//     );

//     reconnectAttemptsRef.value = 0;
//   };

//   // ====================================================
//   // MESSAGE
//   // ====================================================

//   socket.onmessage = (
//     event
//   ) => {

//     try {

//       const data =
//         JSON.parse(event.data);

//       // ==============================================
//       // HEARTBEAT
//       // ==============================================

//       if (
//         data.type === "ping"
//       ) {

//         socket.send(
//           JSON.stringify({
//             type: "pong",
//           })
//         );

//         return;
//       }

//       onMessage?.(data);

//     } catch (error) {

//       console.warn(
//         `${socketName} invalid message`,
//         error
//       );
//     }
//   };

//   // ====================================================
//   // ERROR
//   // ====================================================

//   socket.onerror = (
//     error
//   ) => {

//     console.warn(
//       `${socketName} socket error`,
//       error
//     );
//   };

//   // ====================================================
//   // CLOSE
//   // ====================================================

//   socket.onclose = () => {

//     console.warn(
//       `${socketName} disconnected`
//     );

//     setSocket(null);

//     const token =
//       localStorage.getItem("access");

//     if (!token) return;

//     reconnectAttemptsRef.value += 1;

//     // ==============================================
//     // EXPONENTIAL BACKOFF
//     // ==============================================

//     const delay =
//       RECONNECT_DELAY *
//       reconnectAttemptsRef.value;

//     setTimeout(() => {

//       createSocket({
//         path,
//         existingSocket: null,
//         setSocket,
//         reconnectAttemptsRef,
//         onMessage,
//         socketName,
//       });

//     }, delay);
//   };

//   return socket;
// };

// // ======================================================
// // SLOT SOCKET
// // ======================================================

// export const connectSocket = (
//   onMessage
// ) => {

//   return createSocket({

//     path: "/ws/slots/",

//     existingSocket: slotSocket,

//     setSocket: (socket) => {
//       slotSocket = socket;
//     },

//     reconnectAttemptsRef: {
//       get value() {
//         return slotReconnectAttempts;
//       },

//       set value(v) {
//         slotReconnectAttempts = v;
//       },
//     },

//     onMessage,

//     socketName: "Slot WebSocket",
//   });
// };

// // ======================================================
// // VEHICLE SOCKET
// // ======================================================

// export const connectVehicleUpdates = (
//   onMessage
// ) => {

//   return createSocket({

//     path: "/ws/vehicles/",

//     existingSocket: vehicleSocket,

//     setSocket: (socket) => {
//       vehicleSocket = socket;
//     },

//     reconnectAttemptsRef: {
//       get value() {
//         return vehicleReconnectAttempts;
//       },

//       set value(v) {
//         vehicleReconnectAttempts = v;
//       },
//     },

//     onMessage,

//     socketName: "Vehicle WebSocket",
//   });
// };

// // ======================================================
// // DISCONNECT ALL
// // ======================================================

// export const disconnectSocket = () => {

//   if (slotSocket) {

//     slotSocket.close();

//     slotSocket = null;
//   }

//   if (vehicleSocket) {

//     vehicleSocket.close();

//     vehicleSocket = null;
//   }

//   slotReconnectAttempts = 0;

//   vehicleReconnectAttempts = 0;

//   console.log(
//     "All WebSockets disconnected"
//   );
// };











// let slotSocket = null;
// let vehicleSocket = null;
// let slotReconnectTimeout = null;
// let vehicleReconnectTimeout = null;

// const getWebSocketUrl = (path) => {
//   const protocol = window.location.protocol === "https:" ? "wss" : "ws";
//   return `${protocol}://${window.location.host}${path}`;
// };

// export const connectSocket = (onMessage) => {
//   if (slotSocket) return;

//   const token = localStorage.getItem("access");
//   if (!token) return;

//   const url = getWebSocketUrl(`/ws/slots/?token=${token}`);
//   slotSocket = new WebSocket(url);

//   slotSocket.onopen = () => {
//     console.log("Slot WebSocket connected", url);
//   };

//   slotSocket.onmessage = (e) => {
//     try {
//       const data = JSON.parse(e.data);
//       onMessage?.(data);
//     } catch (error) {
//       console.warn("Invalid slot socket message", error);
//     }
//   };

//   slotSocket.onerror = (error) => {
//     console.warn("Slot WebSocket error", error);
//   };

//   slotSocket.onclose = () => {
//     console.warn("Slot WebSocket closed");
//     slotSocket = null;

//     const token = localStorage.getItem("access");
//     if (token) {
//       clearTimeout(slotReconnectTimeout);
//       slotReconnectTimeout = setTimeout(() => {
//         connectSocket(onMessage);
//       }, 3000);
//     }
//   };
// };

// export const connectVehicleUpdates = (onMessage) => {
//   if (vehicleSocket) return;

//   const token = localStorage.getItem("access");
//   if (!token) return;

//   const url = getWebSocketUrl(`/ws/vehicles/?token=${token}`);
//   vehicleSocket = new WebSocket(url);

//   vehicleSocket.onopen = () => {
//     console.log("Vehicle WebSocket connected", url);
//   };

//   vehicleSocket.onmessage = (e) => {
//     try {
//       const data = JSON.parse(e.data);
//       onMessage?.(data);
//     } catch (error) {
//       console.warn("Invalid vehicle socket message", error);
//     }
//   };

//   vehicleSocket.onerror = (error) => {
//     console.warn("Vehicle WebSocket error", error);
//   };

//   vehicleSocket.onclose = () => {
//     console.warn("Vehicle WebSocket closed");
//     vehicleSocket = null;

//     const token = localStorage.getItem("access");
//     if (token) {
//       clearTimeout(vehicleReconnectTimeout);
//       vehicleReconnectTimeout = setTimeout(() => {
//         connectVehicleUpdates(onMessage);
//       }, 3000);
//     }
//   };
// };

// export const disconnectSocket = () => {
//   clearTimeout(slotReconnectTimeout);
//   clearTimeout(vehicleReconnectTimeout);

//   if (slotSocket) {
//     slotSocket.close();
//     slotSocket = null;
//   }

//   if (vehicleSocket) {
//     vehicleSocket.close();
//     vehicleSocket = null;
//   }

//   console.log("All sockets disconnected");
// };




