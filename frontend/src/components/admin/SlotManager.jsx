import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  ParkingCircle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import api from "../../services/api";

import {
  useWebSocket,
} from "../../websocket/WebSocketContext";

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({

  slot,

}) {

  // ====================================================
  // STATUS
  // ====================================================

  if (slot.is_blocked) {

    return (

      <div className="
        inline-flex
        items-center
        gap-2

        px-3
        py-1

        rounded-lg

        bg-yellow-500/10
        text-yellow-400

        text-xs
        font-semibold
      ">

        <ShieldAlert size={14} />

        BLOCKED

      </div>
    );
  }

  const isFree =

    !slot.is_reserved &&
    !slot.is_occupied;

  return (

    <div className={`
      inline-flex
      items-center
      gap-2

      px-3
      py-1

      rounded-lg

      text-xs
      font-semibold

      ${
        isFree

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

      {isFree ? (

        <CheckCircle2 size={14} />

      ) : (

        <XCircle size={14} />

      )}

      {isFree
        ? "FREE"
        : "OCCUPIED"
      }

    </div>
  );
}

// ======================================================
// LOADING STATE
// ======================================================

function LoadingTable() {

  return (

    <div className="
      space-y-3
      animate-pulse
    ">

      {[1, 2, 3, 4, 5].map(
        (i) => (

          <div
            key={i}

            className="
              h-14
              rounded-xl
              bg-slate-800/60
            "
          />
        )
      )}

    </div>
  );
}

// ======================================================
// SLOT MANAGER
// ======================================================

export default function SlotManager() {

  // ====================================================
  // SOCKET
  // ====================================================

  const {
    lastMessage,
  } = useWebSocket();

  // ====================================================
  // STATE
  // ====================================================

  const [slots, setSlots] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // ====================================================
  // LOAD SLOTS
  // ====================================================

  const loadSlots =
    async () => {

      try {

        const response =
          await api.get(
            "/slots/"
          );

        setSlots(
          response.data || []
        );

      } catch (error) {

        console.error(
          "Slot load failed",
          error
        );

        setSlots([]);

      } finally {

        setLoading(false);
      }
    };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    loadSlots();

  }, []);

  // ====================================================
  // LIVE SLOT UPDATES
  // ====================================================

  useEffect(() => {

    if (!lastMessage) return;

    if (
      lastMessage.type ===
      "slots_update"
    ) {

      if (
        Array.isArray(
          lastMessage.slots
        )
      ) {

        setSlots(
          lastMessage.slots
        );
      }
    }

  }, [lastMessage]);

  // ====================================================
  // FREE SLOT
  // ====================================================

  const freeSlot =
    async (slot) => {

      try {

        // ==========================================
        // OPTIMISTIC UPDATE
        // ==========================================

        setSlots((prev) =>

          prev.map((s) =>

            s.id === slot.id

              ? {
                  ...s,
                  is_reserved: false,
                  is_occupied: false,
                }

              : s
          )
        );

        await api.post(
          "/admin/free-slot/",
          {
            slot_id: slot.id,
          }
        );

      } catch {

        loadSlots();

        alert(
          "Cannot free slot"
        );
      }
    };

  // ====================================================
  // BLOCK SLOT
  // ====================================================

  const blockSlot =
    async (slot) => {

      try {

        setSlots((prev) =>

          prev.map((s) =>

            s.id === slot.id

              ? {
                  ...s,
                  is_blocked: true,
                }

              : s
          )
        );

        await api.post(
          "/admin/block-slot/",
          {
            slot_id: slot.id,
          }
        );

      } catch {

        loadSlots();

        alert(
          "Cannot block slot"
        );
      }
    };

  // ====================================================
  // FILTERED SLOTS
  // ====================================================

  const filteredSlots =
    useMemo(() => {

      return slots.filter(
        (slot) => {

          const keyword =
            search.toLowerCase();

          return (

            slot.code
              ?.toLowerCase()
              .includes(keyword)

            ||

            slot.lot_name
              ?.toLowerCase()
              .includes(keyword)

            ||

            slot.zone_label
              ?.toLowerCase()
              .includes(keyword)
          );
        }
      );

    }, [slots, search]);

  // ====================================================
  // ANALYTICS
  // ====================================================

  const stats =
    useMemo(() => {

      const total =
        slots.length;

      const occupied =
        slots.filter(

          (s) =>

            s.is_reserved ||
            s.is_occupied
        ).length;

      const free =
        total - occupied;

      const blocked =
        slots.filter(
          (s) => s.is_blocked
        ).length;

      return {
        total,
        occupied,
        free,
        blocked,
      };

    }, [slots]);

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
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between

        gap-4

        mb-6
      ">

        <div>

          <h2 className="
            text-2xl
            font-bold
            text-white
          ">

            Slot Control Center

          </h2>

          <p className="
            text-sm
            text-slate-400
            mt-1
          ">

            Real-time parking slot management
          </p>

        </div>

        {/* ====================================== */}
        {/* SEARCH */}
        {/* ====================================== */}

        <div className="
          flex
          items-center
          gap-2

          bg-slate-800/70

          border
          border-slate-700

          px-4
          py-3

          rounded-xl

          min-w-[260px]
        ">

          <Search
            size={18}
            className="
              text-slate-400
            "
          />

          <input
            type="text"

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            placeholder="Search slots..."

            className="
              bg-transparent
              outline-none
              text-sm
              w-full

              placeholder:text-slate-500
            "
          />

        </div>

      </div>

      {/* ========================================== */}
      {/* STATS */}
      {/* ========================================== */}

      <div className="
        grid
        grid-cols-2
        lg:grid-cols-4

        gap-4

        mb-6
      ">

        {[
          {
            label: "Total",
            value: stats.total,
          },

          {
            label: "Free",
            value: stats.free,
          },

          {
            label: "Occupied",
            value: stats.occupied,
          },

          {
            label: "Blocked",
            value: stats.blocked,
          },
        ].map((item) => (

          <div
            key={item.label}

            className="
              rounded-xl

              bg-slate-800/60

              border
              border-slate-700

              p-4
            "
          >

            <p className="
              text-xs
              uppercase
              tracking-wider
              text-slate-400
            ">

              {item.label}

            </p>

            <h3 className="
              text-2xl
              font-bold
              text-white
              mt-2
            ">

              {item.value}

            </h3>

          </div>
        ))}

      </div>

      {/* ========================================== */}
      {/* TABLE */}
      {/* ========================================== */}

      {loading ? (

        <LoadingTable />

      ) : (

        <div className="
          overflow-auto
        ">

          <table className="
            w-full
            text-sm
          ">

            <thead>

              <tr className="
                border-b
                border-slate-800
                text-slate-400
              ">

                <th className="
                  p-4
                  text-left
                ">
                  Slot
                </th>

                <th className="
                  p-4
                  text-left
                ">
                  Lot
                </th>

                <th className="
                  p-4
                  text-left
                ">
                  Zone
                </th>

                <th className="
                  p-4
                  text-left
                ">
                  Status
                </th>

                <th className="
                  p-4
                  text-right
                ">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredSlots.map(
                (slot) => {

                  const isFree =

                    !slot.is_reserved &&
                    !slot.is_occupied;

                  return (

                    <tr
                      key={slot.id}

                      className="
                        border-b
                        border-slate-800/60

                        hover:bg-slate-800/40

                        transition
                      "
                    >

                      <td className="
                        p-4
                      ">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <div className="
                            w-10
                            h-10

                            rounded-xl

                            bg-emerald-500/10

                            flex
                            items-center
                            justify-center

                            text-emerald-400
                          ">

                            <ParkingCircle
                              size={18}
                            />

                          </div>

                          <div>

                            <p className="
                              font-semibold
                              text-white
                            ">

                              {slot.code}

                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="
                        p-4
                        text-slate-300
                      ">

                        {slot.lot_name}

                      </td>

                      <td className="
                        p-4
                        text-slate-400
                      ">

                        {slot.zone_label}

                      </td>

                      <td className="
                        p-4
                      ">

                        <StatusBadge
                          slot={slot}
                        />

                      </td>

                      <td className="
                        p-4
                        text-right
                      ">

                        <div className="
                          flex
                          justify-end
                          gap-2
                        ">

                          {!isFree && (

                            <button
                              onClick={() =>
                                freeSlot(
                                  slot
                                )
                              }

                              className="
                                px-4
                                py-2

                                rounded-xl

                                bg-emerald-500/10
                                text-emerald-400

                                hover:bg-emerald-500/20

                                text-xs
                                font-semibold

                                transition
                              "
                            >

                              Force Free

                            </button>
                          )}

                          {isFree && (

                            <button
                              onClick={() =>
                                blockSlot(
                                  slot
                                )
                              }

                              className="
                                px-4
                                py-2

                                rounded-xl

                                bg-red-500/10
                                text-red-400

                                hover:bg-red-500/20

                                text-xs
                                font-semibold

                                transition
                              "
                            >

                              Block

                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

          {/* ====================================== */}
          {/* EMPTY */}
          {/* ====================================== */}

          {filteredSlots.length === 0 && (

            <div className="
              py-16
              text-center
            ">

              <ParkingCircle
                size={40}
                className="
                  mx-auto
                  text-slate-600
                  mb-4
                "
              />

              <h3 className="
                text-lg
                font-semibold
                text-white
              ">

                No Slots Found

              </h3>

              <p className="
                text-sm
                text-slate-400
                mt-2
              ">

                Try another search keyword
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
}





















// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import { connectSocket } from "../../utils/socket";

// export default function SlotManager() {
//   const [slots, setSlots] = useState([]);

//   //  Load slots from backend
//   const loadSlots = async () => {
//     try {
//       const res = await api.get("/slots/");
//       setSlots(res.data);
//     } catch (err) {
//       console.error("Slots load error", err);
//       setSlots([]);
//     }
//   };

//   //  Initial load
//   useEffect(() => {
//     loadSlots();
//   }, []);

//   //  Live WebSocket updates (single shared socket — NO cleanup)
//   useEffect(() => {
//     connectSocket((data) => {
//       if (data.type === "slots_update" || data.type === "refresh") {
//         loadSlots();
//       }
//     });
//   }, []);

//   //  Force free slot
//   const freeSlot = async (slot) => {
//     try {
//       await api.post("/admin/free-slot/", {
//         slot_id: slot.id,
//       });
//       loadSlots();
//     } catch {
//       alert("Cannot free this slot");
//     }
//   };

//   //  Block slot
//   const blockSlot = async (slot) => {
//     try {
//       await api.post("/admin/block-slot/", {
//         slot_id: slot.id,
//       });
//       loadSlots();
//     } catch {
//       alert("Cannot block this slot");
//     }
//   };

//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
//       <h2 className="text-lg font-semibold mb-4">
//         Admin Slot Control
//       </h2>

//       <div className="overflow-auto">
//         <table className="w-full text-sm">
//           <thead className="text-slate-400 border-b border-slate-800">
//             <tr>
//               <th className="p-2 text-left">Slot</th>
//               <th className="p-2">Lot</th>
//               <th className="p-2">Zone</th>
//               <th className="p-2">Status</th>
//               <th className="p-2 text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {slots.map((s) => {
//               const isFree = !s.is_reserved && !s.is_occupied;

//               return (
//                 <tr
//                   key={s.id}
//                   className="border-b border-slate-800 hover:bg-slate-800/40"
//                 >
//                   <td className="p-2 font-semibold">{s.code}</td>
//                   <td className="p-2 text-xs text-slate-400">{s.lot_name}</td>
//                   <td className="p-2 text-xs text-slate-400">{s.zone_label}</td>

//                   <td className="p-2">
//                     <span
//                       className={`px-2 py-1 rounded text-xs font-bold ${
//                         isFree
//                           ? "bg-emerald-500/20 text-emerald-400"
//                           : "bg-red-500/20 text-red-400"
//                       }`}
//                     >
//                       {isFree ? "FREE" : "OCCUPIED"}
//                     </span>
//                   </td>

//                   <td className="p-2 text-right space-x-2">
//                     {!isFree && (
//                       <button
//                         onClick={() => freeSlot(s)}
//                         className="px-3 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-700"
//                       >
//                         Force Free
//                       </button>
//                     )}

//                     {isFree && (
//                       <button
//                         onClick={() => blockSlot(s)}
//                         className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700"
//                       >
//                         Block
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {slots.length === 0 && (
//           <p className="text-slate-400 text-sm p-4 text-center">
//             No slots found
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }
