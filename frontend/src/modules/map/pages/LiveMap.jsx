import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  Wifi,
  MapPinned,
  Car,
  ParkingCircle,
  Activity,
  ShieldCheck,
  Radar,
  Navigation,
} from "lucide-react";


// ======================================================
// DEMO DATA
// ======================================================

const parkingSpots = [
  {
    id: 1,
    name: "Parking A1",
    position: [28.6139, 77.2090],
    status: "Occupied",
  },
  {
    id: 2,
    name: "Parking B1",
    position: [28.6145, 77.2085],
    status: "Available",
  },
  {
    id: 3,
    name: "Parking C1",
    position: [28.6150, 77.2100],
    status: "Reserved",
  },
  {
    id: 4,
    name: "Parking D1",
    position: [28.6142, 77.2108],
    status: "Available",
  },
];


// ======================================================
// COLORS
// ======================================================

const statusColor = {
  Occupied: "#ef4444",
  Available: "#22c55e",
  Reserved: "#f59e0b",
};


// ======================================================
// CARD
// ======================================================

function StatCard({
  icon,
  title,
  value,
  color,
}) {
  return (
    <div className="
      rounded-3xl
      bg-slate-900/70
      border border-white/10
      p-6
      backdrop-blur-xl
      hover:-translate-y-2
      transition-all
      shadow-xl
    ">
      <div className={`${color} mb-4`}>
        {icon}
      </div>

      <h3 className="text-slate-400">
        {title}
      </h3>

      <p className="
        text-4xl
        font-bold
        text-white
        mt-2
      ">
        {value}
      </p>
    </div>
  );
}


// ======================================================
// LIVE MAP
// ======================================================

export default function LiveMap() {
  const occupied =
    parkingSpots.filter(
      (s) =>
        s.status === "Occupied"
    ).length;

  const available =
    parkingSpots.filter(
      (s) =>
        s.status === "Available"
    ).length;

  const reserved =
    parkingSpots.filter(
      (s) =>
        s.status === "Reserved"
    ).length;

  const occupancy =
    Math.round(
      (occupied /
        parkingSpots.length) *
        100
    );


  return (
    <div className="
      min-h-screen
      space-y-8
      pb-10
    ">

      {/* HERO */}
      <div className="
        rounded-3xl
        p-8
        bg-gradient-to-r
        from-emerald-500/10
        via-blue-500/10
        to-cyan-500/10
        border border-white/10
        backdrop-blur-xl
      ">
        <div className="
          flex flex-col xl:flex-row
          justify-between
          gap-8
        ">

          <div>
            <h1 className="
              text-5xl
              font-bold
              text-white
            ">
              Live Smart Parking
            </h1>

            <p className="
              text-emerald-400
              text-2xl
              mt-2
            ">
              Real-time Monitoring Grid
            </p>

            <p className="
              mt-4
              text-slate-300
              text-lg
            ">
              IoT enabled smart city parking surveillance
            </p>
          </div>

          <div className="
            flex gap-4 flex-wrap
          ">
            <StatusChip
              icon={<Wifi />}
              text="Realtime"
            />

            <StatusChip
              icon={<Radar />}
              text="IoT Active"
            />

            <StatusChip
              icon={<ShieldCheck />}
              text="Secure"
            />
          </div>

        </div>
      </div>


      {/* STATS */}
      <div className="
        grid
        md:grid-cols-5
        gap-6
      ">
        <StatCard
          icon={<ParkingCircle />}
          title="Total Slots"
          value={parkingSpots.length}
          color="text-blue-400"
        />

        <StatCard
          icon={<Car />}
          title="Occupied"
          value={occupied}
          color="text-red-400"
        />

        <StatCard
          icon={<MapPinned />}
          title="Available"
          value={available}
          color="text-emerald-400"
        />

        <StatCard
          icon={<Activity />}
          title="Reserved"
          value={reserved}
          color="text-amber-400"
        />

        <StatCard
          icon={<Navigation />}
          title="Occupancy"
          value={`${occupancy}%`}
          color="text-cyan-400"
        />
      </div>


      {/* MAP */}
      <div className="
        rounded-3xl
        overflow-hidden
        border border-white/10
        shadow-2xl
      ">
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={16}
          style={{
            height: "82vh",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {parkingSpots.map(
            (spot) => (
              <CircleMarker
                key={spot.id}
                center={spot.position}
                radius={18}
                pathOptions={{
                  color:
                    statusColor[
                      spot.status
                    ],
                  fillColor:
                    statusColor[
                      spot.status
                    ],
                  fillOpacity: 0.85,
                }}
              >
                <Popup>
                  <div className="space-y-3">
                    <h2 className="
                      text-lg
                      font-bold
                    ">
                      {spot.name}
                    </h2>

                    <p>
                      Status:
                      <span
                        className="ml-2 font-semibold"
                        style={{
                          color:
                            statusColor[
                              spot.status
                            ],
                        }}
                      >
                        {spot.status}
                      </span>
                    </p>

                    <p>Sensor: Active</p>
                    <p>GPS: Synced</p>
                    <p>Camera: Online</p>
                  </div>
                </Popup>
              </CircleMarker>
            )
          )}
        </MapContainer>
      </div>


      {/* LEGEND */}
      <div className="
        rounded-3xl
        bg-slate-900/70
        border border-white/10
        p-6
      ">
        <h2 className="
          text-xl
          font-semibold
          mb-5
        ">
          Slot Status Legend
        </h2>

        <div className="
          flex flex-wrap gap-8
        ">
          <Legend
            color="bg-green-500"
            text="Available"
          />

          <Legend
            color="bg-red-500"
            text="Occupied"
          />

          <Legend
            color="bg-amber-500"
            text="Reserved"
          />
        </div>
      </div>

    </div>
  );
}


// ======================================================
// STATUS CHIP
// ======================================================

function StatusChip({
  icon,
  text,
}) {
  return (
    <div className="
      px-5 py-4
      rounded-2xl
      bg-emerald-500/10
      border border-emerald-500/20
      text-emerald-400
      flex items-center gap-3
    ">
      {icon}
      {text}
    </div>
  );
}


// ======================================================
// LEGEND
// ======================================================

function Legend({
  color,
  text,
}) {
  return (
    <div className="
      flex items-center gap-3
    ">
      <div className={`
        w-4 h-4
        rounded-full
        ${color}
      `} />

      {text}
    </div>
  );
}