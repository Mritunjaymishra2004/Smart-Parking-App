import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import DashboardLayout
from "../../components/common/DashboardLayout";

import Card
from "../../components/ui/Card";

import EmptyState
from "../../components/ui/EmptyState";

import ChartSkeleton
from "../../components/ui/ChartSkeleton";

import {

  getLiveVehicles,

  getSlots,

} from "../../services/parkingService";

import {
  useWebSocket,
} from "../../context/WebSocketContext";

import {

  MapContainer,

  TileLayer,

  Marker,

  Popup,

  CircleMarker,

  ZoomControl,

} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {

  Wifi,

  WifiOff,

  Car,

  ParkingCircle,

  Activity,

  MapPin,

  Navigation,

  AlertTriangle,

} from "lucide-react";


// ======================================================
// FIX LEAFLET ICONS
// ======================================================

delete L.Icon.Default.prototype
  ._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// ======================================================
// VEHICLE ICON
// ======================================================

const vehicleIcon =
  new L.Icon({

    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/744/744465.png",

    iconSize: [32, 32],

    iconAnchor: [16, 16],

    popupAnchor: [0, -10],
  });


// ======================================================
// LIVE MAP
// ======================================================

export default function LiveMap() {

  // ====================================================
  // WEBSOCKET
  // ====================================================

  const {

    slots: realtimeSlots,

    vehicles: realtimeVehicles,

    connected,

  } = useWebSocket();


  // ====================================================
  // STATE
  // ====================================================

  const [vehicles,
    setVehicles] =
    useState([]);

  const [slots,
    setSlots] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState("");

  const [selectedZone,
    setSelectedZone] =
    useState("all");

  const [lastUpdated,
    setLastUpdated] =
    useState(null);


  // ====================================================
  // FETCH DATA
  // ====================================================

  const fetchLiveData =
    useCallback(async () => {

      try {

        setError("");

        const [

          vehiclesData,

          slotsData,

        ] = await Promise.all([

          getLiveVehicles(),

          getSlots(),
        ]);

        setVehicles(
          Array.isArray(
            vehiclesData
          )

            ? vehiclesData

            : []
        );

        setSlots(
          Array.isArray(
            slotsData
          )

            ? slotsData

            : []
        );

        setLastUpdated(
          new Date()
        );

      } catch (err) {

        console.error(
          "Live map error:",
          err
        );

        setError(
          "Failed to load realtime map data"
        );

      } finally {

        setLoading(false);
      }

    }, []);


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchLiveData();

  }, [fetchLiveData]);


  // ====================================================
  // POLLING FALLBACK
  // ====================================================

  useEffect(() => {

    const interval =
      setInterval(() => {

        fetchLiveData();

      }, 15000);

    return () =>
      clearInterval(interval);

  }, [fetchLiveData]);


  // ====================================================
  // REALTIME SLOT SYNC
  // ====================================================

  useEffect(() => {

    if (

      realtimeSlots &&

      realtimeSlots.length > 0

    ) {

      setSlots(
        realtimeSlots
      );

      setLastUpdated(
        new Date()
      );
    }

  }, [realtimeSlots]);


  // ====================================================
  // REALTIME VEHICLE SYNC
  // ====================================================

  useEffect(() => {

    if (

      realtimeVehicles &&

      realtimeVehicles.length > 0

    ) {

      setVehicles(
        realtimeVehicles
      );

      setLastUpdated(
        new Date()
      );
    }

  }, [realtimeVehicles]);


  // ====================================================
  // SLOT COLOR
  // ====================================================

  const getSlotColor =
    (status) => {

      switch (status) {

        case "occupied":

          return "#ef4444";

        case "reserved":

          return "#f59e0b";

        case "available":

          return "#10b981";

        case "blocked":

          return "#64748b";

        default:

          return "#94a3b8";
      }
    };


  // ====================================================
  // FILTERED SLOTS
  // ====================================================

  const filteredSlots =
    useMemo(() => {

      if (
        selectedZone ===
        "all"
      ) {

        return slots;
      }

      return slots.filter(
        (slot) =>

          slot.zone ===
          selectedZone
      );

    }, [

      slots,

      selectedZone,
    ]);


  // ====================================================
  // MAP CENTER
  // ====================================================

  const mapCenter =
    useMemo(() => {

      const firstSlot =
        filteredSlots.find(

          (slot) =>

            slot.latitude &&

            slot.longitude
        );

      if (firstSlot) {

        return [

          firstSlot.latitude,

          firstSlot.longitude,
        ];
      }

      return [

        28.6139,

        77.2090,
      ];

    }, [filteredSlots]);


  // ====================================================
  // STATS
  // ====================================================

  const stats =
    useMemo(() => {

      return {

        totalVehicles:
          vehicles.length,

        totalSlots:
          slots.length,

        occupiedSlots:
          slots.filter(
            (slot) =>

              slot.status ===
              "occupied"
          ).length,

        availableSlots:
          slots.filter(
            (slot) =>

              slot.status ===
              "available"
          ).length,

        reservedSlots:
          slots.filter(
            (slot) =>

              slot.status ===
              "reserved"
          ).length,
      };

    }, [vehicles, slots]);


  // ====================================================
  // UNIQUE ZONES
  // ====================================================

  const zones =
    useMemo(() => {

      const uniqueZones =
        new Set();

      slots.forEach(
        (slot) => {

          if (slot.zone) {

            uniqueZones.add(
              slot.zone
            );
          }
        }
      );

      return [
        "all",

        ...uniqueZones,
      ];

    }, [slots]);


  // ====================================================
  // UI
  // ====================================================

  return (

    <DashboardLayout>

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="
        flex
        flex-col
        2xl:flex-row
        2xl:items-center
        2xl:justify-between

        gap-6

        mb-8
      ">

        <div>

          <div className="
            flex
            flex-wrap
            items-center
            gap-4
          ">

            <h1 className="
              text-3xl
              font-bold
              text-white
            ">

              Live Parking Map

            </h1>


            {/* STATUS */}

            <div className={`
              flex
              items-center
              gap-2

              px-4
              py-2

              rounded-full

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

              {

                connected

                  ? <Wifi size={16} />

                  : <WifiOff size={16} />
              }

              {

                connected

                  ? "Realtime Connected"

                  : "Offline Mode"
              }

            </div>

          </div>


          <p className="
            text-slate-400
            mt-3
          ">

            Realtime IoT-based vehicle and parking monitoring system

          </p>


          {/* LAST UPDATE */}

          {lastUpdated && (

            <p className="
              text-xs
              text-slate-500
              mt-2
            ">

              Last updated:
              {" "}

              {
                lastUpdated
                  .toLocaleTimeString()
              }

            </p>
          )}

        </div>


        {/* FILTER */}

        <div className="
          flex
          items-center
          gap-4
        ">

          <select

            value={selectedZone}

            onChange={(e) =>
              setSelectedZone(
                e.target.value
              )
            }

            className="
              bg-slate-900

              border
              border-slate-700

              text-white

              px-4
              py-3

              rounded-2xl

              outline-none

              focus:border-emerald-500/30
            "
          >

            {zones.map((zone) => (

              <option

                key={zone}

                value={zone}
              >

                {

                  zone === "all"

                    ? "All Zones"

                    : zone
                }

              </option>
            ))}

          </select>

        </div>

      </div>


      {/* ========================================== */}
      {/* STATS */}
      {/* ========================================== */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-5

        gap-5

        mb-8
      ">

        <Card>

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-slate-400
                text-sm
                mb-2
              ">

                Live Vehicles

              </p>

              <h2 className="
                text-3xl
                font-bold
                text-blue-400
              ">

                {
                  stats.totalVehicles
                }

              </h2>

            </div>

            <Car
              className="
                text-blue-400
              "
            />

          </div>

        </Card>


        <Card>

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-slate-400
                text-sm
                mb-2
              ">

                Total Slots

              </p>

              <h2 className="
                text-3xl
                font-bold
                text-white
              ">

                {
                  stats.totalSlots
                }

              </h2>

            </div>

            <ParkingCircle
              className="
                text-white
              "
            />

          </div>

        </Card>


        <Card>

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-slate-400
                text-sm
                mb-2
              ">

                Occupied

              </p>

              <h2 className="
                text-3xl
                font-bold
                text-red-400
              ">

                {
                  stats.occupiedSlots
                }

              </h2>

            </div>

            <Activity
              className="
                text-red-400
                animate-pulse
              "
            />

          </div>

        </Card>


        <Card>

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-slate-400
                text-sm
                mb-2
              ">

                Available

              </p>

              <h2 className="
                text-3xl
                font-bold
                text-emerald-400
              ">

                {
                  stats.availableSlots
                }

              </h2>

            </div>

            <MapPin
              className="
                text-emerald-400
              "
            />

          </div>

        </Card>


        <Card>

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-slate-400
                text-sm
                mb-2
              ">

                Reserved

              </p>

              <h2 className="
                text-3xl
                font-bold
                text-yellow-400
              ">

                {
                  stats.reservedSlots
                }

              </h2>

            </div>

            <AlertTriangle
              className="
                text-yellow-400
              "
            />

          </div>

        </Card>

      </div>


      {/* ========================================== */}
      {/* ERROR */}
      {/* ========================================== */}

      {error && (

        <div className="
          bg-red-500/10

          border
          border-red-500/20

          text-red-400

          px-5
          py-4

          rounded-2xl

          mb-6
        ">

          {error}

        </div>
      )}


      {/* ========================================== */}
      {/* MAP */}
      {/* ========================================== */}

      <div className="
        h-[780px]

        rounded-3xl

        overflow-hidden

        border
        border-slate-800

        shadow-2xl
      ">

        {loading ? (

          <ChartSkeleton
            height="780px"
          />

        ) : filteredSlots.length === 0 ? (

          <div className="
            h-full

            bg-slate-900

            flex
            items-center
            justify-center
          ">

            <EmptyState

              title="No Map Data"

              description="
                No parking slots available
                for selected zone
              "

            />

          </div>

        ) : (

          <MapContainer

            center={mapCenter}

            zoom={17}

            zoomControl={false}

            className="
              h-full
              w-full
            "
          >

            <ZoomControl
              position="bottomright"
            />

            {/* TILE */}

            <TileLayer

              attribution="
                &copy; OpenStreetMap
              "

              url="
                https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
              "
            />


            {/* VEHICLES */}

            {vehicles.map(
              (vehicle) => {

                if (

                  !vehicle.latitude ||

                  !vehicle.longitude

                ) {

                  return null;
                }

                return (

                  <Marker

                    key={vehicle.id}

                    icon={vehicleIcon}

                    position={[

                      vehicle.latitude,

                      vehicle.longitude,
                    ]}
                  >

                    <Popup>

                      <div className="
                        min-w-[240px]
                      ">

                        <div className="
                          flex
                          items-center
                          gap-2

                          mb-4
                        ">

                          <Navigation
                            size={18}
                            className="
                              text-blue-500
                            "
                          />

                          <h3 className="
                            text-lg
                            font-bold
                          ">

                            Live Vehicle

                          </h3>

                        </div>


                        <div className="
                          space-y-2
                          text-sm
                        ">

                          <p>

                            <strong>
                              Vehicle:
                            </strong>

                            {" "}

                            {
                              vehicle.vehicle_number
                            }

                          </p>

                          <p>

                            <strong>
                              Speed:
                            </strong>

                            {" "}

                            {
                              vehicle.speed || 0
                            }

                            {" "}
                            km/h

                          </p>

                          <p>

                            <strong>
                              Status:
                            </strong>

                            {" "}

                            Active

                          </p>

                          <p>

                            <strong>
                              Driver:
                            </strong>

                            {" "}

                            {
                              vehicle.owner ||
                              "Unknown"
                            }

                          </p>

                        </div>

                      </div>

                    </Popup>

                  </Marker>
                );
              }
            )}


            {/* SLOTS */}

            {filteredSlots.map(
              (slot) => {

                if (

                  !slot.latitude ||

                  !slot.longitude

                ) {

                  return null;
                }

                return (

                  <CircleMarker

                    key={slot.id}

                    center={[

                      slot.latitude,

                      slot.longitude,
                    ]}

                    radius={
                      slot.status ===
                      "occupied"

                        ? 13

                        : 11
                    }

                    pathOptions={{

                      color:
                        getSlotColor(
                          slot.status
                        ),

                      fillColor:
                        getSlotColor(
                          slot.status
                        ),

                      fillOpacity: 0.75,

                      weight: 2,
                    }}
                  >

                    <Popup>

                      <div className="
                        min-w-[240px]
                      ">

                        <h3 className="
                          text-lg
                          font-bold

                          mb-4
                        ">

                          Slot
                          {" "}
                          {
                            slot.slot_number
                          }

                        </h3>


                        <div className="
                          space-y-2
                          text-sm
                        ">

                          <p>

                            <strong>
                              Status:
                            </strong>

                            {" "}

                            {
                              slot.status
                            }

                          </p>

                          <p>

                            <strong>
                              Zone:
                            </strong>

                            {" "}

                            {
                              slot.zone ||
                              "N/A"
                            }

                          </p>

                          <p>

                            <strong>
                              Type:
                            </strong>

                            {" "}

                            {
                              slot.slot_type ||
                              "Standard"
                            }

                          </p>

                          <p>

                            <strong>
                              Sensor:
                            </strong>

                            {" "}

                            Active

                          </p>

                        </div>

                      </div>

                    </Popup>

                  </CircleMarker>
                );
              }
            )}

          </MapContainer>
        )}

      </div>

    </DashboardLayout>
  );
}