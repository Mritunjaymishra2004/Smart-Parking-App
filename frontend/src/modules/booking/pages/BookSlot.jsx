import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useMemo,
} from "react";

import {
  Car,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  Zap,
  Wifi,
} from "lucide-react";

const DEMO_VEHICLES = [
  {
    id: 1,
    number: "DL01AB1234",
  },
  {
    id: 2,
    number: "UP32XY5678",
  },
];

export default function BookSlot() {
  const { slotId } =
    useParams();

  const navigate =
    useNavigate();

  const [selectedVehicle,
    setSelectedVehicle] =
    useState("");

  const [hours,
    setHours] =
    useState(1);

  const [booking,
    setBooking] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const slot = {
    id: slotId,
    code: `A-${slotId}`,
    zone: "Zone A",
    type: "Car",
  };

  const price =
    useMemo(
      () => hours * 50,
      [hours]
    );

  const handleBooking =
    () => {
      if (!selectedVehicle) {
        setError(
          "Please select vehicle"
        );
        return;
      }

      setBooking(true);

      setTimeout(() => {
        navigate(
          "/user/payment",
          {
            state: {
              slot,
              price,
              hours,
            },
          }
        );
      }, 1500);
    };

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 pb-10">

      {/* SLOT INFO */}
      <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-8 shadow-xl">

        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg">
              <MapPin size={34} />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-white">
                Slot {slot.code}
              </h1>

              <p className="text-emerald-400">
                Smart Reservation
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <Wifi />
            Live
          </div>

        </div>

        <Info
          icon={<MapPin />}
          label="Zone"
          value={slot.zone}
        />

        <Info
          icon={<Car />}
          label="Vehicle Type"
          value={slot.type}
        />

        <Info
          icon={<ShieldCheck />}
          label="Security"
          value="24/7 CCTV"
        />

        <Info
          icon={<Zap />}
          label="IoT Sensor"
          value="Connected"
        />

        <Info
          icon={<CheckCircle2 />}
          label="Availability"
          value="Available"
        />

      </div>

      {/* BOOKING PANEL */}
      <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-8 shadow-xl">

        <h2 className="text-3xl font-bold mb-8 text-white">
          Booking Summary
        </h2>

        {error && (
          <div className="p-4 mb-5 rounded-2xl bg-red-500/10 text-red-400">
            {error}
          </div>
        )}

        {/* VEHICLE */}
        <label className="block mb-3 text-white">
          Select Vehicle
        </label>

        <select
          value={selectedVehicle}
          onChange={(e) =>
            setSelectedVehicle(
              e.target.value
            )
          }
          className="w-full p-4 rounded-2xl bg-slate-800 mb-6 text-white border border-slate-700"
        >
          <option value="">
            Choose Vehicle
          </option>

          {DEMO_VEHICLES.map(
            (v) => (
              <option
                key={v.id}
                value={v.id}
              >
                {v.number}
              </option>
            )
          )}
        </select>

        {/* HOURS */}
        <label className="block mb-3 text-white">
          Duration (Hours)
        </label>

        <input
          type="number"
          min="1"
          value={hours}
          onChange={(e) =>
            setHours(
              Number(
                e.target.value
              )
            )
          }
          className="w-full p-4 rounded-2xl bg-slate-800 mb-6 text-white border border-slate-700"
        />

        {/* PRICE */}
        <div className="rounded-2xl p-6 bg-emerald-500/10 border border-emerald-500/20 mb-8">

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2 text-white">
              <IndianRupee />
              Total Amount
            </span>

            <span className="text-4xl font-bold text-emerald-400">
              ₹{price}
            </span>
          </div>

        </div>

        {/* CONFIRM */}
        <button
          onClick={handleBooking}
          disabled={booking}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 font-semibold text-black flex items-center justify-center gap-3 hover:scale-105 transition"
        >
          <Clock3 />

          {booking
            ? "Processing Booking..."
            : "Confirm Booking"}
        </button>

      </div>

    </div>
  );
}

function Info({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex justify-between items-center p-5 rounded-2xl bg-white/5 mb-4">
      <div className="flex items-center gap-3 text-white">
        {icon}
        {label}
      </div>

      <span className="text-emerald-400">
        {value}
      </span>
    </div>
  );
}