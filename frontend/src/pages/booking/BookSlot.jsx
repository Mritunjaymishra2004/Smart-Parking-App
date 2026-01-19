import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "../../components/common/Navbar";
import DashboardBackground from "../../components/common/DashboardBackground";

export default function BookSlot() {
  const { slotId } = useParams();
  const navigate = useNavigate();

  const [slot, setSlot] = useState(null);
  const [hours, setHours] = useState(1);

  useEffect(() => {
    api.get(`/slots/${slotId}/`).then(res => setSlot(res.data));
  }, [slotId]);

  const book = async () => {
    try {
      const start = new Date();
      const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
      const price = hours * 50;

      const res = await api.post("/reservations/", {
        slot: slotId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        price
      });

      // Go directly to navigation flow
      navigate("/navigate", {
        state: {
          id: slot.id,
          code: slot.code,
          x: slot.x,
          y: slot.y,
          zone: slot.zone
        }
      });

    } catch {
      alert("Booking failed. Slot unavailable.");
    }
  };

  if (!slot) return null;

  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="min-h-screen flex justify-center items-center text-white">

          <div className="bg-gray-800 p-8 rounded-xl w-[400px] shadow-xl">

            <h1 className="text-2xl font-bold mb-4">
              Book Slot {slot.code}
            </h1>

            <p className="mb-2">Zone: {slot.zone}</p>
            <p className="mb-4">Type: {slot.type}</p>

            <label className="block mb-1">Parking Hours</label>
            <input
              type="number"
              min="1"
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />

            <p className="mb-6 font-semibold">
              Price: ₹{hours * 50}
            </p>

            <button
              onClick={book}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded text-lg"
            >
              Confirm & Navigate
            </button>

          </div>

        </div>
      </DashboardBackground>
    </>
  );
}
