import L from "leaflet";

// Default shadow from Leaflet
const shadow = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

// =============================
// Free Slot (Green)
// =============================
export const freeSlotIcon = new L.Icon({
  iconUrl: "/slot-green.png",
  shadowUrl: shadow,

  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowSize: [41, 41],
});

// =============================
// Reserved Slot (Yellow)
// =============================
export const reservedIcon = new L.Icon({
  iconUrl: "/slot-yellow.png",
  shadowUrl: shadow,

  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowSize: [41, 41],
});

// =============================
// Busy Slot (Red)
// =============================
export const busySlotIcon = new L.Icon({
  iconUrl: "/slot-red.png",
  shadowUrl: shadow,

  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowSize: [41, 41],
});

// =============================
// Vehicle Marker
// =============================
export const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",

  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -10],
});








// import L from "leaflet";

// // Free slot
// export const freeSlotIcon = new L.Icon({
//   iconUrl: "/slot-green.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
// });

// // Reserved slot
// export const reservedIcon = new L.Icon({
//   iconUrl: "/slot-yellow.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
// });

// // Busy slot
// export const busySlotIcon = new L.Icon({
//   iconUrl: "/slot-red.png",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
// });

// // Car icon (for live vehicles)
// export const carIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
//   iconSize: [30, 30],
//   iconAnchor: [15, 15],
// });
