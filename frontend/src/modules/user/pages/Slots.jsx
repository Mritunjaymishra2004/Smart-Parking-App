import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
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
  { id: 1, number: "DL01AB1234" },
  { id: 2, number: "UP32XY5678" },
];

export default function BookSlot() {
  const { slotId } = useParams();
  const navigate = useNavigate();

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [hours, setHours] = useState(1);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  const slot = {
    id: slotId,
    code: `A-${slotId}`,
    zone: "Zone A",
    type: "Car",
  };

  const price = useMemo(
    () => hours * 50,
    [hours]
  );

  const handleBooking = () => {
    if (!selectedVehicle) {
      setError("Please select vehicle");
      return;
    }

    setBooking(true);

    const bookingData = {
      slot,
      price,
      hours,
      vehicle:
        DEMO_VEHICLES.find(
          (v) =>
            v.id ===
            Number(selectedVehicle)
        )?.number,
      bookingTime:
        new Date().toISOString(),
      status: "BOOKED",
    };

    localStorage.setItem(
      "currentBooking",
      JSON.stringify(bookingData)
    );

    setTimeout(() => {
      navigate("/user/payment");
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 pb-10">

      <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-8">
        <h1 className="text-4xl font-bold text-white mb-6">
          Slot {slot.code}
        </h1>

        <p className="text-emerald-400">
          Smart Reservation
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-8">

        <h2 className="text-3xl font-bold mb-8 text-white">
          Booking Summary
        </h2>

        {error && (
          <div className="p-4 mb-5 rounded-2xl bg-red-500/10 text-red-400">
            {error}
          </div>
        )}

        <select
          value={selectedVehicle}
          onChange={(e) =>
            setSelectedVehicle(
              e.target.value
            )
          }
          className="w-full p-4 rounded-2xl bg-slate-800 mb-6 text-white"
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
          className="w-full p-4 rounded-2xl bg-slate-800 mb-6 text-white"
        />

        <div className="text-4xl font-bold text-emerald-400 mb-8">
          ₹{price}
        </div>

        <button
          onClick={handleBooking}
          disabled={booking}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 text-black font-semibold"
        >
          {booking
            ? "Processing..."
            : "Confirm Booking"}
        </button>

      </div>
    </div>
  );
}