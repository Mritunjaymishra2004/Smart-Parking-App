import {
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";

import api from "../api/axios";

import {
  connectSocket,
  connectVehicleUpdates,
  disconnectSocket,
} from "../utils/socket";

// ======================================================
// FALLBACK SLOT
// ======================================================

const FALLBACK_SLOTS = [
  {
    id: 1,
    code: "A1",
    x: 77.2001,
    y: 28.6101,
    status: "AVAILABLE",
  },
];

// ======================================================
// HOOK
// ======================================================

export default function useParkingData() {

  // ====================================================
  // STATE
  // ====================================================

  const [slots, setSlots] =
    useState([]);

  const [vehicles, setVehicles] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  // ====================================================
  // REFS
  // ====================================================

  const slotSocketInitialized =
    useRef(false);

  const vehicleSocketInitialized =
    useRef(false);

  // ====================================================
  // FETCH SLOTS
  // ====================================================

  useEffect(() => {

    let mounted = true;

    let retryCount = 0;

    const fetchSlots =
      async () => {

        try {

          const response =
            await api.get(
              "/slots/"
            );

          if (!mounted) return;

          const safeData =
            Array.isArray(
              response.data
            )
              ? response.data
              : [];

          setSlots(
            safeData
          );

        } catch (error) {

          console.warn(
            "Slot fetch failed",
            error
          );

          // ==========================================
          // RETRY
          // ==========================================

          if (
            retryCount < 2
          ) {

            retryCount++;

            setTimeout(
              fetchSlots,
              2000
            );

            return;
          }

          // ==========================================
          // FALLBACK
          // ==========================================

          if (mounted) {

            setSlots(
              FALLBACK_SLOTS
            );
          }

        } finally {

          if (mounted) {

            setLoading(
              false
            );
          }
        }
      };

    fetchSlots();

    return () => {

      mounted = false;
    };

  }, []);

  // ====================================================
  // SLOT WEBSOCKET
  // ====================================================

  useEffect(() => {

    if (
      slotSocketInitialized.current
    ) {

      return;
    }

    slotSocketInitialized.current =
      true;

    connectSocket(
      (message) => {

        if (!message) return;

        // ==========================================
        // FULL SLOT UPDATE
        // ==========================================

        if (
          message.type ===
          "slots_update"
        ) {

          if (
            Array.isArray(
              message.slots
            )
          ) {

            setSlots(
              message.slots
            );
          }

          return;
        }

        // ==========================================
        // SINGLE SLOT UPDATE
        // ==========================================

        if (
          message.type ===
          "slot_update"
        ) {

          setSlots(
            (prev) =>

              prev.map(
                (slot) =>

                  slot.id ===
                  message.slot.id

                    ? {
                        ...slot,
                        ...message.slot,
                      }

                    : slot
              )
          );
        }
      }
    );

    return () => {

      slotSocketInitialized.current =
        false;
    };

  }, []);

  // ====================================================
  // VEHICLE WEBSOCKET
  // ====================================================

  useEffect(() => {

    if (
      vehicleSocketInitialized.current
    ) {

      return;
    }

    vehicleSocketInitialized.current =
      true;

    connectVehicleUpdates(
      (message) => {

        if (
          !message ||

          message.type !==
            "vehicle_position" ||

          !message.vehicle_id
        ) {

          return;
        }

        setVehicles(
          (prev) => {

            const updated = {

              ...prev,

              [message.vehicle_id]:
                message,
            };

            // ======================================
            // LIMIT MEMORY
            // ======================================

            const keys =
              Object.keys(
                updated
              );

            if (
              keys.length > 100
            ) {

              delete updated[
                keys[0]
              ];
            }

            return updated;
          }
        );
      }
    );

    return () => {

      vehicleSocketInitialized.current =
        false;
    };

  }, []);

  // ====================================================
  // CLEAN VEHICLE ARRAY
  // ====================================================

  const vehicleList =
    useMemo(() => {

      return Object.values(
        vehicles
      ).filter(
        (vehicle) => (
          vehicle?.x &&
          vehicle?.y
        )
      );

    }, [vehicles]);

  // ====================================================
  // CLEANUP
  // ====================================================

  useEffect(() => {

    return () => {

      disconnectSocket();
    };

  }, []);

  // ====================================================
  // RETURN
  // ====================================================

  return {

    slots,

    vehicles:
      vehicleList,

    loading,
  };
}

















// import { useEffect, useState, useRef, useMemo } from "react";
// import api from "../services/api";
// import { connectSocket, connectVehicleUpdates, disconnectSocket } from "../utils/socket";

// export default function useParkingData() {
//   const [slots, setSlots] = useState([]);
//   const [vehicles, setVehicles] = useState({});
//   const [loading, setLoading] = useState(true);

//   const socketInitialized = useRef(false);
//   const vehicleSocketInitialized = useRef(false);

//   // ===============================
//   // 🔹 INITIAL SLOT FETCH (WITH RETRY)
//   // ===============================
//   useEffect(() => {
//     let mounted = true;
//     let retryCount = 0;

//     const fetchSlots = async () => {
//       try {
//         const res = await api.get("/slots/");
//         if (mounted) {
//           setSlots(res.data || []);
//           setLoading(false);
//         }
//       } catch (err) {
//         console.warn("Slots fetch failed, retrying...");

//         if (retryCount < 2) {
//           retryCount++;
//           setTimeout(fetchSlots, 2000);
//         } else {
//           // Fallback demo data
//           setSlots([
//             {
//               id: 1,
//               code: "A1",
//               x: 77.2001,
//               y: 28.6101,
//               is_occupied: false,
//               is_reserved: false,
//             },
//           ]);
//           setLoading(false);
//         }
//       }
//     };

//     fetchSlots();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // ===============================
//   // 🔹 SLOT SOCKET (SAFE)
//   // ===============================
//   useEffect(() => {
//     if (socketInitialized.current) return;
//     socketInitialized.current = true;

//     connectSocket((msg) => {
//       if (msg?.type === "slots_update" && Array.isArray(msg.slots)) {
//         setSlots(msg.slots);
//       }
//     });

//     return () => {
//       disconnectSocket();
//       socketInitialized.current = false;
//     };
//   }, []);

//   // ===============================
//   // 🔹 VEHICLE SOCKET (WITH LIMIT)
//   // ===============================
//   useEffect(() => {
//     if (vehicleSocketInitialized.current) return;
//     vehicleSocketInitialized.current = true;

//     connectVehicleUpdates((msg) => {
//       if (msg?.type === "vehicle_position" && msg.vehicle_id) {
//         setVehicles((prev) => {
//           const updated = {
//             ...prev,
//             [msg.vehicle_id]: msg,
//           };

//           // Limit vehicles to avoid memory leak
//           const keys = Object.keys(updated);
//           if (keys.length > 50) {
//             delete updated[keys[0]];
//           }

//           return updated;
//         });
//       }
//     });

//     return () => {
//       disconnectSocket();
//       vehicleSocketInitialized.current = false;
//     };
//   }, []);

//   // ===============================
//   // 🔹 CLEAN VEHICLE LIST
//   // ===============================
//   const vehicleList = useMemo(() => Object.values(vehicles), [vehicles]);

//   return {
//     slots,
//     vehicles: vehicleList,
//     loading,
//   };
// }



