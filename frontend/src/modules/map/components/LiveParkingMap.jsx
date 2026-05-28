import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import {
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

import {
  freeSlotIcon,
  busySlotIcon,
  reservedIcon,
  carIcon,
} from "../../utils/leafletIcon";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useParking,
} from "../../context/ParkingContext";

import {
  useWebSocket,
} from "../../context/WebSocketContext";

import VehiclePickerModal
  from "../user/VehiclePickerModal";

import useParkingData
  from "../../hooks/useParkingData";


// ======================================================
// DEFAULT CENTER
// ======================================================

const DEFAULT_CENTER =

  [28.6105, 77.2007];


// ======================================================
// SAFE NUMBER
// ======================================================

const isValidCoordinate =
  (value) => {

    return (
      typeof value === "number" &&
      !Number.isNaN(value)
    );
  };


// ======================================================
// HAVERSINE DISTANCE
// ======================================================

const getDistance = (

  lat1,

  lon1,

  lat2,

  lon2

) => {

  const toRad =
    (deg) =>

      deg * (
        Math.PI / 180
      );

  const R = 6371;

  const dLat =
    toRad(lat2 - lat1);

  const dLon =
    toRad(lon2 - lon1);

  const a =

    Math.sin(dLat / 2) *
    Math.sin(dLat / 2)

    +

    Math.cos(
      toRad(lat1)
    ) *

    Math.cos(
      toRad(lat2)
    ) *

    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c =

    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};


// ======================================================
// RECENTER
// ======================================================

function RecenterMap({

  center,

}) {

  const map =
    useMap();

  useEffect(() => {

    if (
      Array.isArray(center)
    ) {

      map.setView(center);
    }

  }, [center, map]);

  return null;
}


// ======================================================
// MAIN COMPONENT
// ======================================================

