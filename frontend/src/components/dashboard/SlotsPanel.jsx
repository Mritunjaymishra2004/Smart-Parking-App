import { useEffect, useState } from "react";
import api from "../../services/api";
import { connectSocket } from "../../utils/socket";

export default function SlotsPanel() {
  const [slots, setSlots] = useState([]);

  // Load slots from backend
  useEffect(() => {
    api.get("/slots/")
      .then((res) => setSlots(res.data))
      .catch((err) => console.error("Slots error", err));

    // WebSocket live updates
    connectSocket(
      (update) => {
        setSlots((prev) =>
          prev.map((s) =>
            s.id === update.slot_id ? { ...s, status: update.status } : s
          )
        );
      },
      () => {}
    );
  }, []);

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">
        Live Parking Slots
      </h3>

      <div className="grid grid-cols-6 gap-3">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`p-3 text-center rounded-lg font-bold cursor-pointer transition-all
            ${
              slot.status === "Free"
                ? "bg-emerald-500/20 text-emerald-400 hover:scale-105 hover:shadow-emerald-500/40"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {slot.slot_number}
            <p className="text-xs mt-1">{slot.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}