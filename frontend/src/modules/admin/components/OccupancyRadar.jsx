import { useEffect, useState } from "react";
import api from "../../services/api";

export default function OccupancyRadar() {
  const [occupied, setOccupied] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/slots/");
        const slots = res.data;

        const total = slots.length;
        const used = slots.filter(
          s => s.is_occupied || s.is_reserved
        ).length;

        const percent = total === 0 ? 0 : Math.round((used / total) * 100);
        setOccupied(percent);
      } catch {
        setOccupied(0);
      }
    };

    load();
    const timer = setInterval(load, 5000); // auto refresh
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-4">
        Live Occupancy
      </h2>

      <div className="relative w-40 h-40">
        {/* Base */}
        <div className="absolute inset-0 rounded-full bg-slate-800" />

        {/* Progress */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-700"
          style={{
            background: `conic-gradient(
              ${occupied > 80 ? "#ef4444" : occupied > 50 ? "#facc15" : "#10b981"}
              ${occupied * 3.6}deg,
              #1e293b 0deg
            )`
          }}
        />

        {/* Center */}
        <div className="absolute inset-4 bg-slate-900 rounded-full flex items-center justify-center text-2xl font-bold">
          <span
            className={
              occupied > 80
                ? "text-red-400"
                : occupied > 50
                ? "text-yellow-400"
                : "text-emerald-400"
            }
          >
            {occupied}%
          </span>
        </div>
      </div>

      <p className="mt-3 text-slate-400 text-sm">
        Parking Occupied
      </p>

      {/* AI status */}
      <p className={`mt-1 text-xs ${
        occupied > 80
          ? "text-red-400"
          : occupied > 50
          ? "text-yellow-400"
          : "text-emerald-400"
      }`}>
        {occupied > 80
          ? "Parking Almost Full"
          : occupied > 50
          ? "Moderate Load"
          : "Parking Available"}
      </p>
    </div>
  );
}
