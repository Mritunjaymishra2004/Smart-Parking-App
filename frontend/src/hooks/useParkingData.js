import {
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";

import api from "../api/axios";

import {

  connectWebSocket,
  disconnectWebSocket,
  subscribe,

} from "../websocket/websocketService";


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

  const websocketInitialized =
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
            "Slot fetch failed:",
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
  // WEBSOCKET
  // ====================================================

  useEffect(() => {

    if (
      websocketInitialized.current
    ) {

      return;
    }

    websocketInitialized.current =
      true;

    // ==============================================
    // CONNECT
    // ==============================================

    connectWebSocket();

    // ==============================================
    // SUBSCRIBE
    // ==============================================

    const unsubscribe =
      subscribe(
        (message) => {

          if (!message) {

            return;
          }

          // ========================================
          // FULL SLOT UPDATE
          // ========================================

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

          // ========================================
          // SINGLE SLOT UPDATE
          // ========================================

          if (
            message.type ===
            "slot_update"
          ) {

            if (
              message.slot
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

            return;
          }

          // ========================================
          // VEHICLE POSITION UPDATE
          // ========================================

          if (
            message.type ===
            "vehicle_position"
          ) {

            if (
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

                // ==================================
                // LIMIT MEMORY
                // ==================================

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
        }
      );

    // ==============================================
    // CLEANUP
    // ==============================================

    return () => {

      unsubscribe();

      disconnectWebSocket();

      websocketInitialized.current =
        false;
    };

  }, []);

  // ====================================================
  // CLEAN VEHICLE LIST
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
  // RETURN
  // ====================================================

  return {

    slots,

    vehicles:
      vehicleList,

    loading,
  };
}