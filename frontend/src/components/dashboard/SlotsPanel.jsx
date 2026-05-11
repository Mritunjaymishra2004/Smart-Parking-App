// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import { connectSocket } from "../../utils/socket";

// export default function SlotsPanel() {
//   const [slots, setSlots] = useState([]);

//   // Load slots from backend
//   useEffect(() => {
//     api.get("/slots/")
//       .then((res) => setSlots(res.data))
//       .catch((err) => console.error("Slots error", err));

//     // WebSocket live updates
//     connectSocket(
//       (update) => {
//         setSlots((prev) =>
//           prev.map((s) =>
//             s.id === update.slot_id ? { ...s, status: update.status } : s
//           )
//         );
//       },
//       () => {}
//     );
//   }, []);

//   return (
//     <div className="glass p-6 rounded-xl">
//       <h3 className="text-lg font-semibold mb-4">
//         Live Parking Slots
//       </h3>

//       <div className="grid grid-cols-6 gap-3">
//         {slots.map((slot) => (
//           <div
//             key={slot.id}
//             className={`p-3 text-center rounded-lg font-bold cursor-pointer transition-all
//             ${
//               slot.status === "Free"
//                 ? "bg-emerald-500/20 text-emerald-400 hover:scale-105 hover:shadow-emerald-500/40"
//                 : "bg-red-500/20 text-red-400"
//             }`}
//           >
//             {slot.slot_number}
//             <p className="text-xs mt-1">{slot.status}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }





import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import { connectSocket } from "../../utils/socket";

export default function SlotsPanel() {
  const [slots, setSlots] = useState([]);

  // ===============================
  // 🔹 LOAD SLOTS
  // ===============================
  useEffect(() => {
    api.get("/slots/")
      .then((res) => setSlots(res.data))
      .catch((err) => console.error("Slots error", err));
  }, []);

  // ===============================
  // 🔥 SOCKET LIVE UPDATE
  // ===============================
  useEffect(() => {
    connectSocket((update) => {
      if (update.type === "slots_update") {
        setSlots(update.slots); // 🔥 full sync (best)
      }
    });
  }, []);

  // ===============================
  // 🔥 STATS CALCULATION
  // ===============================
  const stats = useMemo(() => {
    let total = slots.length;
    let occupied = slots.filter(s => s.is_occupied).length;
    let reserved = slots.filter(s => s.is_reserved).length;
    let free = total - occupied - reserved;

    return { total, occupied, reserved, free };
  }, [slots]);

  // ===============================
  // 🔹 SLOT COLOR LOGIC
  // ===============================
  const getSlotStyle = (slot) => {
    if (slot.is_occupied)
      return "bg-red-500/20 text-red-400 border border-red-500/30";

    if (slot.is_reserved)
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";

    return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:scale-105 hover:shadow-emerald-500/40";
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">

      <h3 className="text-lg font-semibold mb-4">
        Live Parking Slots
      </h3>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-4 gap-4 mb-6 text-center text-sm">
        <div className="bg-slate-800 p-3 rounded">
          <p className="text-slate-400">Total</p>
          <p className="text-white font-bold">{stats.total}</p>
        </div>

        <div className="bg-emerald-500/10 p-3 rounded">
          <p className="text-emerald-400">Free</p>
          <p className="font-bold">{stats.free}</p>
        </div>

        <div className="bg-yellow-500/10 p-3 rounded">
          <p className="text-yellow-400">Reserved</p>
          <p className="font-bold">{stats.reserved}</p>
        </div>

        <div className="bg-red-500/10 p-3 rounded">
          <p className="text-red-400">Occupied</p>
          <p className="font-bold">{stats.occupied}</p>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-6 gap-3">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`p-3 text-center rounded-lg font-bold cursor-pointer transition-all ${getSlotStyle(slot)}`}
          >
            {slot.code || slot.slot_number}

            <p className="text-xs mt-1">
              {slot.is_occupied
                ? "Occupied"
                : slot.is_reserved
                ? "Reserved"
                : "Free"}
            </p>
          </div>
        ))}
      </div>

      {/* ================= EMPTY ================= */}
      {slots.length === 0 && (
        <p className="text-slate-400 text-sm mt-4">
          No slots available
        </p>
      )}
    </div>
  );
}