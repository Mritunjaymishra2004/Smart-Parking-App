import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ViolationsPanel() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadViolations = async () => {
    try {
      const res = await api.get("/admin/violations/");
      setList(res.data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadViolations();
    const timer = setInterval(loadViolations, 5000); // auto refresh
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 border border-red-500/40 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-red-400 mb-3">
        🚨 Violations & Overstays
      </h2>

      <div className="grid grid-cols-5 text-xs text-slate-400 mb-2 px-2">
        <div>Vehicle</div>
        <div>Slot</div>
        <div>Type</div>
        <div>Time</div>
        <div>Fine</div>
      </div>

      {loading && (
        <p className="text-slate-400 text-sm p-2">Loading violations...</p>
      )}

      {list.map(v => (
        <div
          key={v.id}
          className="grid grid-cols-5 items-center bg-slate-800 px-2 py-3 rounded-lg mb-2 text-sm"
        >
          <div className="font-medium">{v.plate}</div>
          <div>{v.slot_code}</div>

          <div
            className={`text-xs font-semibold ${
              v.type === "NO_BOOKING"
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {v.type.replace("_", " ")}
          </div>

          <div className="text-xs text-slate-400">
            {new Date(v.created_at).toLocaleTimeString()}
          </div>

          <div className="font-bold text-red-400">
            ₹{v.fine}
          </div>
        </div>
      ))}

      {!loading && list.length === 0 && (
        <p className="text-slate-400 text-sm p-2">
          No violations 🎉 Parking is clean
        </p>
      )}
    </div>
  );
}
