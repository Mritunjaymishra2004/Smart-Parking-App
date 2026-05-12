let socket = null;


// =====================================================
// BASE WS URL
// =====================================================

const BASE_WS_URL =
  "wss://smart-parking-app-4on2.vercel.app";


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
// let slotReconnectTimeout = null;
// let vehicleReconnectTimeout = null;

// const getWebSocketUrl = (path) => {
//   const protocol = window.location.protocol === "https:" ? "wss" : "ws";
//   return `${protocol}://${window.location.host}${path}`;
// };

// export const connectSocket = (onMessage) => {
//   if (slotSocket) return;
//   
//   const token = localStorage.getItem("access");
//   if (!token) return;
// 
//   const url = getWebSocketUrl(`/ws/slots/?token=${token}`);
//   slotSocket = new WebSocket(url);
// 
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
// 
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
//   
//   const token = localStorage.getItem("access");
//   if (!token) return;
// 
//   const url = getWebSocketUrl(`/ws/vehicles/?token=${token}`);
//   vehicleSocket = new WebSocket(url);
// 
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
// 
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
// 
//   if (slotSocket) {
//     slotSocket.close();
//     slotSocket = null;
//   }
// 
//   if (vehicleSocket) {
//     vehicleSocket.close();
//     vehicleSocket = null;
//   }
// 
//   console.log("All sockets disconnected");
// };
