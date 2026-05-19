import {

  MapContainer,

  TileLayer,

  Marker,

  Popup,

} from "react-leaflet";

import {

  useEffect,

  useState,

  useMemo,

  useCallback,

} from "react";

import api from "../../services/api";

import {

  connectSocket,

  connectVehicleUpdates,

} from "../../utils/socket";

import {

  carIcon,

  freeSlotIcon,

  busySlotIcon,

  reservedIcon,

} from "../../utils/leafletIcon";

import Navbar
from "../../components/common/Navbar";

import DashboardBackground
from "../../components/common/DashboardBackground";

import HeatmapLayer
from "../../components/map/HeatmapLayer";

import VehicleTrails
from "../../components/map/VehicleTrails";

import ViolationLayer
from "../../components/map/ViolationLayer";


// ======================================================
// DEFAULT CENTER
// ======================================================

const DEFAULT_CENTER =

  [28.6139, 77.209];


// ======================================================
// SAFE ARRAY
// ======================================================

const safeArray =
  (value) => {

    if (
      Array.isArray(value)
    ) {

      return value;
    }

    if (
      Array.isArray(
        value?.results
      )
    ) {

      return value.results;
    }

    if (
      Array.isArray(
        value?.data
      )
    ) {

      return value.data;
    }

    return [];
  };


// ======================================================
// VALID COORDINATES
// ======================================================

const validCoordinate =
  (value) => {

    return (

      typeof value ===
      "number"

      &&

      !Number.isNaN(value)
    );
  };


// ======================================================
// COMPONENT
// ======================================================

