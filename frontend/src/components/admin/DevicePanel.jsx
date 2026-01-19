import { useEffect, useState } from "react";
import api from "../../services/api";

export default function DevicePanel() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/admin/live-vehicles/");
      setDevices(res.data);
      setError(null);
    } catch (e) {
      console.error("Device fetch error", e);
      setError("Backend not reachable – using demo data");

      // Fallback demo data
      setDevices([
        {
          vehicle_id: 1,
          plate: "DL01AB1234",
          speed: 18,
          heading: 90,
          x: 77.209,
          y: 28.613,
          updated: new Date().toISOString(),
        },
        {
          vehicle_id: 2,
          plate: "HR26DK8337",
          speed: 0,
          heading: 0,
          x: 77.210,
          y: 28.614,
          updated: new Date().toISOString(),
        },
      ]);
    }
  };

  useEffect(() => {
    load();
    const i = setInterval(load, 5000); // refresh every 5 sec
    return () => clearInterval(i);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-white mb-3">
        📡 Live Vehicle Devices
      </h2>

      {error && (
        <div className="text-yellow-400 text-sm mb-2">{error}</div>
      )}

      <div className="space-y-3">
        {devices.map((d) => (
          <div
            key={d.vehicle_id}
            className="flex justify-between items-center bg-slate-800 p-3 rounded-lg"
          >
            <div>
              <div className="font-bold text-white">
                {d.plate}
              </div>
              <div className="text-xs text-slate-400">
                Lat: {d.y.toFixed(4)} | Lng: {d.x.toFixed(4)}
              </div>
            </div>

            <div className="text-right">
              <div
                className={`text-sm font-semibold ${
                  d.speed > 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {d.speed > 0 ? "Moving" : "Stopped"}
              </div>
              <div className="text-xs text-slate-400">
                {d.speed} km/h
              </div>
            </div>
          </div>
        ))}

        {devices.length === 0 && (
          <div className="text-slate-400 text-sm text-center py-6">
            No active vehicles
          </div>
        )}
      </div>
    </div>
  );
}



















// import { useEffect, useState } from "react";
// import api from "../../services/api";

// export default function DevicePanel() {
//   const [devices, setDevices] = useState([]);

//   useEffect(() => {
//     api.get("/admin/devices/")
//       .then(res => setDevices(res.data))
//       .catch(() => setDevices([]));
//   }, []);

//   const statusColor = (s) => {
//     if (s === "ONLINE") return "text-emerald-400";
//     if (s === "OFFLINE") return "text-red-400";
//     return "text-yellow-400";
//   };

//   return (
//     <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
//       <h2 className="text-lg font-semibold mb-4">Device Health</h2>

//       <div className="space-y-3">
//         {devices.map(d => (
//           <div
//             key={d.id}
//             className="flex justify-between items-center bg-slate-800 p-3 rounded-lg"
//           >
//             <div>
//               <p className="font-medium">{d.type} — {d.slot}</p>
//               <p className="text-xs text-slate-400">
//                 Last ping: {new Date(d.last_seen).toLocaleTimeString()}
//               </p>
//             </div>

//             <span className={`font-bold ${statusColor(d.status)}`}>
//               {d.status}
//             </span>
//           </div>
//         ))}

//         {devices.length === 0 && (
//           <p className="text-slate-400 text-sm">No devices registered</p>
//         )}
//       </div>
//     </div>
//   );
// }
