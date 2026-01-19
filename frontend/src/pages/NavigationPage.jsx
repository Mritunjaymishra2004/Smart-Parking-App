import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/common/Navbar";
import DashboardBackground from "../components/common/DashboardBackground";

export default function NavigationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // slot & selected vehicle come from previous page
  const slot = state?.slot;
  const selectedVehicle = state?.vehicle;

  if (!slot || !selectedVehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        No slot or vehicle selected
      </div>
    );
  }

  const handleArrive = async () => {
    try {
      // 🔥 Correct backend call
      const res = await api.post("/vehicle/entry/", {
        vehicle: selectedVehicle.id,
      });

      const session = res.data;

      // Navigate to payment with active session
      navigate("/payment", {
        state: session,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create parking session");
    }
  };

  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="min-h-screen text-white flex flex-col items-center justify-center">

          <h1 className="text-3xl font-bold mb-4">
            📍 Navigate to Slot {slot.code}
          </h1>

          <div className="bg-gray-800 p-6 rounded-xl mb-6 text-center">
            <p className="mb-2">Your parking slot is reserved.</p>
            <p>Zone: {slot.zone || "Main Parking Area"}</p>
            <p className="mt-2 text-emerald-400">
              Vehicle: {selectedVehicle.plate}
            </p>
          </div>

          {/* Google Maps */}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.google.com/maps?q=${slot.y},${slot.x}`}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg mb-6"
          >
            🗺️ Start Google Navigation
          </a>

          {/* Arrival */}
          <button
            onClick={handleArrive}
            className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg text-xl"
          >
            🚗 I have parked
          </button>

        </div>
      </DashboardBackground>
    </>
  );
}















