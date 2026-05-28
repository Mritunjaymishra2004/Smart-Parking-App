import {

  QRCodeCanvas,

} from "qrcode.react";

import {

  X,

  Download,

  Printer,

  Shield,

  Car,

  QrCode,

} from "lucide-react";


// ======================================================
// VEHICLE QR CODE
// ======================================================

export default function VehicleQRCode({

  vehicle,

  onClose,

}) {

  // ====================================================
  // QR VALUE
  // ====================================================

  const qrValue =
    JSON.stringify({

      vehicle_id:
        vehicle.id,

      vehicle_number:
        vehicle.vehicle_number,

      owner:
        vehicle.owner,

      type:
        vehicle.type,

      status:
        vehicle.status,
    });


  // ====================================================
  // DOWNLOAD QR
  // ====================================================

  const downloadQR =
    () => {

      const canvas =
        document.getElementById(
          "vehicle-qr-code"
        );

      if (!canvas) {

        return;
      }

      const pngUrl =
        canvas
          .toDataURL(
            "image/png"
          )
          .replace(
            "image/png",

            "image/octet-stream"
          );

      const downloadLink =
        document.createElement(
          "a"
        );

      downloadLink.href =
        pngUrl;

      downloadLink.download =
        `${vehicle.vehicle_number}-qr.png`;

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();

      document.body.removeChild(
        downloadLink
      );
    };


  // ====================================================
  // PRINT
  // ====================================================

  const printQR =
    () => {

      window.print();
    };


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
        max-w-md

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
          items-center
          justify-between

          px-6
          py-5

          border-b
          border-slate-800
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              w-12
              h-12

              rounded-2xl

              bg-emerald-500/10

              flex
              items-center
              justify-center

              text-emerald-400
            ">

              <QrCode size={24} />

            </div>

            <div>

              <h2 className="
                text-xl
                font-bold
                text-white
              ">

                Vehicle QR

              </h2>

              <p className="
                text-sm
                text-slate-400
              ">

                Smart Parking Access

              </p>

            </div>

          </div>


          {/* CLOSE */}

          <button

            onClick={onClose}

            className="
              w-10
              h-10

              rounded-xl

              bg-slate-800

              flex
              items-center
              justify-center

              text-slate-400

              hover:text-white
              hover:bg-slate-700

              transition-all
            "
          >

            <X size={18} />

          </button>

        </div>


        {/* ====================================== */}
        {/* BODY */}
        {/* ====================================== */}

        <div className="
          p-8
        ">

          {/* VEHICLE */}

          <div className="
            flex
            items-center
            gap-4

            mb-8
          ">

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

              <Car size={28} />

            </div>

            <div>

              <h3 className="
                text-2xl
                font-bold
                text-white
              ">

                {
                  vehicle.vehicle_number
                }

              </h3>

              <p className="
                text-slate-400
                mt-1
              ">

                {
                  vehicle.owner
                }

              </p>

            </div>

          </div>


          {/* ==================================== */}
          {/* QR */}
          {/* ==================================== */}

          <div className="
            flex
            justify-center
          ">

            <div className="
              bg-white

              p-6

              rounded-3xl

              shadow-xl
            ">

              <QRCodeCanvas

                id="vehicle-qr-code"

                value={qrValue}

                size={240}

                bgColor="#ffffff"

                fgColor="#000000"

                level="H"

                includeMargin

              />

            </div>

          </div>


          {/* ==================================== */}
          {/* INFO */}
          {/* ==================================== */}

          <div className="
            mt-8

            bg-slate-800/50

            border
            border-slate-700

            rounded-2xl

            p-5

            space-y-3
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <span className="
                text-slate-400
                text-sm
              ">

                Vehicle Type

              </span>

              <span className="
                text-white
                text-sm
                font-medium
              ">

                {vehicle.type}

              </span>

            </div>


            <div className="
              flex
              items-center
              justify-between
            ">

              <span className="
                text-slate-400
                text-sm
              ">

                Status

              </span>

              <span className="
                text-emerald-400
                text-sm
                font-medium
                capitalize
              ">

                {
                  vehicle.status
                }

              </span>

            </div>


            <div className="
              flex
              items-center
              justify-between
            ">

              <span className="
                text-slate-400
                text-sm
              ">

                Access Level

              </span>

              <span className="
                text-blue-400
                text-sm
                font-medium

                flex
                items-center
                gap-1
              ">

                <Shield size={14} />

                Authorized

              </span>

            </div>

          </div>


          {/* ==================================== */}
          {/* ACTIONS */}
          {/* ==================================== */}

          <div className="
            mt-8

            grid
            grid-cols-2

            gap-4
          ">

            {/* DOWNLOAD */}

            <button

              onClick={downloadQR}

              className="
                flex
                items-center
                justify-center
                gap-2

                py-3

                rounded-2xl

                bg-emerald-500

                text-black
                font-semibold

                hover:bg-emerald-400

                transition-all
              "
            >

              <Download size={18} />

              Download

            </button>


            {/* PRINT */}

            <button

              onClick={printQR}

              className="
                flex
                items-center
                justify-center
                gap-2

                py-3

                rounded-2xl

                bg-slate-800

                text-white

                hover:bg-slate-700

                transition-all
              "
            >

              <Printer size={18} />

              Print

            </button>

          </div>

        </div>


        {/* ====================================== */}
        {/* FOOTER */}
        {/* ====================================== */}

        <div className="
          px-6
          py-4

          border-t
          border-slate-800

          bg-slate-950/50
        ">

          <div className="
            flex
            items-center
            justify-between

            text-xs
          ">

            <span className="
              text-slate-500
            ">

              Smart Parking IoT Access

            </span>

            <span className="
              text-emerald-400
              font-medium
            ">

              Secure QR Enabled

            </span>

          </div>

        </div>

      </div>

    </div>
  );
}