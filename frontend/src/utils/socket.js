// =====================================================
// SOCKET PLACEHOLDER
// =====================================================

// WebSocket temporarily disabled.
//
// Reason:
// Vercel deployment cannot properly handle
// Django Channels websocket connections.
//
// App continues using:
// ✅ polling realtime engine
// from websocketService.js
//
// =====================================================


// =====================================================
// SOCKET INSTANCE
// =====================================================

let socket = null;


// =====================================================
// CONNECT SOCKET
// =====================================================

export const connectSocket = (
  onMessage
) => {

  console.info(
    "Realtime polling mode enabled"
  );

  return null;
};


// =====================================================
// VEHICLE UPDATES
// =====================================================

export const connectVehicleUpdates =
  connectSocket;


// =====================================================
// DISCONNECT SOCKET
// =====================================================

export const disconnectSocket =
  () => {

    socket = null;

    console.info(
      "Realtime polling stopped"
    );
  };


// =====================================================
// GET SOCKET
// =====================================================

export const getSocket =
  () => {

    return socket;
  };


// =====================================================
// SEND MESSAGE
// =====================================================

export const sendMessage =
  (message) => {

    console.info(
      "WebSocket disabled:",
      message
    );
  };


// =====================================================
// SOCKET STATUS
// =====================================================

export const isSocketConnected =
  () => {

    return false;
  };