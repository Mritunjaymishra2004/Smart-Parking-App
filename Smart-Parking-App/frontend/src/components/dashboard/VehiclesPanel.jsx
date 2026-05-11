import { useEffect, useState } from "react";
import { connectSocket } from "../../utils/socket";

export default function VehiclesPanel() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    connectSocket(
      () => {},
      (data) => {
        setVehicles((prev) => [
          ...prev.filter((v) => v.vehicle !== data.vehicle),
          data,
        ]);
      }
    );
  }, []);

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">
        Live Vehicles
      </h3>

      {vehicles.length === 0 && (
        <p className="text-slate-400 text-sm">No live vehicles</p>
      )}

      {vehicles.map((v) => (
        <div
          key={v.vehicle}
          className="flex justify-between py-2 border-b border-slate-800 text-sm"
        >
          <span className="font-medium">{v.vehicle}</span>
          <span className="text-emerald-400">
            {v.latitude}, {v.longitude}
          </span>
        </div>
      ))}
    </div>
  );
}