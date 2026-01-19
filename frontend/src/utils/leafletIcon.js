import L from "leaflet";

// 🟢 Free slot
export const freeSlotIcon = new L.Icon({
  iconUrl: "/slot-green.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// 🟡 Reserved slot
export const reservedIcon = new L.Icon({
  iconUrl: "/slot-yellow.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// 🔴 Busy slot
export const busySlotIcon = new L.Icon({
  iconUrl: "/slot-red.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// 🚗 Car icon (for live vehicles)
export const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});
