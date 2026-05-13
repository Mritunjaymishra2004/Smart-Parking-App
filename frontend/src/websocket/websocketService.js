let pollingInterval = null;


// =====================================================
// FETCH DATA
// =====================================================

const fetchParkingData = async (onMessage) => {

  try {

    const response = await fetch(
      "https://smart-parking-app-4on2.vercel.app/api/v1/parking/"
    );

    const text = await response.text();

    try {

      const data = JSON.parse(text);

      console.log(
        "Parking Data:",
        data
      );

      onMessage?.(data);

    } catch {

      console.error(
        "API did not return JSON:",
        text
      );
    }

  } catch (err) {

    console.error(
      "Polling Error:",
      err
    );
  }
};


// =====================================================
// START POLLING
// =====================================================

export const connectWebSocket = (onMessage) => {

  console.log(
    "Polling started"
  );

  fetchParkingData(onMessage);

  pollingInterval = setInterval(() => {

    fetchParkingData(onMessage);

  }, 5000);
};


// =====================================================
// STOP POLLING
// =====================================================

export const disconnectWebSocket = () => {

  clearInterval(
    pollingInterval
  );

  pollingInterval = null;

  console.log(
    "Polling stopped"
  );
};












// let socket = null;

// let reconnectTimeout = null;

// let manuallyClosed = false;


// // =====================================================
// // CONNECT
// // =====================================================

// export const connectWebSocket = (onMessage) => {

//   // Prevent duplicate sockets
//   if (
//     socket &&
//     (
//       socket.readyState === WebSocket.OPEN ||
//       socket.readyState === WebSocket.CONNECTING
//     )
//   ) {

//     return socket;
//   }

//   manuallyClosed = false;

//   const wsUrl =
//     
//    https://smart-parking-app-4on2.vercel.app
//   console.log(
//     "Connecting WebSocket:",
//     wsUrl
//   );

//   socket = new WebSocket(wsUrl);


//   // =====================================================
//   // OPEN
//   // =====================================================

//   socket.onopen = () => {

//     console.log(
//       "WebSocket connected"
//     );
//   };


//   // =====================================================
//   // MESSAGE
//   // =====================================================

//   socket.onmessage = (event) => {

//     try {

//       const data = JSON.parse(
//         event.data
//       );

//       console.log(
//         "WebSocket message:",
//         data
//       );

//       onMessage?.(data);

//     } catch (err) {

//       console.error(
//         "Invalid websocket message",
//         err
//       );
//     }
//   };


//   // =====================================================
//   // ERROR
//   // =====================================================

//   socket.onerror = (err) => {

//     console.error(
//       "WebSocket error",
//       err
//     );
//   };


//   // =====================================================
//   // CLOSE
//   // =====================================================

//   socket.onclose = () => {

//     console.warn(
//       "WebSocket disconnected"
//     );

//     socket = null;

//     // Prevent infinite reconnect loop
//     if (!manuallyClosed) {

//       clearTimeout(
//         reconnectTimeout
//       );

//       reconnectTimeout = setTimeout(() => {

//         connectWebSocket(
//           onMessage
//         );

//       }, 5000);
//     }
//   };

//   return socket;
// };


// // =====================================================
// // DISCONNECT
// // =====================================================

// export const disconnectWebSocket = () => {

//   manuallyClosed = true;

//   clearTimeout(
//     reconnectTimeout
//   );

//   if (socket) {

//     socket.close();

//     socket = null;
//   }
// };
