import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Car,
  Activity,
  MapPin,
  Wifi,
} from "lucide-react";

import {
  useWebSocket,
} from "../../websocket/WebSocketContext";

// ======================================================
// VEHICLE CARD
// ======================================================

function VehicleCard({

  vehicle,

}) {

  return (

    <div className="
      flex
      items-center
      justify-between

      p-4

      rounded-2xl

      bg-slate-800/50

      border
      border-slate-700

      hover:border-emerald-500/20
      hover:bg-slate-800/70

      transition-all
      duration-200
    ">

      {/* ========================================== */}
      {/* LEFT */}
      {/* ========================================== */}

      <div className="
        flex
        items-center
        gap-4
      ">

        {/* ====================================== */}
        {/* ICON */}
        {/* ====================================== */}

        <div className="
          w-12
          h-12

          rounded-xl

          bg-emerald-500/10

          border
          border-emerald-500/10

          flex
          items-center
          justify-center

          text-emerald-400
        ">

          <Car size={22} />

        </div>

        {/* ====================================== */}
        {/* INFO */}
        {/* ====================================== */}

        <div>

          <h4 className="
            font-semibold
            text-white
          ">

            {vehicle.vehicle_id ||
              vehicle.vehicle ||
              "Unknown Vehicle"}

          </h4>

          <div className="
            flex
            items-center
            gap-2

            mt-1

            text-xs
            text-slate-400
          ">

            <MapPin size={13} />

            <span>

              {Number(
                vehicle.latitude ||
                vehicle.lat ||
                0
              ).toFixed(5)}

              ,

              {" "}

              {Number(
                vehicle.longitude ||
                vehicle.lng ||
                0
              ).toFixed(5)}

            </span>

          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* RIGHT */}
      {/* ========================================== */}

      <div className="
        flex
        flex-col
        items-end
        gap-2
      ">

        {/* ====================================== */}
        {/* LIVE STATUS */}
        {/* ====================================== */}

        <div className="
          flex
          items-center
          gap-2

          px-3
          py-1

          rounded-lg

          bg-emerald-500/10
          text-emerald-400

          text-xs
          font-medium
        ">

          <Wifi size={13} />

          Live

        </div>

        {/* ====================================== */}
        {/* SPEED */}
        {/* ====================================== */}

        <div className="
          flex
          items-center
          gap-1

          text-xs
          text-slate-400
        ">

          <Activity size={12} />

          {vehicle.speed || 0}
          km/h

        </div>

      </div>

    </div>
  );
}

// ======================================================
// EMPTY STATE
// ======================================================

function EmptyState() {

  return (

    <div className="
      flex
      flex-col
      items-center
      justify-center

      py-14

      text-center
    ">

      <div className="
        w-16
        h-16

        rounded-2xl

        bg-slate-800

        flex
        items-center
        justify-center

        text-slate-500

        mb-4
      ">

        <Car size={28} />

      </div>

      <h3 className="
        text-lg
        font-semibold
        text-white
      ">

        No Live Vehicles

      </h3>

      <p className="
        text-sm
        text-slate-400
        mt-2
      ">

        Waiting for vehicle telemetry...
      </p>

    </div>
  );
}

// ======================================================
// VEHICLES PANEL
// ======================================================

export default function VehiclesPanel() {

  // ====================================================
  // SOCKET
  // ====================================================

  const {
    lastMessage,
    connected,
  } = useWebSocket();

  // ====================================================
  // STATE
  // ====================================================

  const [vehicles, setVehicles] =
    useState({});

  // ====================================================
  // LIVE VEHICLE UPDATES
  // ====================================================

  useEffect(() => {

    if (!lastMessage) return;

    if (
      lastMessage.type ===
      "vehicle_position"
    ) {

      const vehicleId =

        lastMessage.vehicle_id ||

        lastMessage.vehicle;

      if (!vehicleId) return;

      setVehicles((prev) => ({

        ...prev,

        [vehicleId]:
          lastMessage,

      }));
    }

  }, [lastMessage]);

  // ====================================================
  // SORTED VEHICLE LIST
  // ====================================================

  const vehicleList =
    useMemo(() => {

      return Object.values(
        vehicles
      ).sort(

        (a, b) => {

          return (
            (b.speed || 0) -
            (a.speed || 0)
          );
        }
      );

    }, [vehicles]);

  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      rounded-2xl

      border
      border-slate-800

      bg-slate-900/80
      backdrop-blur-xl

      p-6

      shadow-lg
    ">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="
        flex
        items-center
        justify-between

        mb-6
      ">

        <div>

          <h3 className="
            text-xl
            font-bold
            text-white
          ">

            Live Vehicles

          </h3>

          <p className="
            text-sm
            text-slate-400
            mt-1
          ">

            Real-time vehicle monitoring
          </p>

        </div>

        {/* ====================================== */}
        {/* STATUS */}
        {/* ====================================== */}

        <div className={`
          flex
          items-center
          gap-2

          px-3
          py-2

          rounded-xl

          text-sm
          font-medium

          ${
            connected

              ? `
                bg-emerald-500/10
                text-emerald-400
              `

              : `
                bg-red-500/10
                text-red-400
              `
          }
        `}>

          <span className={`
            w-2
            h-2
            rounded-full

            ${
              connected

                ? "bg-emerald-400"

                : "bg-red-400"
            }
          `} />

          {connected
            ? "Live"
            : "Offline"
          }

        </div>

      </div>

      {/* ========================================== */}
      {/* COUNT */}
      {/* ========================================== */}

      <div className="
        mb-5

        flex
        items-center
        justify-between

        text-sm
      ">

        <span className="
          text-slate-400
        ">

          Active Vehicles

        </span>

        <span className="
          text-white
          font-semibold
        ">

          {vehicleList.length}

        </span>

      </div>

      {/* ========================================== */}
      {/* VEHICLES */}
      {/* ========================================== */}

      <div className="
        space-y-3

        max-h-[450px]
        overflow-y-auto
      ">

        {vehicleList.length === 0 ? (

          <EmptyState />

        ) : (

          vehicleList.map(
            (vehicle) => (

              <VehicleCard
                key={
                  vehicle.vehicle_id ||
                  vehicle.vehicle
                }

                vehicle={vehicle}
              />
            )
          )
        )}

      </div>

    </div>
  );
}







// import { useEffect, useState } from "react";
// import { connectSocket } from "../../utils/socket";

// export default function VehiclesPanel() {
//   const [vehicles, setVehicles] = useState([]);

//   useEffect(() => {
//     connectSocket(
//       () => {},
//       (data) => {
//         setVehicles((prev) => [
//           ...prev.filter((v) => v.vehicle !== data.vehicle),
//           data,
//         ]);
//       }
//     );
//   }, []);

//   return (
//     <div className="glass p-6 rounded-xl">
//       <h3 className="text-lg font-semibold mb-4">
//         Live Vehicles
//       </h3>

//       {vehicles.length === 0 && (
//         <p className="text-slate-400 text-sm">No live vehicles</p>
//       )}

//       {vehicles.map((v) => (
//         <div
//           key={v.vehicle}
//           className="flex justify-between py-2 border-b border-slate-800 text-sm"
//         >
//           <span className="font-medium">{v.vehicle}</span>
//           <span className="text-emerald-400">
//             {v.latitude}, {v.longitude}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }