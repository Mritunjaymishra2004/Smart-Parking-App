import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { connectSocket, connectVehicleUpdates } from "../../utils/socket";
import {
  carIcon,
  freeSlotIcon,
  busySlotIcon,
  reservedIcon
} from "../../utils/leafletIcon";

import Navbar from "../../components/common/Navbar";
import DashboardBackground from "../../components/common/DashboardBackground";

import HeatmapLayer from "../../components/map/HeatmapLayer";
import VehicleTrails from "../../components/map/VehicleTrails";
import ViolationLayer from "../../components/map/ViolationLayer";

export default function AdminLiveMap() {
  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [violations, setViolations] = useState([]);

  /* ================= Load Slots ================= */
  useEffect(() => {
    api.get("/slots/")
      .then(res => setSlots(res.data))
      .catch(() => {
        setSlots([
          { id: 1, code: "A1", x: 77.2091, y: 28.6139, is_occupied: true, is_reserved: false, zone: "A", type: "Car" },
          { id: 2, code: "A2", x: 77.2094, y: 28.6142, is_occupied: false, is_reserved: false, zone: "A", type: "Car" },
          { id: 3, code: "B1", x: 77.2097, y: 28.6145, is_occupied: false, is_reserved: true, zone: "B", type: "EV" }
        ]);
      });
  }, []);

  /* ================= Live Slot Updates ================= */
  useEffect(() => {
    return connectSocket(msg => {
      if (msg.type === "slots_update") setSlots(msg.slots);
      if (msg.type === "violation") {
        setViolations(v => [...v, msg]);
      }
    });
  }, []);

  /* ================= Live Vehicle Updates ================= */
  useEffect(() => {
    return connectVehicleUpdates(msg => {
      if (msg.type === "vehicle_position") {
        setVehicles(prev => {
          const old = prev.find(v => v.vehicle_id === msg.vehicle_id);
          return [
            ...prev.filter(v => v.vehicle_id !== msg.vehicle_id),
            {
              ...msg,
              trail: old ? [...old.trail, [msg.y, msg.x]] : [[msg.y, msg.x]]
            }
          ];
        });
      }
    });
  }, []);

  /* ================= Force Release ================= */
  const forceRelease = async (slot) => {
    try {
      await api.post("/admin/free-slot/", { slot_id: slot.id });
    } catch {
      setSlots(prev =>
        prev.map(s =>
          s.id === slot.id ? { ...s, is_occupied: false, is_reserved: false } : s
        )
      );
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="pt-16 h-[calc(100vh-64px)] flex overflow-hidden">

          {/* ================= MAP ================= */}
          <div className="flex-1 relative">
            <MapContainer
              center={[28.6139, 77.209]}
              zoom={17}
              className="absolute inset-0 h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <HeatmapLayer slots={slots} />
              <VehicleTrails vehicles={vehicles} />
              <ViolationLayer violations={violations} />

              {/* Slots */}
              {slots.map(slot => (
                <Marker
                  key={slot.id}
                  position={[slot.y, slot.x]}
                  icon={
                    slot.is_occupied
                      ? busySlotIcon
                      : slot.is_reserved
                      ? reservedIcon
                      : freeSlotIcon
                  }
                >
                  <Popup>
                    <b>Slot {slot.code}</b><br />
                    Zone: {slot.zone}<br />
                    Type: {slot.type}<br />
                    Status: {slot.is_occupied ? "Occupied" : slot.is_reserved ? "Reserved" : "Free"}
                    <br />
                    {slot.is_occupied && (
                      <button
                        onClick={() => forceRelease(slot)}
                        className="mt-2 bg-red-600 text-white px-3 py-1 rounded w-full"
                      >
                        Force Release
                      </button>
                    )}
                  </Popup>
                </Marker>
              ))}

              {/* Vehicles */}
              {vehicles.map(v => (
                <Marker key={v.vehicle_id} position={[v.y, v.x]} icon={carIcon}>
                  <Popup>
                    <b>{v.plate || "Vehicle " + v.vehicle_id}</b><br />
                    Speed: {v.speed || 0} km/h<br />
                    Heading: {v.heading || 0}°
                  </Popup>
                </Marker>
              ))}

            </MapContainer>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="w-[360px] bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto text-white">

            <h2 className="text-xl font-bold mb-4">🛠 Admin Control</h2>

            {slots.map(slot => (
              <div
                key={slot.id}
                className={`p-3 mb-3 rounded ${
                  slot.is_occupied
                    ? "bg-red-600"
                    : slot.is_reserved
                    ? "bg-yellow-500 text-black"
                    : "bg-emerald-600"
                }`}
              >
                <div className="font-bold">Slot {slot.code}</div>
                <div className="text-sm">
                  {slot.is_occupied ? "Occupied" : slot.is_reserved ? "Reserved" : "Free"}
                </div>

                {slot.is_occupied && (
                  <button
                    onClick={() => forceRelease(slot)}
                    className="mt-2 bg-black/70 px-2 py-1 rounded w-full"
                  >
                    Force Exit
                  </button>
                )}
              </div>
            ))}

          </div>

        </div>
      </DashboardBackground>
    </>
  );
}












// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import { connectSocket, connectVehicleUpdates } from "../../utils/socket";
// import {
//   carIcon,
//   freeSlotIcon,
//   busySlotIcon,
//   reservedIcon
// } from "../../utils/leafletIcon";
// import Navbar from "../../components/common/Navbar";
// import DashboardBackground from "../../components/common/DashboardBackground";
// import HeatmapLayer from "../../components/map/HeatmapLayer";
// import VehicleTrails from "../../components/map/VehicleTrails";
// import ViolationLayer from "../../components/map/ViolationLayer";

// export default function AdminLiveMap() {
//   const [slots, setSlots] = useState([]);
//   const [vehicles, setVehicles] = useState([]);

//   /* ------------------------------------------------
//      Load slots
//   -------------------------------------------------*/
//   useEffect(() => {
//     api.get("/slots/")
//       .then(res => setSlots(res.data))
//       .catch(() => {
//         // Demo fallback
//         setSlots([
//           { id: 1, code: "A1", x: 77.2091, y: 28.6139, is_occupied: true, is_reserved: false, zone: "A", type: "Car" },
//           { id: 2, code: "A2", x: 77.2094, y: 28.6142, is_occupied: false, is_reserved: false, zone: "A", type: "Car" },
//           { id: 3, code: "B1", x: 77.2097, y: 28.6145, is_occupied: false, is_reserved: true, zone: "B", type: "EV" },
//         ]);
//       });
//   }, []);

//   /* ------------------------------------------------
//      Live slot updates
//   -------------------------------------------------*/
//   useEffect(() => {
//     return connectSocket(msg => {
//       if (msg.type === "slots_update") {
//         setSlots(msg.slots);
//       }
//     });
//   }, []);

//   /* ------------------------------------------------
//      Live vehicle updates
//   -------------------------------------------------*/
//   useEffect(() => {
//     return connectVehicleUpdates(msg => {
//       if (msg.type === "vehicle_position") {
//         setVehicles(prev => [
//           ...prev.filter(v => v.vehicle_id !== msg.vehicle_id),
//           msg
//         ]);
//       }
//     });
//   }, []);

//   /* ------------------------------------------------
//      Force release slot
//   -------------------------------------------------*/
//   const forceRelease = async (slot) => {
//     try {
//       await api.post("/admin/force-release/", { slot: slot.code });
//       alert(`Slot ${slot.code} released`);
//     } catch {
//       // fallback if backend is offline
//       setSlots(prev =>
//         prev.map(s =>
//           s.id === slot.id
//             ? { ...s, is_occupied: false, is_reserved: false }
//             : s
//         )
//       );
//       alert(`Simulated release of ${slot.code}`);
//     }
//   };

//   /* ------------------------------------------------
//      UI
//   -------------------------------------------------*/
//   return (
//     <>
//       <Navbar />

//       <DashboardBackground>
//         <div className="pt-16 h-[calc(100vh-64px)] flex text-white">

//           {/* ================= MAP ================= */}
//           <div className="flex-1 relative">
//             <MapContainer
//               center={[28.6139, 77.209]}
//               zoom={17}
//               className="absolute inset-0 w-full h-full rounded-l-xl"
//             >
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//               {/* Slots */}
//               {slots.map(slot => (
//                 <Marker
//                   key={slot.id}
//                   position={[slot.y, slot.x]}
//                   icon={
//                     slot.is_occupied
//                       ? busySlotIcon
//                       : slot.is_reserved
//                       ? reservedIcon
//                       : freeSlotIcon
//                   }
//                 >
//                   <Popup>
//                     <b>Slot {slot.code}</b><br />
//                     Zone: {slot.zone}<br />
//                     Type: {slot.type}<br />
//                     Status:{" "}
//                     {slot.is_occupied
//                       ? "Occupied"
//                       : slot.is_reserved
//                       ? "Reserved"
//                       : "Free"}
//                     <br />
//                     {slot.is_occupied && (
//                       <button
//                         onClick={() => forceRelease(slot)}
//                         className="mt-2 bg-red-600 text-white px-3 py-1 rounded w-full"
//                       >
//                         Force Release
//                       </button>
//                     )}
//                   </Popup>
//                 </Marker>
//               ))}

//               {/* Vehicles */}
//               {vehicles.map(v => (
//                 <Marker key={v.vehicle_id} position={[v.y, v.x]} icon={carIcon}>
//                   <Popup>
//                     <b>Vehicle {v.vehicle_id}</b><br />
//                     Speed: {v.speed || 0} km/h<br />
//                     Heading: {v.heading || 0}°
//                   </Popup>
//                 </Marker>
//               ))}
//             </MapContainer>
//           </div>

//           {/* ================= RIGHT PANEL ================= */}
//           <div className="w-[360px] bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto">

//             <h2 className="text-xl font-bold mb-4">🛠 Admin Control Panel</h2>

//             {slots.map(slot => (
//               <div
//                 key={slot.id}
//                 className={`p-3 mb-3 rounded-lg shadow ${
//                   slot.is_occupied
//                     ? "bg-red-600"
//                     : slot.is_reserved
//                     ? "bg-yellow-500 text-black"
//                     : "bg-emerald-600"
//                 }`}
//               >
//                 <div className="font-bold">Slot {slot.code}</div>
//                 <div className="text-sm">
//                   {slot.is_occupied
//                     ? "Occupied"
//                     : slot.is_reserved
//                     ? "Reserved"
//                     : "Available"}
//                 </div>

//                 {slot.is_occupied && (
//                   <button
//                     onClick={() => forceRelease(slot)}
//                     className="mt-2 bg-black/70 text-white px-2 py-1 rounded w-full"
//                   >
//                     Force Exit
//                   </button>
//                 )}
//               </div>
//             ))}

//           </div>
//         </div>
//       </DashboardBackground>
//     </>
//   );
// }




































































































// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import { connectSocket, connectVehicleUpdates } from "../../utils/socket";
// import { carIcon, freeSlotIcon, busySlotIcon, reservedIcon } from "../../utils/leafletIcon";
// import Navbar from "../../components/common/Navbar";
// import DashboardBackground from "../../components/common/DashboardBackground";

// export default function AdminLiveMap() {
//   const [slots, setSlots] = useState([]);
//   const [vehicles, setVehicles] = useState([]);

//   // Load slots
//   useEffect(() => {
//     api.get("/slots/")
//       .then(res => setSlots(res.data))
//       .catch(() => {
//         setSlots([
//           { id: 1, code: "A1", x: 77.2091, y: 28.6139, is_occupied: true, is_reserved: false, zone: "A", type: "Car" },
//           { id: 2, code: "A2", x: 77.2094, y: 28.6142, is_occupied: false, is_reserved: false, zone: "A", type: "Car" },
//           { id: 3, code: "B1", x: 77.2097, y: 28.6145, is_occupied: false, is_reserved: true, zone: "B", type: "EV" },
//         ]);
//       });
//   }, []);

//   // Live slot updates
//   useEffect(() => {
//     return connectSocket(data => {
//       if (data.type === "slots_update") {
//         setSlots(data.slots);
//       }
//     });
//   }, []);

//   // Live vehicle updates
//   useEffect(() => {
//     return connectVehicleUpdates(data => {
//       if (data.type === "vehicle_position") {
//         setVehicles(prev => [
//           ...prev.filter(v => v.vehicle_id !== data.vehicle_id),
//           data
//         ]);
//       }
//     });
//   }, []);

//   // Force free slot
//   const forceRelease = async (slot) => {
//     try {
//       await api.post("/admin/force-release/", { slot: slot.code });
//       alert(`Slot ${slot.code} released`);
//     } catch {
//       alert(`Simulating force release of ${slot.code}`);
//       setSlots(prev =>
//         prev.map(s =>
//           s.id === slot.id
//             ? { ...s, is_occupied: false, is_reserved: false }
//             : s
//         )
//       );
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <DashboardBackground>
//         <div className="h-screen flex">

//           {/* Map */}
//           <div className="w-3/4 h-full">
//             <MapContainer center={[28.6139, 77.209]} zoom={17} className="h-full w-full rounded-xl">
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//               {slots.map(slot => (
//                 <Marker
//                   key={slot.id}
//                   position={[slot.y, slot.x]}
//                   icon={
//                     slot.is_occupied
//                       ? busySlotIcon
//                       : slot.is_reserved
//                       ? reservedIcon
//                       : freeSlotIcon
//                   }
//                 >
//                   <Popup>
//                     <b>Slot {slot.code}</b><br />
//                     Status: {slot.is_occupied ? "Occupied" : slot.is_reserved ? "Reserved" : "Free"}<br />
//                     Type: {slot.type}<br />
//                     Zone: {slot.zone}<br />
//                     {slot.is_occupied && (
//                       <button
//                         onClick={() => forceRelease(slot)}
//                         className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
//                       >
//                         Force Release
//                       </button>
//                     )}
//                   </Popup>
//                 </Marker>
//               ))}

//               {vehicles.map(v => (
//                 <Marker key={v.vehicle_id} position={[v.y, v.x]} icon={carIcon}>
//                   <Popup>
//                     Vehicle: {v.vehicle_id}<br />
//                     Speed: {v.speed} km/h<br />
//                     Heading: {v.heading}°
//                   </Popup>
//                 </Marker>
//               ))}
//             </MapContainer>
//           </div>

//           {/* Admin Panel */}
//           <div className="w-1/4 bg-slate-900 text-white p-4 overflow-y-auto border-l border-slate-700">
//             <h2 className="text-xl font-bold mb-4">Admin Control Panel</h2>

//             {slots.map(slot => (
//               <div
//                 key={slot.id}
//                 className={`p-3 mb-3 rounded-lg ${
//                   slot.is_occupied
//                     ? "bg-red-600"
//                     : slot.is_reserved
//                     ? "bg-yellow-500 text-black"
//                     : "bg-green-600"
//                 }`}
//               >
//                 <div className="font-bold">Slot {slot.code}</div>
//                 <div>
//                   {slot.is_occupied
//                     ? "Occupied"
//                     : slot.is_reserved
//                     ? "Reserved"
//                     : "Available"}
//                 </div>

//                 {slot.is_occupied && (
//                   <button
//                     onClick={() => forceRelease(slot)}
//                     className="mt-2 bg-black text-white px-2 py-1 rounded"
//                   >
//                     Force Exit
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//         </div>
//       </DashboardBackground>
//     </>
//   );
// }
