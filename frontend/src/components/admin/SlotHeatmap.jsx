import { useEffect, useState } from "react";
import api from "../../services/api";

export default function SlotHeatmap() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    api.get("/slots/")
      .then(res => {
        const slots = res.data;

        // Group slots by zone
        const zoneMap = {};

        slots.forEach(slot => {
          const zone = slot.zone_label || "Unknown";

          if (!zoneMap[zone]) {
            zoneMap[zone] = { total: 0, used: 0 };
          }

          zoneMap[zone].total += 1;
          if (slot.is_occupied || slot.is_reserved) {
            zoneMap[zone].used += 1;
          }
        });

        // Convert to % heatmap
        const heat = Object.keys(zoneMap).map(zone => {
          const z = zoneMap[zone];
          return {
            area: zone,
            usage: Math.round((z.used / z.total) * 100)
          };
        });

        setZones(heat);
      })
      .catch(() => setZones([]));
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-4">
        🔥 AI Slot Heatmap
      </h2>

      <div className="space-y-3">
        {zones.map(zone => (
          <div key={zone.area}>
            <div className="flex justify-between text-sm mb-1">
              <span>Zone {zone.area}</span>
              <span>{zone.usage}%</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500
                bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500"
                style={{ width: `${zone.usage}%` }}
              />
            </div>
          </div>
        ))}

        {zones.length === 0 && (
          <p className="text-slate-400 text-sm">
            No slot data available
          </p>
        )}
      </div>
    </div>
  );
}
