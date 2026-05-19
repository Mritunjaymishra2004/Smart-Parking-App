import {

  useEffect,

  useMemo,

  useState,

} from "react";

import {

  MapContainer,

  TileLayer,

  Marker,

  Popup,

  Polyline,

  Circle,

  ZoomControl,

} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {

  X,

  Navigation,

  Wifi,

  Activity,

  Gauge,

  MapPin,

  Clock,

  Car,

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

    iconSize: [40, 40],

    iconAnchor: [20, 20],

    popupAnchor: [0, -20],
  });


// ======================================================
// DEFAULT PATH
// ======================================================

const DEFAULT_PATH = [

  [28.6139, 77.2090],

  [28.6145, 77.2102],

  [28.6151, 77.2114],

  [28.6159, 77.2120],
];


// ======================================================
// VEHICLE TRACKER
// ======================================================

export default function VehicleTracker({

  vehicle,

  onClose,

}) {

  // ====================================================
  // STATE
  // ====================================================

  const [position,
    setPosition] =
    useState(
      DEFAULT_PATH[0]
    );

  const [path,
    setPath] =
    useState(
      DEFAULT_PATH
    );

  const [speed,
    setSpeed] =
    useState(24);

  const [heading,
    setHeading] =
    useState("North East");

  const [connected,
    setConnected] =
    useState(true);

  const [lastUpdate,
    setLastUpdate] =
    useState(
      new Date()
    );


  // ====================================================
  // REALTIME MOVEMENT SIMULATION
  // ====================================================

  useEffect(() => {

    let index = 0;

    const interval =
      setInterval(() => {

        index =
          (index + 1) %

          DEFAULT_PATH.length;

        const nextPosition =
          DEFAULT_PATH[index];

        setPosition(
          nextPosition
        );

        setLastUpdate(
          new Date()
        );

        setSpeed(

          Math.floor(

            Math.random() * 20
          ) + 20
        );

      }, 4000);

    return () =>
      clearInterval(interval);

  }, []);


  // ====================================================
  // MAP CENTER
  // ====================================================

  const mapCenter =
    useMemo(() => {

      return position;

    }, [position]);


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      fixed
      inset-0

      z-[9999]

      bg-black/70
      backdrop-blur-sm

      flex
      items-center
      justify-center

      p-4
    ">

      {/* ========================================== */}
      {/* MODAL */}
      {/* ========================================== */}

      <div className="
        relative

        w-full
        max-w-6xl

        bg-slate-900

        border
        border-slate-800

        rounded-3xl

        overflow-hidden

        shadow-2xl
      ">

        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="
          flex
          flex-col
          xl:flex-row

          xl:items-center
          xl:justify-between

          gap-5

          px-6
          py-5

          border-b
          border-slate-800
        ">

          {/* LEFT */}

          <div className="
            flex
            items-center
            gap-4
          ">

            {/* ICON */}

            <div className="
              w-16
              h-16

              rounded-2xl

              bg-emerald-500/10

              flex
              items-center
              justify-center

              text-emerald-400
            ">

              <Car size={30} />

            </div>


            {/* INFO */}

            <div>

              <h2 className="
                text-2xl
                font-bold
                text-white
              ">

                Live Vehicle Tracking

              </h2>

              <p className="
                text-slate-400
                mt-1
              ">

                {
                  vehicle.vehicle_number
                }

              </p>

            </div>

          </div>


          {/* RIGHT */}

          <div className="
            flex
            items-center
            gap-4
            flex-wrap
          ">

            {/* CONNECTION */}

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

              <Wifi size={16} />

              {

                connected

                  ? "Realtime Connected"

                  : "Offline"
              }

            </div>


            {/* CLOSE */}

            <button

              onClick={onClose}

              className="
                w-11
                h-11

                rounded-2xl

                bg-slate-800

                flex
                items-center
                justify-center

                text-slate-400

                hover:bg-slate-700
                hover:text-white

                transition-all
              "
            >

              <X size={20} />

            </button>

          </div>

        </div>


        {/* ====================================== */}
        {/* STATS */}
        {/* ====================================== */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-4

          gap-5

          p-6
        ">

          {/* SPEED */}

          <div className="
            bg-slate-800/60

            border
            border-slate-700

            rounded-2xl

            p-5
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-slate-400
                  text-sm
                ">

                  Current Speed

                </p>

                <h3 className="
                  text-3xl
                  font-bold
                  text-white

                  mt-2
                ">

                  {speed}

                  <span className="
                    text-lg
                    text-slate-400

                    ml-1
                  ">

                    km/h

                  </span>

                </h3>

              </div>

              <Gauge
                className="
                  text-emerald-400
                "
              />

            </div>

          </div>


          {/* LOCATION */}

          <div className="
            bg-slate-800/60

            border
            border-slate-700

            rounded-2xl

            p-5
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-slate-400
                  text-sm
                ">

                  Heading

                </p>

                <h3 className="
                  text-xl
                  font-bold
                  text-white

                  mt-2
                ">

                  {heading}

                </h3>

              </div>

              <Navigation
                className="
                  text-blue-400
                "
              />

            </div>

          </div>


          {/* STATUS */}

          <div className="
            bg-slate-800/60

            border
            border-slate-700

            rounded-2xl

            p-5
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-slate-400
                  text-sm
                ">

                  Vehicle Status

                </p>

                <h3 className="
                  text-xl
                  font-bold
                  text-emerald-400

                  mt-2
                ">

                  Active

                </h3>

              </div>

              <Activity
                className="
                  text-emerald-400
                  animate-pulse
                "
              />

            </div>

          </div>


          {/* LAST UPDATE */}

          <div className="
            bg-slate-800/60

            border
            border-slate-700

            rounded-2xl

            p-5
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-slate-400
                  text-sm
                ">

                  Last Update

                </p>

                <h3 className="
                  text-lg
                  font-bold
                  text-white

                  mt-2
                ">

                  {

                    lastUpdate
                      .toLocaleTimeString()
                  }

                </h3>

              </div>

              <Clock
                className="
                  text-yellow-400
                "
              />

            </div>

          </div>

        </div>


        {/* ====================================== */}
        {/* MAP */}
        {/* ====================================== */}

        <div className="
          h-[650px]

          border-t
          border-slate-800
        ">

          <MapContainer

            center={mapCenter}

            zoom={16}

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


            {/* PATH */}

            <Polyline

              positions={path}

              pathOptions={{

                color: "#10b981",

                weight: 5,

                opacity: 0.8,
              }}
            />


            {/* CURRENT VEHICLE */}

            <Marker

              position={position}

              icon={vehicleIcon}
            >

              <Popup>

                <div className="
                  min-w-[220px]
                ">

                  <div className="
                    flex
                    items-center
                    gap-2

                    mb-4
                  ">

                    <Car
                      size={18}
                      className="
                        text-emerald-500
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

                      {speed}
                      {" "}
                      km/h

                    </p>

                    <p>

                      <strong>
                        Direction:
                      </strong>

                      {" "}

                      {heading}

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


            {/* LIVE RADIUS */}

            <Circle

              center={position}

              radius={40}

              pathOptions={{

                color: "#10b981",

                fillColor: "#10b981",

                fillOpacity: 0.2,
              }}
            />

          </MapContainer>

        </div>


        {/* ====================================== */}
        {/* FOOTER */}
        {/* ====================================== */}

        <div className="
          flex
          flex-col
          md:flex-row

          md:items-center
          md:justify-between

          gap-4

          px-6
          py-4

          border-t
          border-slate-800

          bg-slate-950/40
        ">

          {/* LEFT */}

          <div className="
            flex
            items-center
            gap-2

            text-sm
            text-slate-400
          ">

            <MapPin size={16} />

            Smart Parking IoT Live Monitoring

          </div>


          {/* RIGHT */}

          <div className="
            flex
            items-center
            gap-2

            text-sm
            text-emerald-400
            font-medium
          ">

            <Activity
              size={16}
              className="
                animate-pulse
              "
            />

            GPS Tracking Active

          </div>

        </div>

      </div>

    </div>
  );
}