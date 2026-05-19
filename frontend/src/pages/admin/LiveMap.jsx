import {
  useEffect,
  useMemo,
  useState,
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
} from "../../websocket/WebSocketContext";

import {

  MapContainer,

  TileLayer,

  Marker,

  Popup,

  CircleMarker,

} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {

  Wifi,

  WifiOff,

  Car,

  ParkingCircle,

  Activity,

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
// LIVE MAP
// ======================================================

export default function LiveMap() {

  // ====================================================
  // REALTIME
  // ====================================================

  const {

    slots: realtimeSlots,

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


  // ====================================================
  // FETCH DATA
  // ====================================================

  const fetchLiveData =
    async () => {

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
          vehiclesData
        );

        setSlots(
          slotsData
        );

      } catch (err) {

        console.error(
          "Live map error:",
          err
        );

        setError(
          "Failed to load live map"
        );

      } finally {

        setLoading(false);
      }
    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchLiveData();

  }, []);


  // ====================================================
  // REALTIME SYNC
  // ====================================================

  useEffect(() => {

    if (

      realtimeSlots &&

      realtimeSlots.length > 0

    ) {

      setSlots(
        realtimeSlots
      );
    }

  }, [realtimeSlots]);


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

      if (

        filteredSlots.length > 0 &&

        filteredSlots[0].latitude

      ) {

        return [

          filteredSlots[0]
            .latitude,

          filteredSlots[0]
            .longitude,
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

  const totalVehicles =
    vehicles.length;

  const totalSlots =
    slots.length;

  const occupiedSlots =
    slots.filter(
      (slot) =>
        slot.status ===
        "occupied"
    ).length;

  const availableSlots =
    slots.filter(
      (slot) =>
        slot.status ===
        "available"
    ).length;

  const reservedSlots =
    slots.filter(
      (slot) =>
        slot.status ===
        "reserved"
    ).length;


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
        xl:flex-row
        xl:items-center
        xl:justify-between
        gap-5
        mb-8
      ">

        <div>

          <div className="
            flex
            items-center
            gap-3
          ">

            <h1 className="
              text-3xl
              font-bold
              text-white
            ">
              Live Parking Map
            </h1>


            {/* CONNECTION */}

            <div className={`
              flex
              items-center
              gap-2

              px-3
              py-1

              rounded-full

              text-xs
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

              {connected

                ? <Wifi size={14} />

                : <WifiOff size={14} />
              }

              {connected

                ? "Realtime"

                : "Offline"
              }

            </div>

          </div>

          <p className="
            text-slate-400
            mt-2
          ">
            Realtime IoT-based vehicle and parking tracking system
          </p>

        </div>


        {/* ====================================== */}
        {/* ZONE FILTER */}
        {/* ====================================== */}

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

            rounded-xl

            outline-none
          "
        >

          {zones.map((zone) => (

            <option
              key={zone}
              value={zone}
            >

              {zone === "all"

                ? "All Zones"

                : zone
              }

            </option>
          ))}

        </select>

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
                {totalVehicles}
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
                {totalSlots}
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
                {occupiedSlots}
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
                {availableSlots}
              </h2>

            </div>

            <Activity
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
                {reservedSlots}
              </h2>

            </div>

            <Activity
              className="
                text-yellow-400
              "
            />

          </div>

        </Card>

      </div>


      {/* ========================================== */}
      {/* LEGEND */}
      {/* ========================================== */}

      <div className="
        flex
        flex-wrap
        items-center
        gap-5
        mb-6
      ">

        <div className="
          flex
          items-center
          gap-2
        ">

          <div className="
            w-4
            h-4
            rounded-full
            bg-emerald-500
          " />

          <span className="
            text-sm
            text-slate-300
          ">
            Available
          </span>

        </div>


        <div className="
          flex
          items-center
          gap-2
        ">

          <div className="
            w-4
            h-4
            rounded-full
            bg-red-500
            animate-pulse
          " />

          <span className="
            text-sm
            text-slate-300
          ">
            Occupied
          </span>

        </div>


        <div className="
          flex
          items-center
          gap-2
        ">

          <div className="
            w-4
            h-4
            rounded-full
            bg-yellow-500
          " />

          <span className="
            text-sm
            text-slate-300
          ">
            Reserved
          </span>

        </div>


        <div className="
          flex
          items-center
          gap-2
        ">

          <div className="
            w-4
            h-4
            rounded-full
            bg-slate-500
          " />

          <span className="
            text-sm
            text-slate-300
          ">
            Blocked
          </span>

        </div>

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

          px-4
          py-3

          rounded-xl

          mb-6
        ">

          {error}

        </div>
      )}


      {/* ========================================== */}
      {/* MAP */}
      {/* ========================================== */}

      <div className="
        h-[750px]

        rounded-2xl

        overflow-hidden

        border
        border-slate-800

        shadow-2xl
      ">

        {loading ? (

          <ChartSkeleton
            height="750px"
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

            zoom={16}

            className="
              h-full
              w-full
            "
          >

            {/* ================================== */}
            {/* TILE LAYER */}
            {/* ================================== */}

            <TileLayer

              attribution="
                &copy; OpenStreetMap
              "

              url="
                https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
              "
            />


            {/* ================================== */}
            {/* VEHICLES */}
            {/* ================================== */}

            {vehicles.map(
              (vehicle) => (

                <Marker

                  key={vehicle.id}

                  position={[

                    vehicle.latitude,

                    vehicle.longitude,
                  ]}
                >

                  <Popup>

                    <div className="
                      min-w-[220px]
                    ">

                      <h3 className="
                        text-lg
                        font-bold
                        mb-3
                      ">
                        Live Vehicle
                      </h3>

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
                            vehicle.speed
                          }

                        </p>

                        <p>

                          <strong>
                            Status:
                          </strong>

                          {" "}

                          Active

                        </p>

                      </div>

                    </div>

                  </Popup>

                </Marker>
              )
            )}


            {/* ================================== */}
            {/* SLOTS */}
            {/* ================================== */}

            {filteredSlots.map(
              (slot) => (

                <CircleMarker

                  key={slot.id}

                  center={[

                    slot.latitude,

                    slot.longitude,
                  ]}

                  radius={
                    slot.status ===
                    "occupied"

                      ? 12

                      : 10
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

                    fillOpacity: 0.7,

                    weight: 2,
                  }}
                >

                  <Popup>

                    <div className="
                      min-w-[220px]
                    ">

                      <h3 className="
                        text-lg
                        font-bold
                        mb-3
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

                      </div>

                    </div>

                  </Popup>

                </CircleMarker>
              )
            )}

          </MapContainer>
        )}

      </div>

    </DashboardLayout>
  );
}