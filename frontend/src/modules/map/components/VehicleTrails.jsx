// import { Polyline } from "react-leaflet";

// export default function VehicleTrails({ vehicles = [] }) {
//   return (
//     <>
//       {vehicles.map(v => {
//         if (!v.trail || v.trail.length < 2) return null;

//         return (
//           <Polyline
//             key={v.vehicle_id}
//             positions={v.trail}
//             pathOptions={{
//               color: "#38bdf8",
//               weight: 3
//             }}
//           />
//         );
//       })}
//     </>
//   );
// } 




import { Polyline, CircleMarker } from "react-leaflet";
import { useMemo } from "react";

export default function VehicleTrails({ vehicles = [] }) {

  // ===============================
  // 🔥 OPTIMIZED TRAIL DATA
  // ===============================
  const trailData = useMemo(() => {
    return vehicles.map((v) => {

      if (!v.trail || v.trail.length < 2) return null;

      // 🎨 color based on speed/activity
      let color = "#38bdf8"; // default blue

      if (v.speed > 40) color = "#ef4444"; // fast → red
      else if (v.speed > 20) color = "#eab308"; // medium → yellow
      else color = "#22c55e"; // slow → green

      return {
        id: v.vehicle_id,
        trail: v.trail,
        color
      };
    }).filter(Boolean);
  }, [vehicles]);

  return (
    <>
      {trailData.map((v) => (
        <div key={v.id}>
          
          {/* 🔥 MAIN TRAIL */}
          <Polyline
            positions={v.trail}
            pathOptions={{
              color: v.color,
              weight: 4,
              opacity: 0.8
            }}
          />

          {/* 🔥 TRAIL HEAD (latest position highlight) */}
          <CircleMarker
            center={v.trail[v.trail.length - 1]}
            radius={6}
            pathOptions={{
              color: v.color,
              fillColor: v.color,
              fillOpacity: 1
            }}
          />

        </div>
      ))}
    </>
  );
}