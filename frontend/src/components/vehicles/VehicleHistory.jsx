import {

  Clock,

  MapPin,

  IndianRupee,

  ShieldAlert,

  CheckCircle2,

  ParkingCircle,

} from "lucide-react";


// ======================================================
// DUMMY HISTORY
// ======================================================

const HISTORY = [

  {
    id: 1,

    vehicle_number:
      "DL01AB1234",

    slot: "A-12",

    entry: "10:15 AM",

    exit: "12:45 PM",

    amount: 120,

    status: "completed",
  },

  {
    id: 2,

    vehicle_number:
      "UP32XY5678",

    slot: "B-07",

    entry: "01:10 PM",

    exit: "--",

    amount: 0,

    status: "active",
  },

  {
    id: 3,

    vehicle_number:
      "DL09ZX9001",

    slot: "C-02",

    entry: "09:00 AM",

    exit: "09:20 AM",

    amount: 50,

    status: "violation",
  },
];


// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({

  status,

}) {

  const styles = {

    completed: `
      bg-emerald-500/10
      text-emerald-400
    `,

    active: `
      bg-blue-500/10
      text-blue-400
    `,

    violation: `
      bg-red-500/10
      text-red-400
    `,
  };

  const icons = {

    completed:
      <CheckCircle2 size={14} />,

    active:
      <ParkingCircle size={14} />,

    violation:
      <ShieldAlert size={14} />,
  };

  return (

    <div className={`
      inline-flex
      items-center
      gap-2

      px-3
      py-1

      rounded-full

      text-xs
      font-semibold
      capitalize

      ${
        styles[status]
      }
    `}>

      {icons[status]}

      {status}

    </div>
  );
}


// ======================================================
// VEHICLE HISTORY
// ======================================================

export default function VehicleHistory() {

  return (

    <div className="
      bg-slate-900

      border
      border-slate-800

      rounded-3xl

      overflow-hidden
    ">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="
        px-6
        py-5

        border-b
        border-slate-800
      ">

        <div className="
          flex
          items-center
          justify-between
        ">

          <div>

            <h2 className="
              text-2xl
              font-bold
              text-white
            ">

              Vehicle Parking History

            </h2>

            <p className="
              text-slate-400
              mt-1
            ">

              Smart parking sessions,
              billing,
              and violations

            </p>

          </div>

        </div>

      </div>


      {/* ========================================== */}
      {/* TABLE HEADER */}
      {/* ========================================== */}

      <div className="
        hidden
        lg:grid

        grid-cols-7

        gap-4

        px-6
        py-4

        border-b
        border-slate-800

        text-sm
        font-semibold

        text-slate-400
      ">

        <div>Vehicle</div>

        <div>Parking Slot</div>

        <div>Entry Time</div>

        <div>Exit Time</div>

        <div>Amount</div>

        <div>Status</div>

        <div>Location</div>

      </div>


      {/* ========================================== */}
      {/* ROWS */}
      {/* ========================================== */}

      <div className="
        divide-y
        divide-slate-800
      ">

        {HISTORY.map((item) => (

          <div

            key={item.id}

            className="
              grid
              grid-cols-1
              lg:grid-cols-7

              gap-4

              px-6
              py-5

              hover:bg-slate-800/40

              transition-all
            "
          >

            {/* VEHICLE */}

            <div>

              <p className="
                text-white
                font-semibold
              ">

                {
                  item.vehicle_number
                }

              </p>

            </div>


            {/* SLOT */}

            <div className="
              flex
              items-center
              gap-2

              text-slate-300
            ">

              <ParkingCircle
                size={16}
                className="
                  text-emerald-400
                "
              />

              {item.slot}

            </div>


            {/* ENTRY */}

            <div className="
              flex
              items-center
              gap-2

              text-slate-300
            ">

              <Clock
                size={16}
                className="
                  text-blue-400
                "
              />

              {item.entry}

            </div>


            {/* EXIT */}

            <div className="
              text-slate-300
            ">

              {item.exit}

            </div>


            {/* AMOUNT */}

            <div className="
              flex
              items-center
              gap-1

              text-emerald-400
              font-semibold
            ">

              <IndianRupee
                size={16}
              />

              {item.amount}

            </div>


            {/* STATUS */}

            <div>

              <StatusBadge
                status={
                  item.status
                }
              />

            </div>


            {/* LOCATION */}

            <div className="
              flex
              items-center
              gap-2

              text-slate-400
            ">

              <MapPin size={16} />

              Smart Parking Zone

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}