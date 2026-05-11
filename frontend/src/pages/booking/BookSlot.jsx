// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import api from "../../services/api";
// import Navbar from "../../components/common/Navbar";
// import DashboardBackground from "../../components/common/DashboardBackground";

// export default function BookSlot() {
//   const { slotId } = useParams();
//   const navigate = useNavigate();

//   const [slot, setSlot] = useState(null);
//   const [hours, setHours] = useState(1);

//   useEffect(() => {
//     api.get(`/slots/${slotId}/`).then(res => setSlot(res.data));
//   }, [slotId]);

//   const book = async () => {
//     try {
//       const start = new Date();
//       const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
//       const price = hours * 50;

//       const res = await api.post("/reservations/", {
//         slot: slotId,
//         start_time: start.toISOString(),
//         end_time: end.toISOString(),
//         price
//       });

//       // Go directly to navigation flow
//       navigate("/navigate", {
//         state: {
//           id: slot.id,
//           code: slot.code,
//           x: slot.x,
//           y: slot.y,
//           zone: slot.zone
//         }
//       });

//     } catch {
//       alert("Booking failed. Slot unavailable.");
//     }
//   };

//   if (!slot) return null;

//   return (
//     <>
//       <Navbar />

//       <DashboardBackground>
//         <div className="min-h-screen flex justify-center items-center text-white">

//           <div className="bg-gray-800 p-8 rounded-xl w-[400px] shadow-xl">

//             <h1 className="text-2xl font-bold mb-4">
//               Book Slot {slot.code}
//             </h1>

//             <p className="mb-2">Zone: {slot.zone}</p>
//             <p className="mb-4">Type: {slot.type}</p>

//             <label className="block mb-1">Parking Hours</label>
//             <input
//               type="number"
//               min="1"
//               value={hours}
//               onChange={e => setHours(Number(e.target.value))}
//               className="w-full p-2 mb-4 bg-gray-700 rounded"
//             />

//             <p className="mb-6 font-semibold">
//               Price: ₹{hours * 50}
//             </p>

//             <button
//               onClick={book}
//               className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded text-lg"
//             >
//               Confirm & Navigate
//             </button>

//           </div>

//         </div>
//       </DashboardBackground>
//     </>
//   );
// }


import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import Navbar from "../../components/common/Navbar";
import DashboardBackground from "../../components/common/DashboardBackground";

export default function BookSlot() {
  const { slotId } = useParams();
  const navigate = useNavigate();

  const [slot, setSlot] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // 🔹 Load Slot + Vehicles
  // ===============================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [slotRes, vehicleRes] = await Promise.all([
          api.get(`/slots/${slotId}/`),
          api.get("/vehicles/")
        ]);

        setSlot(slotRes.data);
        setVehicles(vehicleRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      }
    };

    loadData();
  }, [slotId]);

  // ===============================
  // 🔹 Start Parking (Main Flow)
  // ===============================
  const handleStartParking = async () => {
    if (!selectedVehicle) {
      return setError("Please select a vehicle");
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Reserve slot (optional but good)
      const start = new Date();
      const end = new Date(start.getTime() + hours * 60 * 60 * 1000);
      const price = hours * 50;

      await api.post("/reservations/", {
        slot: slotId,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        price
      });

      // Step 2: Start parking session (REAL SYSTEM)
      const res = await api.post("/vehicle/entry/", {
        vehicle: selectedVehicle
      });

      // Save session
      localStorage.setItem("session_id", res.data.session_id);

      // Step 3: Navigate to map
      navigate("/navigate", {
        state: {
          id: slot.id,
          code: slot.code,
          x: slot.x,
          y: slot.y,
          zone: slot.zone
        }
      });

    } catch (err) {
      console.error(err);
      setError("Booking failed. Slot unavailable.");
    } finally {
      setLoading(false);
    }
  };

  // if (!slot) {
  //   return (
  //     <div className="h-screen flex items-center justify-center text-white">
  //       Loading slot...
  //     </div>
  //   );
  // }
  if (!slot) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading slot...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="min-h-screen flex justify-center items-center text-white">

          <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 p-8 rounded-2xl w-[420px] shadow-xl">

            <h1 className="text-2xl font-bold mb-4 text-emerald-400">
              Book Slot {slot.code}
            </h1>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <p className="mb-2">Zone: {slot.zone}</p>
            <p className="mb-4">Type: {slot.type}</p>

            {/* VEHICLE SELECT */}
            <label className="block mb-1">Select Vehicle</label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full p-2 mb-4 bg-slate-800 border border-slate-700 rounded"
            >
              <option value="">Choose vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.number} ({v.type})
                </option>
              ))}
            </select>

            {/* HOURS */}
            <label className="block mb-1">Parking Hours</label>
            <input
              type="number"
              min="1"
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
              className="w-full p-2 mb-4 bg-slate-800 border border-slate-700 rounded"
            />

            {/* PRICE */}
            <p className="mb-6 font-semibold text-lg">
              Estimated Price: ₹{hours * 50}
            </p>

            {/* BUTTON */}
            <button
              onClick={handleStartParking}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Processing..." : "Confirm & Start Parking"}
            </button>

          </div>

        </div>
      </DashboardBackground>
    </>
  );
}