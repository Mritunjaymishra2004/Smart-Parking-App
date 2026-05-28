import {
  useState,
} from "react";

import {
  Calendar,
  Car,
  IndianRupee,
  Clock3,
  XCircle,
  CheckCircle2,
  Activity,
  Ticket,
  MapPin,
  Timer,
} from "lucide-react";

import EmptyState from "../../../shared/ui/EmptyState";


// ======================================================
// DEMO BOOKINGS
// ======================================================

const DEMO_BOOKINGS = [
  {
    id: 1,
    slot: "A-12",
    vehicle: "DL01AB1234",
    price: 120,
    date: "28 May 2026",
    start: "10:00 AM",
    end: "12:00 PM",
    duration: "2 Hours",
    status: "ACTIVE",
  },
  {
    id: 2,
    slot: "B-08",
    vehicle: "UP32XY5678",
    price: 80,
    date: "29 May 2026",
    start: "2:00 PM",
    end: "4:00 PM",
    duration: "2 Hours",
    status: "BOOKED",
  },
  {
    id: 3,
    slot: "C-05",
    vehicle: "HR26XY9090",
    price: 150,
    date: "25 May 2026",
    start: "6:00 PM",
    end: "9:00 PM",
    duration: "3 Hours",
    status: "COMPLETED",
  },
];


// ======================================================
// STATUS STYLE
// ======================================================

const statusStyles = {
  ACTIVE:
    "bg-blue-500/20 text-blue-400",

  BOOKED:
    "bg-amber-500/20 text-amber-400",

  COMPLETED:
    "bg-emerald-500/20 text-emerald-400",
};


// ======================================================
// PAGE
// ======================================================

export default function MyBookings() {
  const [bookings,
    setBookings] =
    useState(
      DEMO_BOOKINGS
    );

  const cancelBooking =
    (id) => {
      setBookings((prev) =>
        prev.filter(
          (b) =>
            b.id !== id
        )
      );
    };

  if (!bookings.length) {
    return (
      <EmptyState
        title="No Bookings Yet"
        description="Your parking reservations will appear here."
      />
    );
  }

  return (
    <div className="min-h-screen space-y-8 pb-10">

      {/* HERO */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-cyan-500/10 border border-white/10 shadow-xl">

        <h1 className="text-4xl md:text-5xl font-bold text-white">
          My Bookings
        </h1>

        <p className="text-slate-300 mt-3">
          Manage your smart parking reservations
        </p>

      </div>


      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5">

        <StatCard
          title="Total"
          value={bookings.length}
        />

        <StatCard
          title="Active"
          value={
            bookings.filter(
              b =>
                b.status ===
                "ACTIVE"
            ).length
          }
        />

        <StatCard
          title="Completed"
          value={
            bookings.filter(
              b =>
                b.status ===
                "COMPLETED"
            ).length
          }
        />

      </div>


      {/* BOOKINGS */}
      <div className="grid lg:grid-cols-2 gap-6">

        {bookings.map((b) => (
          <div
            key={b.id}
            className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 hover:border-emerald-500/30 transition-all"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

              <div className="flex items-center gap-3">
                <Ticket className="text-emerald-400" />

                <h2 className="text-2xl font-bold text-white">
                  Slot {b.slot}
                </h2>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${statusStyles[b.status]}`}
              >
                {b.status}
              </span>

            </div>


            {/* DETAILS */}
            <Info
              icon={<Car />}
              label="Vehicle"
              value={b.vehicle}
            />

            <Info
              icon={<IndianRupee />}
              label="Price"
              value={`₹${b.price}`}
            />

            <Info
              icon={<Calendar />}
              label="Date"
              value={b.date}
            />

            <Info
              icon={<Clock3 />}
              label="Time"
              value={`${b.start} - ${b.end}`}
            />

            <Info
              icon={<Timer />}
              label="Duration"
              value={b.duration}
            />

            <Info
              icon={<MapPin />}
              label="Location"
              value="Smart Parking Zone"
            />


            {/* ACTION */}
            {b.status ===
              "BOOKED" && (
              <button
                onClick={() =>
                  cancelBooking(
                    b.id
                  )
                }
                className="mt-6 w-full py-3 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center gap-2 transition"
              >
                <XCircle size={18} />
                Cancel Booking
              </button>
            )}

            {b.status ===
              "COMPLETED" && (
              <div className="mt-6 w-full py-3 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 />
                Completed
              </div>
            )}

            {b.status ===
              "ACTIVE" && (
              <div className="mt-6 w-full py-3 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center gap-2">
                <Activity />
                Active Session
              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}


// ======================================================
// INFO CARD
// ======================================================

function Info({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 mt-3">

      <div className="flex items-center gap-3 text-white">
        {icon}
        {label}
      </div>

      <span className="text-emerald-400 font-medium">
        {value}
      </span>

    </div>
  );
}


// ======================================================
// STATS
// ======================================================

function StatCard({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-5 text-center">

      <h3 className="text-slate-400 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold text-emerald-400 mt-2">
        {value}
      </p>

    </div>
  );
}