import {

  useEffect,

  useMemo,

  useState,

} from "react";

import DashboardLayout
from "../../components/common/DashboardLayout";

import {

  QrReader,

} from "react-qr-reader";

import {

  ShieldCheck,

  ShieldAlert,

  Camera,

  Car,

  Clock,

  MapPin,

  Activity,

  ParkingCircle,

  CheckCircle2,

  XCircle,

  ScanLine,

} from "lucide-react";


// ======================================================
// DUMMY SLOTS
// ======================================================

const AVAILABLE_SLOTS = [

  "A-01",

  "A-02",

  "A-03",

  "B-01",

  "B-02",
];


// ======================================================
// GATE SCANNER
// ======================================================

export default function GateScanner() {

  // ====================================================
  // STATE
  // ====================================================

  const [scanData,
    setScanData] =
    useState(null);

  const [scanError,
    setScanError] =
    useState("");

  const [scanning,
    setScanning] =
    useState(true);

  const [session,
    setSession] =
    useState(null);

  const [logs,
    setLogs] =
    useState([]);

  const [gateStatus,
    setGateStatus] =
    useState("closed");

  const [assignedSlot,
    setAssignedSlot] =
    useState(null);

  const [timer,
    setTimer] =
    useState(0);


  // ====================================================
  // SESSION TIMER
  // ====================================================

  useEffect(() => {

    if (!session) {

      return;
    }

    const interval =
      setInterval(() => {

        setTimer(
          (prev) => prev + 1
        );

      }, 1000);

    return () =>
      clearInterval(interval);

  }, [session]);


  // ====================================================
  // FORMAT TIME
  // ====================================================

  const formattedTime =
    useMemo(() => {

      const hrs =
        Math.floor(
          timer / 3600
        );

      const mins =
        Math.floor(
          (timer % 3600) / 60
        );

      const secs =
        timer % 60;

      return `${hrs
        .toString()
        .padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;

    }, [timer]);


  // ====================================================
  // ASSIGN SLOT
  // ====================================================

  const assignSlot =
    () => {

      const slot =
        AVAILABLE_SLOTS[
          Math.floor(
            Math.random() *
            AVAILABLE_SLOTS.length
          )
        ];

      setAssignedSlot(
        slot
      );

      return slot;
    };


  // ====================================================
  // OPEN GATE
  // ====================================================

  const openGate =
    () => {

      setGateStatus(
        "open"
      );

      setTimeout(() => {

        setGateStatus(
          "closed"
        );

      }, 5000);
    };


  // ====================================================
  // QR SCAN
  // ====================================================

  const handleScan =
    (result) => {

      if (!result?.text) {

        return;
      }

      try {

        const parsed =
          JSON.parse(
            result.text
          );

        setScanData(
          parsed
        );

        setScanError("");

        const slot =
          assignSlot();

        openGate();

        const parkingSession = {

          id: Date.now(),

          ...parsed,

          slot,

          entryTime:
            new Date()
              .toLocaleTimeString(),
        };

        setSession(
          parkingSession
        );

        setLogs((prev) => [

          parkingSession,

          ...prev,
        ]);

        setScanning(
          false
        );

      } catch (err) {

        console.error(err);

        setScanError(
          "Invalid QR Code"
        );
      }
    };


  // ====================================================
  // RESET
  // ====================================================

  const resetScanner =
    () => {

      setScanData(null);

      setSession(null);

      setAssignedSlot(
        null
      );

      setScanning(
        true
      );

      setTimer(0);

      setScanError("");
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <DashboardLayout>

      <div className="
        space-y-8
      ">

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
        ">

          <div>

            <h1 className="
              text-3xl
              font-bold
              text-white
            ">

              Smart Gate Scanner

            </h1>

            <p className="
              text-slate-400
              mt-2
            ">

              IoT QR-based vehicle
              entry and exit system

            </p>

          </div>


          {/* GATE STATUS */}

          <div className={`
            flex
            items-center
            gap-3

            px-5
            py-3

            rounded-2xl

            font-semibold

            ${
              gateStatus === "open"

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

              gateStatus === "open"

                ? <CheckCircle2 size={20} />

                : <XCircle size={20} />
            }

            Gate {

              gateStatus === "open"

                ? "OPEN"

                : "CLOSED"
            }

          </div>

        </div>


        {/* ========================================== */}
        {/* GRID */}
        {/* ========================================== */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-3

          gap-6
        ">

          {/* ====================================== */}
          {/* SCANNER */}
          {/* ====================================== */}

          <div className="
            xl:col-span-2

            bg-slate-900

            border
            border-slate-800

            rounded-3xl

            overflow-hidden
          ">

            {/* HEADER */}

            <div className="
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

                  <ScanLine
                    size={24}
                  />

                </div>

                <div>

                  <h2 className="
                    text-xl
                    font-bold
                    text-white
                  ">

                    QR Vehicle Scanner

                  </h2>

                  <p className="
                    text-slate-400
                    text-sm
                  ">

                    Scan vehicle access QR

                  </p>

                </div>

              </div>

            </div>


            {/* CAMERA */}

            <div className="
              p-6
            ">

              {scanning ? (

                <div className="
                  overflow-hidden

                  rounded-3xl

                  border
                  border-slate-800
                ">

                  <QrReader

                    constraints={{
                      facingMode:
                        "environment",
                    }}

                    onResult={
                      handleScan
                    }

                    className="
                      w-full
                    "

                    containerStyle={{
                      width: "100%",
                    }}
                  />

                </div>

              ) : (

                <div className="
                  bg-slate-800/50

                  border
                  border-slate-700

                  rounded-3xl

                  p-8

                  text-center
                ">

                  <div className="
                    w-24
                    h-24

                    rounded-full

                    bg-emerald-500/10

                    flex
                    items-center
                    justify-center

                    mx-auto

                    text-emerald-400
                  ">

                    <ShieldCheck
                      size={42}
                    />

                  </div>

                  <h3 className="
                    text-3xl
                    font-bold
                    text-white

                    mt-6
                  ">

                    Access Granted

                  </h3>

                  <p className="
                    text-slate-400

                    mt-2
                  ">

                    Vehicle verified successfully

                  </p>


                  {/* TIMER */}

                  <div className="
                    mt-8

                    bg-slate-900

                    border
                    border-slate-700

                    rounded-2xl

                    p-5
                  ">

                    <p className="
                      text-slate-400
                      text-sm
                    ">

                      Parking Session Timer

                    </p>

                    <h2 className="
                      text-4xl
                      font-bold
                      text-emerald-400

                      mt-3
                    ">

                      {formattedTime}

                    </h2>

                  </div>


                  {/* RESET */}

                  <button

                    onClick={
                      resetScanner
                    }

                    className="
                      mt-8

                      px-6
                      py-3

                      rounded-2xl

                      bg-emerald-500

                      text-black
                      font-semibold

                      hover:bg-emerald-400

                      transition-all
                    "
                  >

                    Scan Another Vehicle

                  </button>

                </div>
              )}

              {/* ERROR */}

              {scanError && (

                <div className="
                  mt-5

                  bg-red-500/10

                  border
                  border-red-500/20

                  rounded-2xl

                  px-5
                  py-4

                  text-red-400

                  flex
                  items-center
                  gap-3
                ">

                  <ShieldAlert
                    size={20}
                  />

                  {scanError}

                </div>
              )}

            </div>

          </div>


          {/* ====================================== */}
          {/* INFO */}
          {/* ====================================== */}

          <div className="
            space-y-6
          ">

            {/* SESSION */}

            <div className="
              bg-slate-900

              border
              border-slate-800

              rounded-3xl

              p-6
            ">

              <h2 className="
                text-xl
                font-bold
                text-white

                mb-5
              ">

                Active Session

              </h2>

              {session ? (

                <div className="
                  space-y-5
                ">

                  {/* VEHICLE */}

                  <div className="
                    flex
                    items-center
                    gap-4
                  ">

                    <div className="
                      w-14
                      h-14

                      rounded-2xl

                      bg-emerald-500/10

                      flex
                      items-center
                      justify-center

                      text-emerald-400
                    ">

                      <Car
                        size={28}
                      />

                    </div>

                    <div>

                      <h3 className="
                        text-lg
                        font-bold
                        text-white
                      ">

                        {
                          session.vehicle_number
                        }

                      </h3>

                      <p className="
                        text-slate-400
                      ">

                        {
                          session.owner
                        }

                      </p>

                    </div>

                  </div>


                  {/* SLOT */}

                  <div className="
                    flex
                    items-center
                    justify-between
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2

                      text-slate-400
                    ">

                      <ParkingCircle
                        size={18}
                      />

                      Assigned Slot

                    </div>

                    <div className="
                      text-emerald-400
                      font-semibold
                    ">

                      {assignedSlot}

                    </div>

                  </div>


                  {/* ENTRY */}

                  <div className="
                    flex
                    items-center
                    justify-between
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2

                      text-slate-400
                    ">

                      <Clock
                        size={18}
                      />

                      Entry Time

                    </div>

                    <div className="
                      text-white
                    ">

                      {
                        session.entryTime
                      }

                    </div>

                  </div>


                  {/* LOCATION */}

                  <div className="
                    flex
                    items-center
                    justify-between
                  ">

                    <div className="
                      flex
                      items-center
                      gap-2

                      text-slate-400
                    ">

                      <MapPin
                        size={18}
                      />

                      Location

                    </div>

                    <div className="
                      text-white
                    ">

                      Smart Gate A

                    </div>

                  </div>

                </div>

              ) : (

                <div className="
                  text-slate-500
                ">

                  No active session

                </div>
              )}

            </div>


            {/* LIVE STATUS */}

            <div className="
              bg-slate-900

              border
              border-slate-800

              rounded-3xl

              p-6
            ">

              <h2 className="
                text-xl
                font-bold
                text-white

                mb-5
              ">

                System Status

              </h2>

              <div className="
                space-y-4
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <div className="
                    flex
                    items-center
                    gap-2

                    text-slate-400
                  ">

                    <Camera
                      size={18}
                    />

                    Scanner

                  </div>

                  <div className="
                    text-emerald-400
                    font-medium
                  ">

                    Active

                  </div>

                </div>


                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <div className="
                    flex
                    items-center
                    gap-2

                    text-slate-400
                  ">

                    <Activity
                      size={18}
                    />

                    IoT Sensors

                  </div>

                  <div className="
                    text-emerald-400
                    font-medium
                  ">

                    Online

                  </div>

                </div>


                <div className="
                  flex
                  items-center
                  justify-between
                ">

                  <div className="
                    flex
                    items-center
                    gap-2

                    text-slate-400
                  ">

                    <ParkingCircle
                      size={18}
                    />

                    Available Slots

                  </div>

                  <div className="
                    text-white
                    font-semibold
                  ">

                    {
                      AVAILABLE_SLOTS.length
                    }

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ========================================== */}
        {/* LOGS */}
        {/* ========================================== */}

        <div className="
          bg-slate-900

          border
          border-slate-800

          rounded-3xl

          overflow-hidden
        ">

          {/* HEADER */}

          <div className="
            px-6
            py-5

            border-b
            border-slate-800
          ">

            <h2 className="
              text-2xl
              font-bold
              text-white
            ">

              Gate Activity Logs

            </h2>

          </div>


          {/* TABLE */}

          <div className="
            divide-y
            divide-slate-800
          ">

            {logs.length === 0 ? (

              <div className="
                px-6
                py-10

                text-center

                text-slate-500
              ">

                No activity yet

              </div>

            ) : (

              logs.map((log) => (

                <div

                  key={log.id}

                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-5

                    gap-4

                    px-6
                    py-5

                    hover:bg-slate-800/40

                    transition-all
                  "
                >

                  <div className="
                    text-white
                    font-semibold
                  ">

                    {
                      log.vehicle_number
                    }

                  </div>

                  <div className="
                    text-slate-300
                  ">

                    {
                      log.owner
                    }

                  </div>

                  <div className="
                    text-emerald-400
                    font-medium
                  ">

                    {log.slot}

                  </div>

                  <div className="
                    text-slate-300
                  ">

                    {
                      log.entryTime
                    }

                  </div>

                  <div className="
                    text-emerald-400
                    font-medium
                  ">

                    Access Granted

                  </div>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}