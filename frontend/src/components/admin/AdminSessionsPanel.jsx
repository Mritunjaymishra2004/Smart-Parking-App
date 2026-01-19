import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminSessionsPanel() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = async () => {
    try {
      const res = await api.get("/admin/sessions/");
      setSessions(res.data);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    const timer = setInterval(loadSessions, 5000); // Auto refresh every 5s
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-emerald-400 mb-3">
        🚗 Live Parking Sessions
      </h2>

      {/* Header */}
      <div className="grid grid-cols-6 text-xs text-slate-400 mb-2 px-2">
        <div>Vehicle</div>
        <div>Slot</div>
        <div>Lot</div>
        <div>Entry</div>
        <div>Status</div>
        <div>Charges</div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-slate-400 text-sm p-2">Loading sessions...</p>
      )}

      {/* Data */}
      {sessions.map(s => {
        const active = !s.exit_time;

        return (
          <div
            key={s.id}
            className="grid grid-cols-6 items-center bg-slate-800 px-2 py-3 rounded-lg mb-2 text-sm hover:bg-slate-700 transition"
          >
            <div className="font-medium">{s.plate}</div>
            <div>{s.slot_code}</div>
            <div className="text-xs text-slate-400">{s.lot_name}</div>
            <div className="text-xs">
              {new Date(s.entry_time).toLocaleTimeString()}
            </div>

            <div
              className={`text-xs font-semibold ${
                active ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {active ? "PARKED" : "EXITED"}
            </div>

            <div className="font-bold text-emerald-400">
              ₹{s.charges}
            </div>
          </div>
        );
      })}

      {!loading && sessions.length === 0 && (
        <p className="text-slate-400 text-sm p-2">
          No active sessions 🚗
        </p>
      )}
    </div>
  );
}
