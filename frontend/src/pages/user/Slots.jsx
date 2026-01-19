import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import DashboardBackground from "../../components/common/DashboardBackground";

const mockSlots = [
  { id: 1, code: "A1", status: "AVAILABLE" },
  { id: 2, code: "A2", status: "OCCUPIED" },
  { id: 3, code: "B1", status: "AVAILABLE" },
  { id: 4, code: "B2", status: "RESERVED" },
];

export default function Slots() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState(mockSlots);

  const book = (slot) => {
    setSlots(slots.map(s =>
      s.id === slot.id ? { ...s, status: "RESERVED" } : s
    ));

    // Send user to navigation flow
    navigate("/navigate", {
      state: {
        id: slot.id,
        code: slot.code,
        x: 28.6139,
        y: 77.209,
        zone: "Main Lot"
      }
    });
  };

  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="min-h-screen text-white p-10">

          <h2 className="text-3xl font-bold mb-6">
            🅿️ Live Parking Slots
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {slots.map(slot => (
              <div
                key={slot.id}
                className={`p-6 rounded-xl shadow-xl text-center font-bold transition
                  ${slot.status === "AVAILABLE"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : slot.status === "OCCUPIED"
                    ? "bg-red-600"
                    : "bg-yellow-500 text-black"}`}
              >
                <div className="text-2xl">{slot.code}</div>
                <p className="mt-2 text-sm">{slot.status}</p>

                {slot.status === "AVAILABLE" && (
                  <button
                    onClick={() => book(slot)}
                    className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                  >
                    Book Slot
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      </DashboardBackground>
    </>
  );
}
