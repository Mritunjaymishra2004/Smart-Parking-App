let slotSocket = null;
let vehicleSocket = null;

/* ===========================
   SLOT UPDATES SOCKET
=========================== */
export const connectSocket = (onMessage) => {
  if (slotSocket) return () => {};   // 🚫 prevent duplicate

  const token = localStorage.getItem("access");
  if (!token) return () => {};

  const url = `ws://127.0.0.1:8000/ws/slots/?token=${token}`;
  slotSocket = new WebSocket(url);

  slotSocket.onopen = () => {
    console.log("🟢 Slot WebSocket connected");
  };

  slotSocket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    onMessage?.(data);
  };

  slotSocket.onerror = () => {
    console.warn("🔴 Slot WebSocket error");
  };

  slotSocket.onclose = () => {
    console.warn("🟠 Slot WebSocket closed");
    slotSocket = null;
  };

  return () => {
    slotSocket?.close();
    slotSocket = null;
  };
};

/* ===========================
   VEHICLE TRACKING SOCKET
=========================== */
export const connectVehicleUpdates = (onMessage) => {
  if (vehicleSocket) return () => {};   // 🚫 prevent duplicate

  const token = localStorage.getItem("access");
  if (!token) return () => {};

  const url = `ws://127.0.0.1:8000/ws/vehicles/?token=${token}`;
  vehicleSocket = new WebSocket(url);

  vehicleSocket.onopen = () => {
    console.log("🟢 Vehicle WebSocket connected");
  };

  vehicleSocket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    onMessage?.(data);
  };

  vehicleSocket.onerror = () => {
    console.warn("🔴 Vehicle WebSocket error");
  };

  vehicleSocket.onclose = () => {
    console.warn("🟠 Vehicle WebSocket closed");
    vehicleSocket = null;
  };

  return () => {
    vehicleSocket?.close();
    vehicleSocket = null;
  };
};