export default function AdminLiveMap() {

  // ====================================================
  // STATE
  // ====================================================

  const [slots,
    setSlots] =
    useState([]);

  const [vehicles,
    setVehicles] =
    useState([]);

  const [violations,
    setViolations] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [message,
    setMessage] =
    useState("");


  // ====================================================
  // LOAD SLOTS
  // ====================================================

  useEffect(() => {

    let mounted = true;

    const loadSlots =
      async () => {

        try {

          const response =
            await api.get(
              "/slots/"
            );

          if (!mounted) {

            return;
          }

          setSlots(

            safeArray(
              response.data
            )
          );

        } catch (error) {

          console.error(
            "Slot load error:",
            error
          );

          setMessage(
            "Using demo slot data"
          );

          if (!mounted) {

            return;
          }

          setSlots([

            {
              id: 1,

              code: "A1",

              x: 77.2091,

              y: 28.6139,

              is_occupied: true,

              is_reserved: false,

              zone: "A",

              type: "Car",
            },

            {
              id: 2,

              code: "A2",

              x: 77.2094,

              y: 28.6142,

              is_occupied: false,

              is_reserved: false,

              zone: "A",

              type: "Car",
            },

            {
              id: 3,

              code: "B1",

              x: 77.2097,

              y: 28.6145,

              is_occupied: false,

              is_reserved: true,

              zone: "B",

              type: "EV",
            },
          ]);

        } finally {

          if (mounted) {

            setLoading(false);
          }
        }
      };

    loadSlots();

    return () => {

      mounted = false;
    };

  }, []);


  // ====================================================
  // SOCKET SLOT UPDATES
  // ====================================================

  useEffect(() => {

    const disconnect =
      connectSocket(
        (msg) => {

          if (
            msg?.type ===
            "slots_update"
          ) {

            setSlots(

              safeArray(
                msg.slots
              )
            );
          }

          if (
            msg?.type ===
            "violation"
          ) {

            setViolations(
              (prev) => [

                ...prev.slice(-20),

                msg,
              ]
            );
          }
        }
      );

    return () => {

      if (
        typeof disconnect ===
        "function"
      ) {

        disconnect();
      }
    };

  }, []);


  // ====================================================
  // VEHICLE UPDATES
  // ====================================================

  useEffect(() => {

    const disconnect =
      connectVehicleUpdates(
        (msg) => {

          if (
            msg?.type !==
            "vehicle_position"
          ) {

            return;
          }

          if (

            !validCoordinate(
              msg?.x
            )

            ||

            !validCoordinate(
              msg?.y
            )

          ) {

            return;
          }

          setVehicles(
            (prev) => {

              const old =
                prev.find(

                  (v) =>

                    v.vehicle_id ===
                    msg.vehicle_id
                );

              return [

                ...prev.filter(

                  (v) =>

                    v.vehicle_id !==
                    msg.vehicle_id
                ),

                {

                  ...msg,

                  trail: old

                    ? [

                        ...old.trail.slice(-15),

                        [msg.y, msg.x],
                      ]

                    : [

                        [msg.y, msg.x],
                      ],
                },
              ];
            }
          );
        }
      );

    return () => {

      if (
        typeof disconnect ===
        "function"
      ) {

        disconnect();
      }
    };

  }, []);


  // ====================================================
  // SAFE SLOTS
  // ====================================================

  const safeSlots =
    useMemo(() => {

      return safeArray(
        slots
      ).filter(
        (slot) => (

          validCoordinate(
            slot?.x
          )

          &&

          validCoordinate(
            slot?.y
          )
        )
      );

    }, [slots]);


  // ====================================================
  // SAFE VEHICLES
  // ====================================================

  const safeVehicles =
    useMemo(() => {

      return safeArray(
        vehicles
      ).filter(
        (vehicle) => (

          validCoordinate(
            vehicle?.x
          )

          &&

          validCoordinate(
            vehicle?.y
          )
        )
      );

    }, [vehicles]);


  // ====================================================
  // FORCE RELEASE
  // ====================================================

  const forceRelease =
    useCallback(async (
      slot
    ) => {

      try {

        await api.post(

          "/admin/free-slot/",

          {
            slot_id:
              slot.id,
          }
        );

        setMessage(
          `Released ${slot.code}`
        );

      } catch (error) {

        console.error(
          "Force release error:",
          error
        );

        setSlots(
          (prev) =>

            prev.map((s) =>

              s.id === slot.id

                ? {

                    ...s,

                    is_occupied: false,

                    is_reserved: false,
                  }

                : s
            )
        );

        setMessage(
          `Simulated release of ${slot.code}`
        );
      }

    }, []);


  // ====================================================
  // AUTO CLEAR MESSAGE
  // ====================================================

  useEffect(() => {

    if (!message) {

      return;
    }

    const timer =
      setTimeout(() => {

        setMessage("");

      }, 3000);

    return () => {

      clearTimeout(timer);
    };

  }, [message]);


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-950
        text-white
      ">

        Loading Live Admin Map...

      </div>
    );
  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <>

      <Navbar />

      <DashboardBackground>

        <div className="
          pt-16
          h-[calc(100vh-64px)]
          flex
          overflow-hidden
        ">

          {/* MAP */}

          <div className="
            flex-1
            relative
          ">

            {message && (

              <div className="
                absolute
                top-4
                left-1/2
                -translate-x-1/2
                z-[1000]

                bg-black/80
                text-white

                px-4
                py-2

                rounded-xl
              ">

                {message}

              </div>
            )}

            <MapContainer

              center={
                DEFAULT_CENTER
              }

              zoom={17}

              className="
                absolute
                inset-0
                h-full
                w-full
              "
            >

              <TileLayer
                url="
                  https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
                "
              />

              <HeatmapLayer
                slots={safeSlots}
              />

              <VehicleTrails
                vehicles={safeVehicles}
              />

              <ViolationLayer
                violations={violations}
              />


              {/* SLOTS */}

              {safeSlots.map(
                (slot) => (

                  <Marker

                    key={slot.id}

                    position={[
                      slot.y,
                      slot.x,
                    ]}

                    icon={

                      slot.is_occupied

                        ? busySlotIcon

                        : slot.is_reserved

                        ? reservedIcon

                        : freeSlotIcon
                    }
                  >

                    <Popup>

                      <div className="
                        text-sm
                      ">

                        <b>
                          Slot {slot.code}
                        </b>

                        <br />

                        Zone:
                        {" "}
                        {slot.zone}

                        <br />

                        Type:
                        {" "}
                        {slot.type}

                        <br />

                        Status:
                        {" "}

                        {
                          slot.is_occupied

                            ? "Occupied"

                            : slot.is_reserved

                            ? "Reserved"

                            : "Free"
                        }

                        {slot.is_occupied && (

                          <button

                            type="button"

                            onClick={() =>
                              forceRelease(slot)
                            }

                            className="
                              mt-3
                              bg-red-600
                              hover:bg-red-700

                              text-white

                              px-3
                              py-1

                              rounded-lg
                              w-full
                            "
                          >

                            Force Release

                          </button>
                        )}

                      </div>

                    </Popup>

                  </Marker>
                )
              )}


              {/* VEHICLES */}

              {safeVehicles.map(
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

                      <div className="
                        text-sm
                      ">

                        <b>

                          {
                            vehicle.plate ||

                            `Vehicle ${vehicle.vehicle_id}`
                          }

                        </b>

                        <br />

                        Speed:
                        {" "}

                        {
                          vehicle.speed || 0
                        }

                        km/h

                        <br />

                        Heading:
                        {" "}

                        {
                          vehicle.heading || 0
                        }

                        °

                      </div>

                    </Popup>

                  </Marker>
                )
              )}

            </MapContainer>

          </div>


          {/* RIGHT PANEL */}

          <div className="
            w-[360px]

            bg-slate-900

            border-l
            border-slate-800

            p-4

            overflow-y-auto

            text-white
          ">

            <h2 className="
              text-xl
              font-bold
              mb-4
            ">

              🛠 Admin Control

            </h2>

            {safeSlots.length === 0 ? (

              <div className="
                text-slate-400
                text-sm
              ">

                No slot data available

              </div>

            ) : (

              safeSlots.map(
                (slot) => (

                  <div

                    key={slot.id}

                    className={`
                      p-3
                      mb-3
                      rounded-xl

                      ${
                        slot.is_occupied

                          ? "bg-red-600"

                          : slot.is_reserved

                          ? `
                            bg-yellow-500
                            text-black
                          `

                          : "bg-emerald-600"
                      }
                    `}
                  >

                    <div className="
                      font-bold
                    ">

                      Slot {slot.code}

                    </div>

                    <div className="
                      text-sm
                    ">

                      {
                        slot.is_occupied

                          ? "Occupied"

                          : slot.is_reserved

                          ? "Reserved"

                          : "Free"
                      }

                    </div>

                    {slot.is_occupied && (

                      <button

                        type="button"

                        onClick={() =>
                          forceRelease(slot)
                        }

                        className="
                          mt-2

                          bg-black/70

                          px-2
                          py-1

                          rounded-lg
                          w-full
                        "
                      >

                        Force Exit

                      </button>
                    )}

                  </div>
                )
              )
            )}

          </div>

        </div>

      </DashboardBackground>

    </>
  );
}