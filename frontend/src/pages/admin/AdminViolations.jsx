import { useEffect, useState } from "react";
import api from "../../services/api";
import { connectSocket } from "../../utils/socket";
import Navbar from "../../components/common/Navbar";
import DashboardBackground from "../../components/common/DashboardBackground";

export default function AdminViolations() {
  const [violations, setViolations] = useState([]);

  // Load from backend
  const load = async () => {
    try {
      const res = await api.get("/admin/violations/");
      setViolations(res.data);
    } catch {
      // fallback demo
      setViolations([
        {
          id: 1,
          slot_code: "A1",
          vehicle_plate: "DL01AB1234",
          minutes: 22,
          fine: 220,
          resolved: false,
          session: "S1",
          type: "OVERSTAY",
        },
      ]);
    }
  };

  // Initial load + polling
  useEffect(() => {
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, []);

  // WebSocket real-time
  useEffect(() => {
    return connectSocket(msg => {
      if (msg.type === "violation") {
        setViolations(prev => [msg.data, ...prev]);
      }
    });
  }, []);

  // Force exit
  const forceExit = async (v) => {
    try {
      await api.post("/admin/force-exit/", { session: v.session });
      alert(`Vehicle ${v.vehicle_plate} removed`);
      load();
    } catch {
      alert("Simulated force exit");
      setViolations(prev =>
        prev.map(x =>
          x.id === v.id ? { ...x, resolved: true } : x
        )
      );
    }
  };

  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="min-h-screen text-white p-6">

          <h1 className="text-2xl font-bold mb-6">
            Live Parking Violations
          </h1>

          <table className="w-full border border-slate-700 rounded-lg overflow-hidden">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="p-3 text-left">Vehicle</th>
                <th className="p-3 text-left">Slot</th>
                <th className="p-3 text-left">Violation</th>
                <th className="p-3 text-left">Overstay</th>
                <th className="p-3 text-left">Fine</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {violations.map(v => (
                <tr key={v.id} className="border-t border-slate-700 hover:bg-slate-800">
                  <td className="p-3">{v.vehicle_plate}</td>
                  <td className="p-3">{v.slot_code}</td>
                  <td className="p-3 text-red-400 font-semibold">
                    {v.type || "OVERSTAY"}
                  </td>
                  <td className="p-3">
                    {v.minutes ? `${v.minutes} min` : "-"}
                  </td>
                  <td className="p-3 text-yellow-400">
                    ₹{v.fine}
                  </td>
                  <td className="p-3">
                    {v.resolved ? (
                      <span className="text-emerald-400">Paid</span>
                    ) : (
                      <span className="text-red-400">Unpaid</span>
                    )}
                  </td>
                  <td className="p-3">
                    {!v.resolved && (
                      <button
                        onClick={() => forceExit(v)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                      >
                        Force Exit
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {violations.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400">
                    No violations detected
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </DashboardBackground>
    </>
  );
}