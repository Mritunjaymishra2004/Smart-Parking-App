import { useEffect, useState } from "react";
import api from "../../services/api";
import { connectSocket } from "../../utils/socket";

export default function SlotManager() {
  const [slots, setSlots] = useState([]);

  //  Load slots from backend
  const loadSlots = async () => {
    try {
      const res = await api.get("/slots/");
      setSlots(res.data);
    } catch (err) {
      console.error("Slots load error", err);
      setSlots([]);
    }
  };

  //  Initial load
  useEffect(() => {
    loadSlots();
  }, []);

  //  Live WebSocket updates (single shared socket — NO cleanup)
  useEffect(() => {
    connectSocket((data) => {
      if (data.type === "slots_update" || data.type === "refresh") {
        loadSlots();
      }
    });
  }, []);

  //  Force free slot
  const freeSlot = async (slot) => {
    try {
      await api.post("/admin/free-slot/", {
        slot_id: slot.id,
      });
      loadSlots();
    } catch {
      alert("Cannot free this slot");
    }
  };

  //  Block slot
  const blockSlot = async (slot) => {
    try {
      await api.post("/admin/block-slot/", {
        slot_id: slot.id,
      });
      loadSlots();
    } catch {
      alert("Cannot block this slot");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">
        Admin Slot Control
      </h2>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-2 text-left">Slot</th>
              <th className="p-2">Lot</th>
              <th className="p-2">Zone</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {slots.map((s) => {
              const isFree = !s.is_reserved && !s.is_occupied;

              return (
                <tr
                  key={s.id}
                  className="border-b border-slate-800 hover:bg-slate-800/40"
                >
                  <td className="p-2 font-semibold">{s.code}</td>
                  <td className="p-2 text-xs text-slate-400">{s.lot_name}</td>
                  <td className="p-2 text-xs text-slate-400">{s.zone_label}</td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        isFree
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {isFree ? "FREE" : "OCCUPIED"}
                    </span>
                  </td>

                  <td className="p-2 text-right space-x-2">
                    {!isFree && (
                      <button
                        onClick={() => freeSlot(s)}
                        className="px-3 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-700"
                      >
                        Force Free
                      </button>
                    )}

                    {isFree && (
                      <button
                        onClick={() => blockSlot(s)}
                        className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700"
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {slots.length === 0 && (
          <p className="text-slate-400 text-sm p-4 text-center">
            No slots found
          </p>
        )}
      </div>
    </div>
  );
}
