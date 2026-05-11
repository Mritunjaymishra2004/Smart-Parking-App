import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import {
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  freeSlotIcon,
  busySlotIcon,
  reservedIcon,
  carIcon,
} from "../../utils/leafletIcon";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useParking,
} from "../../context/ParkingContext";

import {
  useWebSocket,
} from "../../websocket/WebSocketContext";

import VehiclePickerModal from "../user/VehiclePickerModal";

import useParkingData from "../../hooks/useParkingData";

// ======================================================
// AUTO RECENTER COMPONENT
// ======================================================

function RecenterMap({
  center,
}) {

  const map = useMap();

  useEffect(() => {

    if (center) {

      map.setView(center);
    }

  }, [center, map]);

  return null;
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function LiveParkingMap() {

  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const { startParking } =
    useParking();

  const { lastMessage } =
    useWebSocket();

  const {
    slots,
    vehicles,
    loading,
  } = useParkingData();

  // ====================================================
  // STATE
  // ====================================================

  const [userLocation, setUserLocation] =
    useState(null);

  const [selectedSlot, setSelectedSlot] =
    useState(null);

  const [showVehicleModal, setShowVehicleModal] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const mapRef =
    useRef(null);

  // ====================================================
  // GEOLOCATION
  // ====================================================

  useEffect(() => {

    if (
      !navigator.geolocation
    ) {

      setMessage(
        "Geolocation not supported"
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(

      (pos) => {

        setUserLocation([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
      },

      () => {

        setMessage(
          "Location access denied"
        );
      }
    );

  }, []);

  // ====================================================
  // AUTO CLEAR MESSAGE
  // ====================================================

  useEffect(() => {

    if (!message) return;

    const timer =
      setTimeout(() => {

        setMessage("");
      }, 3000);

    return () =>
      clearTimeout(timer);

  }, [message]);

  // ====================================================
  // WEBSOCKET LIVE EVENTS
  // ====================================================

  useEffect(() => {

    if (!lastMessage) return;

    console.log(
      "Live WebSocket update:",
      lastMessage
    );

  }, [lastMessage]);

  // ====================================================
  // SAFE SLOT DATA
  // ====================================================

  const safeSlots = useMemo(() => {

    if (
      Array.isArray(slots) &&
      slots.length
    ) {

      return slots.filter(
        (slot) => (
          slot?.x &&
          slot?.y
        )
      );
    }

    // ================================================
    // FALLBACK SLOT
    // ================================================

    return [
      {
        id: 1,
        code: "A1",
        x: 77.2001,
        y: 28.6101,
        status: "AVAILABLE",
      },
    ];

  }, [slots]);

  // ====================================================
  // DISTANCE
  // ====================================================

  const getDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {

    return Math.sqrt(

      Math.pow(lat1 - lat2, 2) +

      Math.pow(lon1 - lon2, 2)
    );
  };

  // ====================================================
  // SLOT CLICK
  // ====================================================

  const onSlotClick = (
    slot
  ) => {

    // ================================================
    // SLOT STATUS
    // ================================================

    if (
      slot.status === "OCCUPIED"
    ) {

      setMessage(
        "Slot already occupied"
      );

      return;
    }

    if (
      slot.status === "RESERVED"
    ) {

      setMessage(
        "Slot already reserved"
      );

      return;
    }

    // ================================================
    // VEHICLE CHECK
    // ================================================

    if (
      !user?.vehicles?.length
    ) {

      navigate(
        "/add-vehicle"
      );

      return;
    }

    // ================================================
    // SINGLE VEHICLE
    // ================================================

    if (
      user.vehicles.length === 1
    ) {

      startParking(
        slot,
        user.vehicles[0]
      );

      return;
    }

    // ================================================
    // MULTIPLE VEHICLES
    // ================================================

    setSelectedSlot(slot);

    setShowVehicleModal(true);
  };

  // ====================================================
  // FIND NEAREST SLOT
  // ====================================================

  const findNearestSlot = () => {

    if (!userLocation) {

      setMessage(
        "Location unavailable"
      );

      return;
    }

    let nearest = null;

    let minDist =
      Infinity;

    safeSlots.forEach(
      (slot) => {

        if (
          slot.status !==
          "AVAILABLE"
        ) {

          return;
        }

        const dist =
          getDistance(

            userLocation[0],
            userLocation[1],

            slot.y,
            slot.x
          );

        if (
          dist < minDist
        ) {

          minDist = dist;

          nearest = slot;
        }
      }
    );

    if (!nearest) {

      setMessage(
        "No free slots available"
      );

      return;
    }

    onSlotClick(nearest);
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="
        flex
        items-center
        justify-center
        h-full
        text-white
        text-lg
      ">
        Loading Live Map...
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      relative
      w-full
      h-full
    ">

      {/* ========================================== */}
      {/* MESSAGE */}
      {/* ========================================== */}

      {message && (

        <div className="
          absolute
          top-16
          left-1/2
          -translate-x-1/2
          bg-black/80
          text-white
          px-4
          py-2
          rounded-xl
          z-[1000]
          shadow-xl
        ">
          {message}
        </div>
      )}

      {/* ========================================== */}
      {/* FIND BUTTON */}
      {/* ========================================== */}

      <button
        onClick={findNearestSlot}
        className="
          absolute
          top-4
          left-4
          z-[1000]
          bg-emerald-600
          hover:bg-emerald-700
          text-white
          px-4
          py-2
          rounded-xl
          shadow-lg
          transition
        "
      >
        Find Nearest
      </button>

      {/* ========================================== */}
      {/* MAP */}
      {/* ========================================== */}

      <MapContainer
        center={
          userLocation ||
          [28.6105, 77.2007]
        }
        zoom={16}
        className="
          absolute
          inset-0
        "
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >

        <RecenterMap
          center={userLocation}
        />

        <TileLayer
          attribution="OpenStreetMap"
          url="
          https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
          "
        />

        {/* ====================================== */}
        {/* SLOTS */}
        {/* ====================================== */}

        {safeSlots.map(
          (slot) => (

            <Marker
              key={slot.id}
              position={[
                slot.y,
                slot.x,
              ]}

              icon={
                slot.status ===
                "OCCUPIED"

                  ? busySlotIcon

                  : slot.status ===
                    "RESERVED"

                  ? reservedIcon

                  : freeSlotIcon
              }

              eventHandlers={{
                click: () =>
                  onSlotClick(slot),
              }}
            >

              <Popup>

                <div className="
                  text-sm
                ">

                  <b>
                    Slot {slot.code}
                  </b>

                  <br />

                  Status:
                  {" "}
                  {slot.status}

                </div>

              </Popup>

            </Marker>
          )
        )}

        {/* ====================================== */}
        {/* VEHICLES */}
        {/* ====================================== */}

        {vehicles?.map(
          (vehicle) => (

            <Marker
              key={
                vehicle.vehicle_id
              }

              position={[
                vehicle.y,
                vehicle.x,
              ]}

              icon={carIcon}
            >

              <Popup>

                {vehicle.plate ||

                  `Vehicle ${vehicle.vehicle_id}`
                }

              </Popup>

            </Marker>
          )
        )}

        {/* ====================================== */}
        {/* USER */}
        {/* ====================================== */}

        {userLocation && (

          <Marker
            position={
              userLocation
            }
          >

            <Popup>
              You are here
            </Popup>

          </Marker>
        )}

      </MapContainer>

      {/* ========================================== */}
      {/* LEGEND */}
      {/* ========================================== */}

      <div className="
        absolute
        bottom-4
        left-4
        bg-black/70
        text-white
        p-3
        rounded-xl
        text-sm
        z-[1000]
      ">

        <div>
          🟢 Available
        </div>

        <div>
          🟡 Reserved
        </div>

        <div>
          🔴 Occupied
        </div>

        <div>
          🚗 Vehicles
        </div>

      </div>

      {/* ========================================== */}
      {/* VEHICLE MODAL */}
      {/* ========================================== */}

      {showVehicleModal && (

        <VehiclePickerModal

          vehicles={
            user?.vehicles || []
          }

          onSelect={(
            vehicle
          ) => {

            startParking(
              selectedSlot,
              vehicle
            );

            setShowVehicleModal(
              false
            );

            setSelectedSlot(
              null
            );
          }}

          onClose={() => {

            setShowVehicleModal(
              false
            );
          }}
        />
      )}

    </div>
  );
}

















// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect, useMemo, useRef } from "react";

// import {
//   freeSlotIcon,
//   busySlotIcon,
//   reservedIcon,
//   carIcon,
// } from "../../utils/leafletIcon";

// import { useAuth } from "../../context/AuthContext";
// import { useParking } from "../../context/ParkingContext";
// import VehiclePickerModal from "../user/VehiclePickerModal";
// import useParkingData from "../../hooks/useParkingData";

// export default function LiveParkingMap() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { startParking } = useParking();

//   const { slots, vehicles, loading } = useParkingData();

//   const [userLocation, setUserLocation] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [showVehicleModal, setShowVehicleModal] = useState(false);
//   const [message, setMessage] = useState("");

//   const mapRef = useRef(null);

//   // ==============================
//   // 📍 USER LOCATION (SAFE)
//   // ==============================
//   useEffect(() => {
//     if (!navigator.geolocation) return;

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation([pos.coords.latitude, pos.coords.longitude]);
//       },
//       () => {
//         setMessage("Location access denied");
//       }
//     );
//   }, []);

//   // ==============================
//   // 📦 SAFE SLOT DATA
//   // ==============================
//   const safeSlots = useMemo(() => {
//     if (slots?.length) return slots;

//     return [
//       {
//         id: 1,
//         code: "A1",
//         x: 77.2001,
//         y: 28.6101,
//         is_occupied: false,
//         is_reserved: false,
//       },
//     ];
//   }, [slots]);

//   // ==============================
//   // 📏 DISTANCE FUNCTION (BETTER)
//   // ==============================
//   const getDistance = (lat1, lon1, lat2, lon2) => {
//     return Math.sqrt(
//       Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)
//     );
//   };

//   // ==============================
//   // 🚗 SLOT CLICK
//   // ==============================
//   const onSlotClick = (slot) => {
//     if (slot.is_occupied) {
//       setMessage("Slot already occupied");
//       return;
//     }

//     if (slot.is_reserved) {
//       setMessage("Slot is reserved");
//       return;
//     }

//     if (!user?.vehicles?.length) {
//       navigate("/add-vehicle");
//       return;
//     }

//     if (user.vehicles.length === 1) {
//       startParking(slot, user.vehicles[0]);
//     } else {
//       setSelectedSlot(slot);
//       setShowVehicleModal(true);
//     }
//   };

//   // ==============================
//   // 📍 FIND NEAREST SLOT
//   // ==============================
//   const findNearestSlot = () => {
//     if (!userLocation) {
//       setMessage("Location not available");
//       return;
//     }

//     let nearest = null;
//     let minDist = Infinity;

//     safeSlots.forEach((slot) => {
//       if (slot.is_occupied || slot.is_reserved) return;

//       const dist = getDistance(
//         userLocation[0],
//         userLocation[1],
//         slot.y,
//         slot.x
//       );

//       if (dist < minDist) {
//         minDist = dist;
//         nearest = slot;
//       }
//     });

//     if (!nearest) {
//       setMessage("No free slots available");
//       return;
//     }

//     onSlotClick(nearest);
//   };

//   // ==============================
//   // LOADING
//   // ==============================
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full text-white">
//         Loading Map...
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-full">
//       {/* MESSAGE */}
//       {message && (
//         <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded z-[1000]">
//           {message}
//         </div>
//       )}

//       {/* FIND BUTTON */}
//       <button
//         onClick={findNearestSlot}
//         className="absolute top-4 left-4 z-[1000] bg-emerald-600 px-4 py-2 rounded shadow hover:bg-emerald-700 text-white"
//       >
//         Find Nearest
//       </button>

//       <MapContainer
//         center={userLocation || [28.6105, 77.2007]}
//         zoom={16}
//         className="absolute inset-0"
//         whenCreated={(map) => (mapRef.current = map)}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* SLOTS */}
//         {safeSlots.map((slot) => (
//           <Marker
//             key={slot.id}
//             position={[slot.y, slot.x]}
//             icon={
//   slot.status === "OCCUPIED"
//     ? busySlotIcon
//     : slot.status === "RESERVED"
//     ? reservedIcon
//     : freeSlotIcon
// }
//             eventHandlers={{
//               click: () => onSlotClick(slot),
//             }}
//           >
//             <Popup>
//               <b>Slot {slot.code}</b>
//               <br />
//               {slot.status}
//             </Popup>
//           </Marker>
//         ))}

//         {/* VEHICLES */}
//         {vehicles?.map((v) => (
//           <Marker key={v.vehicle_id} position={[v.y, v.x]} icon={carIcon}>
//             <Popup>{v.plate || `Vehicle ${v.vehicle_id}`}</Popup>
//           </Marker>
//         ))}

//         {/* USER */}
//         {userLocation && (
//           <Marker position={userLocation}>
//             <Popup>You are here</Popup>
//           </Marker>
//         )}
//       </MapContainer>

//       {/* LEGEND */}
//       <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded text-sm">
//         <div>🟢 Available</div>
//         <div>🟡 Reserved</div>
//         <div>🔴 Occupied</div>
//         <div>🚗 Vehicles</div>
//       </div>

//       {/* VEHICLE MODAL */}
//       {showVehicleModal && (
//         <VehiclePickerModal
//           vehicles={user?.vehicles || []}
//           onSelect={(vehicle) => {
//             startParking(selectedSlot, vehicle);
//             setShowVehicleModal(false);
//             setSelectedSlot(null);
//           }}
//           onClose={() => setShowVehicleModal(false)}
//         />
//       )}
//     </div>
//   );
// }

