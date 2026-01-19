import { useEffect, useState } from "react";
import api from "../../services/api";
import { connectSocket } from "../../utils/socket";

export default function RevenuePanel() {
  const [data, setData] = useState(null);

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/stats/");
      setData(res.data);
    } catch {
      setData(null);
    }
  };

  // Initial load
  useEffect(() => {
    loadStats();
  }, []);

  // 🔴 Live WebSocket updates
  useEffect(() => {
    connectSocket((data) => {
      if (
        data.type === "vehicle_entry" ||
        data.type === "vehicle_exit" ||
        data.type === "payment" ||
        data.type === "slots_update"
      ) {
        loadStats();
      }
    });
  }, []);

  if (!data) {
    return (
      <div className="bg-slate-900 p-6 rounded-xl text-slate-400">
        Loading revenue...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-600/20 to-slate-900 border border-emerald-500/30 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-emerald-400 mb-4">
        💰 Revenue Analytics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Today</p>
          <p className="text-2xl font-bold text-emerald-400">
            ₹{data.today_revenue}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-400">
            ₹{data.total_revenue}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Active Vehicles</p>
          <p className="text-xl font-bold text-white">
            {data.active_sessions}
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-lg">
          <p className="text-sm text-slate-400">Occupied Slots</p>
          <p className="text-xl font-bold text-white">
            {data.occupied_slots} / {data.total_slots}
          </p>
        </div>
      </div>
    </div>
  );
}
