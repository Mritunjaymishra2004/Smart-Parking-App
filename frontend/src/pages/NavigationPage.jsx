import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/common/Navbar";
import DashboardBackground from "../components/common/DashboardBackground";
import { useParking } from "../context/ParkingContext";

export default function NavigationPage() {
const { state } = useLocation();
const navigate = useNavigate();
const { refreshSession } = useParking();

const slot = state?.slot;
const selectedVehicle = state?.vehicle;

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

// ===============================
// 🔐 SAFETY REDIRECT
// ===============================
useEffect(() => {
if (!slot || !selectedVehicle) {
navigate("/dashboard", { replace: true });
}
}, [slot, selectedVehicle, navigate]);

if (!slot || !selectedVehicle) return null;

const lat = slot?.y || 28.6105;
const lng = slot?.x || 77.2007;

// ===============================
// 🚗 ARRIVE HANDLER
// ===============================
const handleArrive = async () => {
if (loading) return;


setLoading(true);
setError("");

try {
  const res = await api.post("/vehicle/entry/", {
    vehicle: selectedVehicle.id,
  });

  const session = res.data;

  await refreshSession();

  navigate("/payment", {
    state: session,
  });

} catch (err) {
  console.error(err);

  setError(
    err?.response?.data?.message ||
    "Unable to start parking. Please try again."
  );
} finally {
  setLoading(false);
}


};

return (
<> <Navbar />


  <DashboardBackground>
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">

      <h1 className="text-3xl font-bold mb-6">
        Navigate to Slot {slot.code}
      </h1>

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* SLOT INFO */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center mb-6 w-full max-w-md">
        <p className="mb-2 text-lg">
          Your parking slot is reserved
        </p>

        <p className="text-gray-400">
          Zone: {slot.zone || "Main Parking Area"}
        </p>

        <p className="mt-3 text-emerald-400 font-semibold">
          Vehicle: {selectedVehicle.plate || "Unknown"}
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Coordinates: {lat}, {lng}
        </p>
      </div>

      {/* MAP PREVIEW */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-slate-700">
        <iframe
          title="slot-map"
          width="350"
          height="250"
          loading="lazy"
          className="border-0"
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 flex-wrap justify-center">

        <a
          target="_blank"
          rel="noreferrer"
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg"
        >
          Start Navigation
        </a>

        <button
          onClick={() => navigate("/map")}
          className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-lg"
        >
          Back to Map
        </button>

      </div>

      {/* ARRIVE BUTTON */}
      <button
        onClick={handleArrive}
        disabled={loading}
        className={`mt-6 px-8 py-3 rounded-lg text-xl font-semibold ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {loading ? "Processing..." : "I have parked"}
      </button>

    </div>
  </DashboardBackground>

  {/* LOADING OVERLAY */}
  {loading && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-white text-xl">
      Processing your parking session...
    </div>
  )}
</>

);
}


















// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../services/api";
// import Navbar from "../components/common/Navbar";
// import DashboardBackground from "../components/common/DashboardBackground";
// 
// export default function NavigationPage() {
//   const { state } = useLocation();
//   const navigate = useNavigate();
// 
//   const slot = state?.slot;
//   const selectedVehicle = state?.vehicle;
// 
//   // Safety check
//   if (!slot || !selectedVehicle) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-xl">
//         Missing slot or vehicle information.
//       </div>
//     );
//   }
// 
//   const lat = slot.y;
//   const lng = slot.x;
// 
//   const handleArrive = async () => {
//     try {
//       const res = await api.post("/vehicle/entry/", {
//         vehicle: selectedVehicle.id,
//       });
// 
//       const session = res.data;
// 
//       navigate("/payment", {
//         state: session,
//       });
// 
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create parking session");
//     }
//   };
// 
//   return (
//     <>
//       <Navbar />
// 
//       <DashboardBackground>
//         <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">
// 
//           <h1 className="text-3xl font-bold mb-6">
//             Navigate to Slot {slot.code}
//           </h1>
// 
//           {/* Slot Info Card */}
//           <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center mb-6 w-full max-w-md">
//             <p className="mb-2 text-lg">
//               Your parking slot is reserved
//             </p>
// 
//             <p className="text-gray-400">
//               Zone: {slot.zone || "Main Parking Area"}
//             </p>
// 
//             <p className="mt-3 text-emerald-400 font-semibold">
//               Vehicle: {selectedVehicle.plate}
//             </p>
// 
//             <p className="mt-2 text-sm text-gray-400">
//               Coordinates: {lat}, {lng}
//             </p>
//           </div>
// 
//           {/* Map Preview */}
//           <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
//             <iframe
//               title="slot-map"
//               width="350"
//               height="250"
//               loading="lazy"
//               className="border-0"
//               src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
//             />
//           </div>
// 
//           {/* Start Navigation */}
//           <a
//             target="_blank"
//             rel="noreferrer"
//             href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
//             className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg mb-6 text-lg"
//           >
//             Start Navigation
//           </a>
// 
//           {/* Arrive Button */}
//           <button
//             onClick={handleArrive}
//             className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-lg text-xl font-semibold"
//           >
//             I have parked
//           </button>
// 
//         </div>
//       </DashboardBackground>
//     </>
//   );
// }
// 
// 
// 



// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../services/api";
// import Navbar from "../components/common/Navbar";
// import DashboardBackground from "../components/common/DashboardBackground";

// export default function NavigationPage() {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);

//   const slot = state?.slot;
//   const selectedVehicle = state?.vehicle;

//   // ===============================
//   // 🔐 SAFETY REDIRECT (FIXED)
//   // ===============================
//   useEffect(() => {
//     if (!slot || !selectedVehicle) {
//       console.warn("Missing navigation data");

//       // ✅ redirect instead of blank page
//       navigate("/dashboard", { replace: true });
//     }
//   }, [slot, selectedVehicle, navigate]);

//   // prevent crash render
//   if (!slot || !selectedVehicle) return null;

//   const lat = slot.y;
//   const lng = slot.x;

//   // ===============================
//   // 🚗 ARRIVE HANDLER (SAFE)
//   // ===============================
//   const handleArrive = async () => {
//     if (loading) return; // 🔒 prevent double click

//     try {
//       setLoading(true);

//       const res = await api.post("/vehicle/entry/", {
//         vehicle: selectedVehicle.id,
//       });

//       const session = res.data;

//       navigate("/payment", {
//         state: session,
//       });

//     } catch (err) {
//       console.error(err);
//       alert(err?.response?.data?.message || "Failed to create parking session");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <DashboardBackground>
//         <div className="min-h-screen text-white flex flex-col items-center justify-center p-6">

//           <h1 className="text-3xl font-bold mb-6">
//             Navigate to Slot {slot.code}
//           </h1>

//           {/* SLOT INFO */}
//           <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-center mb-6 w-full max-w-md">
//             <p className="mb-2 text-lg">
//               Your parking slot is reserved
//             </p>

//             <p className="text-gray-400">
//               Zone: {slot.zone || "Main Parking Area"}
//             </p>

//             <p className="mt-3 text-emerald-400 font-semibold">
//               Vehicle: {selectedVehicle.plate}
//             </p>

//             <p className="mt-2 text-sm text-gray-400">
//               Coordinates: {lat}, {lng}
//             </p>
//           </div>

//           {/* MAP PREVIEW */}
//           <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
//             <iframe
//               title="slot-map"
//               width="350"
//               height="250"
//               loading="lazy"
//               className="border-0"
//               src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
//             />
//           </div>

//           {/* GOOGLE NAVIGATION */}
//           <a
//             target="_blank"
//             rel="noreferrer"
//             href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
//             className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg mb-6 text-lg"
//           >
//             Start Navigation
//           </a>

//           {/* ARRIVE BUTTON */}
//           <button
//             onClick={handleArrive}
//             disabled={loading}
//             className={`px-8 py-3 rounded-lg text-xl font-semibold ${
//               loading
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-emerald-600 hover:bg-emerald-700"
//             }`}
//           >
//             {loading ? "Processing..." : "I have parked"}
//           </button>

//         </div>
//       </DashboardBackground>
//     </>
//   );
// }