export default function LiveParkingMap() {

  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const { startParking } =
    useParking();

  const { connected } =
    useWebSocket();

  const {

    slots,

    vehicles,

    loading,

  } = useParkingData();


  // ====================================================
  // STATE
  // ====================================================

  const [userLocation,
    setUserLocation] =
    useState(null);

  const [selectedSlot,
    setSelectedSlot] =
    useState(null);

  const [showVehicleModal,
    setShowVehicleModal] =
    useState(false);

  const [message,
    setMessage] =
    useState("");

  const mapRef =
    useRef(null);


  // ====================================================
  // GEOLOCATION
  // ====================================================

  useEffect(() => {

    if (
      !navigator.geolocation
    ) {

      setMessage(
        "Geolocation not supported"
      );

      return;
    }

    const geoOptions = {

      enableHighAccuracy:
        true,

      timeout: 10000,

      maximumAge: 30000,
    };

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserLocation([

          position.coords.latitude,

          position.coords.longitude,
        ]);
      },

      () => {

        setMessage(
          "Location access denied"
        );
      },

      geoOptions
    );

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
  // SAFE SLOTS
  // ====================================================

  const safeSlots =
    useMemo(() => {

      if (
        !Array.isArray(slots)
      ) {

        return [];
      }

      return slots.filter(
        (slot) => (

          isValidCoordinate(
            slot?.x
          )

          &&

          isValidCoordinate(
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

      if (
        !Array.isArray(vehicles)
      ) {

        return [];
      }

      return vehicles.filter(
        (vehicle) => (

          isValidCoordinate(
            vehicle?.x
          )

          &&

          isValidCoordinate(
            vehicle?.y
          )
        )
      );

    }, [vehicles]);


  // ====================================================
  // SLOT CLICK
  // ====================================================

  const onSlotClick =
    useCallback((slot) => {

      if (
        slot.status ===
        "OCCUPIED"
      ) {

        setMessage(
          "Slot already occupied"
        );

        return;
      }

      if (
        slot.status ===
        "RESERVED"
      ) {

        setMessage(
          "Slot already reserved"
        );

        return;
      }

      if (
        !user?.vehicles?.length
      ) {

        navigate(
          "/add-vehicle"
        );

        return;
      }

      if (
        user.vehicles.length === 1
      ) {

        startParking(
          slot,
          user.vehicles[0]
        );

        return;
      }

      setSelectedSlot(slot);

      setShowVehicleModal(true);

    }, [

      navigate,

      startParking,

      user,
    ]);


  // ====================================================
  // FIND NEAREST
  // ====================================================

  const findNearestSlot =
    useCallback(() => {

      if (
        !userLocation
      ) {

        setMessage(
          "Location unavailable"
        );

        return;
      }

      let nearest = null;

      let minDistance =
        Infinity;

      safeSlots.forEach(
        (slot) => {

          if (
            slot.status !==
            "AVAILABLE"
          ) {

            return;
          }

          const distance =
            getDistance(

              userLocation[0],
              userLocation[1],

              slot.y,
              slot.x
            );

          if (
            distance <
            minDistance
          ) {

            minDistance =
              distance;

            nearest = slot;
          }
        }
      );

      if (!nearest) {

        setMessage(
          "No free slots available"
        );

        return;
      }

      onSlotClick(nearest);

    }, [

      userLocation,

      safeSlots,

      onSlotClick,
    ]);


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="
        flex
        items-center
        justify-center
        h-full
        text-white
        text-lg
      ">

        Loading Live Map...

      </div>
    );
  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      relative
      w-full
      h-full
    ">

      {/* MESSAGE */}

      {message && (

        <div className="
          absolute
          top-16
          left-1/2
          -translate-x-1/2
          bg-black/80
          text-white
          px-4
          py-2
          rounded-xl
          z-[1000]
          shadow-xl
        ">

          {message}

        </div>
      )}


      {/* FIND BUTTON */}

      <button

        type="button"

        onClick={
          findNearestSlot
        }

        className="
          absolute
          top-4
          left-4
          z-[1000]

          bg-emerald-600
          hover:bg-emerald-700

          text-white

          px-4
          py-2

          rounded-xl

          shadow-lg

          transition
        "
      >

        Find Nearest

      </button>


      {/* CONNECTION STATUS */}

      <div className={`
        absolute
        top-4
        right-4
        z-[1000]

        px-3
        py-2

        rounded-xl

        text-sm
        font-medium

        ${
          connected

            ? `
              bg-emerald-500/20
              text-emerald-400
            `

            : `
              bg-yellow-500/20
              text-yellow-400
            `
        }
      `}>

        {
          connected

            ? "Realtime Connected"

            : "Polling Mode"
        }

      </div>


      {/* MAP */}

      <MapContainer

        center={
          userLocation ||
          DEFAULT_CENTER
        }

        zoom={16}

        ref={mapRef}

        className="
          absolute
          inset-0
        "
      >

        <RecenterMap
          center={userLocation}
        />

        <TileLayer

          attribution="
            © OpenStreetMap contributors
          "

          url="
            https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
          "
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

                slot.status ===
                "OCCUPIED"

                  ? busySlotIcon

                  : slot.status ===
                    "RESERVED"

                  ? reservedIcon

                  : freeSlotIcon
              }

              eventHandlers={{
                click: () =>
                  onSlotClick(slot),
              }}
            >

              <Popup>

                <div className="
                  text-sm
                ">

                  <b>
                    Slot {slot.code}
                  </b>

                  <br />

                  Status:
                  {" "}
                  {slot.status}

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

                {
                  vehicle.plate ||

                  `Vehicle ${vehicle.vehicle_id}`
                }

              </Popup>

            </Marker>
          )
        )}


        {/* USER */}

        {userLocation && (

          <Marker
            position={
              userLocation
            }
          >

            <Popup>
              You are here
            </Popup>

          </Marker>
        )}

      </MapContainer>


      {/* LEGEND */}

      <div className="
        absolute
        bottom-4
        left-4

        bg-black/70

        text-white

        p-3

        rounded-xl

        text-sm

        z-[1000]
      ">

        <div>
          🟢 Available
        </div>

        <div>
          🟡 Reserved
        </div>

        <div>
          🔴 Occupied
        </div>

        <div>
          🚗 Vehicles
        </div>

      </div>


      {/* VEHICLE MODAL */}

      {showVehicleModal && (

        <VehiclePickerModal

          vehicles={
            user?.vehicles || []
          }

          onSelect={(vehicle) => {

            startParking(
              selectedSlot,
              vehicle
            );

            setShowVehicleModal(
              false
            );

            setSelectedSlot(
              null
            );
          }}

          onClose={() => {

            setShowVehicleModal(
              false
            );

            setSelectedSlot(
              null
            );
          }}
        />
      )}

    </div>
  );
}