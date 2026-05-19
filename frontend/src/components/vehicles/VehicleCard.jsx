import {

  memo,

  useState,

} from "react";

import {

  Car,

  Bike,

  Truck,

  Trash2,

  MapPin,

  Activity,

  QrCode,

  Navigation,

  Clock,

  Shield,

} from "lucide-react";

import VehicleQRCode
from "./VehicleQRCode";


// ======================================================
// VEHICLE ICON
// ======================================================

function VehicleTypeIcon({

  type,

}) {

  const iconProps = {

    size: 22,
  };

  switch (
    type?.toLowerCase()
  ) {

    case "bike":

      return (
        <Bike
          {...iconProps}
        />
      );

    case "truck":

      return (
        <Truck
          {...iconProps}
        />
      );

    default:

      return (
        <Car
          {...iconProps}
        />
      );
  }
}


// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({

  status,

}) {

  const styles = {

    active: `
      bg-emerald-500/10
      text-emerald-400
    `,

    parked: `
      bg-blue-500/10
      text-blue-400
    `,

    blocked: `
      bg-red-500/10
      text-red-400
    `,
  };

  return (

    <div className={`
      px-3
      py-1

      rounded-full

      text-xs
      font-semibold

      capitalize

      ${
        styles[status]

        ||

        `
          bg-slate-700
          text-slate-300
        `
      }
    `}>

      {status}

    </div>
  );
}


// ======================================================
// INFO ROW
// ======================================================

function InfoRow({

  icon,

  label,

  value,

}) {

  return (

    <div className="
      flex
      items-center
      justify-between

      gap-4
    ">

      <div className="
        flex
        items-center
        gap-2

        text-slate-400
        text-sm
      ">

        {icon}

        {label}

      </div>

      <div className="
        text-white
        text-sm
        font-medium
      ">

        {value}

      </div>

    </div>
  );
}


// ======================================================
// ACTION BUTTON
// ======================================================

function ActionButton({

  icon,

  label,

  onClick,

  color = "",

}) {

  return (

    <button

      onClick={onClick}

      className={`
        flex
        items-center
        justify-center
        gap-2

        flex-1

        px-4
        py-3

        rounded-2xl

        bg-slate-800

        text-slate-300

        hover:bg-slate-700
        hover:text-white

        transition-all

        ${color}
      `}
    >

      {icon}

      <span className="
        text-sm
        font-medium
      ">

        {label}

      </span>

    </button>
  );
}


// ======================================================
// VEHICLE CARD
// ======================================================

function VehicleCard({

  vehicle,

  onDelete,

  onTrack,

}) {

  // ====================================================
  // STATE
  // ====================================================

  const [showQR,
    setShowQR] =
    useState(false);


  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete =
    () => {

      const confirmed =
        window.confirm(

          `Delete ${vehicle.vehicle_number}?`
        );

      if (!confirmed) {

        return;
      }

      onDelete?.(
        vehicle.id
      );
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <>
      <div className="
        bg-slate-900

        border
        border-slate-800

        rounded-3xl

        overflow-hidden

        hover:border-emerald-500/30

        hover:shadow-2xl

        transition-all
        duration-300
      ">

        {/* ========================================== */}
        {/* TOP */}
        {/* ========================================== */}

        <div className="
          p-6
        ">

          {/* HEADER */}

          <div className="
            flex
            items-start
            justify-between

            gap-4
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

                <VehicleTypeIcon
                  type={
                    vehicle.type
                  }
                />

              </div>


              {/* INFO */}

              <div>

                <h2 className="
                  text-xl
                  font-bold
                  text-white
                ">

                  {
                    vehicle.vehicle_number
                  }

                </h2>

                <p className="
                  text-slate-400
                  mt-1
                ">

                  {
                    vehicle.type
                  }

                  {" • "}

                  {
                    vehicle.color
                  }

                </p>

              </div>

            </div>


            {/* STATUS */}

            <StatusBadge

              status={
                vehicle.status
              }

            />

          </div>


          {/* ====================================== */}
          {/* BODY */}
          {/* ====================================== */}

          <div className="
            mt-6

            space-y-4
          ">

            {/* OWNER */}

            <InfoRow

              icon={
                <Shield size={16} />
              }

              label="Owner"

              value={
                vehicle.owner
              }

            />


            {/* LOCATION */}

            <InfoRow

              icon={
                <MapPin size={16} />
              }

              label="Last Location"

              value={
                vehicle.lastLocation
              }

            />


            {/* STATUS */}

            <InfoRow

              icon={
                <Activity size={16} />
              }

              label="Current Status"

              value={
                vehicle.status
              }

            />


            {/* UPDATED */}

            <InfoRow

              icon={
                <Clock size={16} />
              }

              label="Last Update"

              value="2 mins ago"

            />

          </div>


          {/* ====================================== */}
          {/* ACTIONS */}
          {/* ====================================== */}

          <div className="
            mt-8

            grid
            grid-cols-2

            gap-3
          ">

            {/* QR */}

            <ActionButton

              icon={
                <QrCode
                  size={18}
                />
              }

              label="QR Code"

              color="
                hover:bg-blue-500/10
                hover:text-blue-400
              "

              onClick={() =>
                setShowQR(true)
              }

            />


            {/* TRACK */}

            <ActionButton

              icon={
                <Navigation
                  size={18}
                />
              }

              label="Track"

              color="
                hover:bg-emerald-500/10
                hover:text-emerald-400
              "

              onClick={() =>

                onTrack?.(
                  vehicle
                )
              }

            />


            {/* DELETE */}

            <div className="
              col-span-2
            ">

              <ActionButton

                icon={
                  <Trash2
                    size={18}
                  />
                }

                label="Delete Vehicle"

                color="
                  hover:bg-red-500/10
                  hover:text-red-400
                "

                onClick={
                  handleDelete
                }

              />

            </div>

          </div>

        </div>


        {/* ========================================== */}
        {/* FOOTER */}
        {/* ========================================== */}

        <div className="
          px-6
          py-4

          border-t
          border-slate-800

          bg-slate-950/40
        ">

          <div className="
            flex
            items-center
            justify-between

            text-xs
          ">

            <div className="
              text-slate-500
            ">

              Vehicle ID:
              {" "}

              {
                vehicle.id
              }

            </div>


            <div className="
              text-emerald-400
              font-medium
            ">

              Smart Parking Active

            </div>

          </div>

        </div>

      </div>


      {/* ========================================== */}
      {/* QR MODAL */}
      {/* ========================================== */}

      {showQR && (

        <VehicleQRCode

          vehicle={vehicle}

          onClose={() =>
            setShowQR(false)
          }

        />
      )}

    </>
  );
}


// ======================================================
// EXPORT
// ======================================================

export default memo(
  VehicleCard
);