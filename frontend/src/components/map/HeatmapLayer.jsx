// import { Circle } from "react-leaflet";

// export default function HeatmapLayer({ slots = [] }) {
//   return (
//     <>
//       {slots.map(slot => {
//         let color = "#22c55e"; // green
//         let radius = 10;

//         if (slot.is_reserved) {
//           color = "#eab308"; // yellow
//           radius = 15;
//         }
//         if (slot.is_occupied) {
//           color = "#ef4444"; // red
//           radius = 20;
//         }

//         return (
//           <Circle
//             key={slot.id}
//             center={[slot.y, slot.x]}
//             radius={radius}
//             pathOptions={{
//               color,
//               fillColor: color,
//               fillOpacity: 0.4
//             }}
//           />
//         );
//       })}
//     </>
//   );
// }




import { Circle } from "react-leaflet";
import { useMemo } from "react";

export default function HeatmapLayer({ slots = [] }) {

  // ===============================
  // 🔥 SMART HEATMAP CALCULATION
  // ===============================
  const heatmapData = useMemo(() => {
    return slots.map((slot) => {

      // 🎯 intensity score (0 → 1)
      let intensity = 0;

      if (slot.is_occupied) intensity = 1;
      else if (slot.is_reserved) intensity = 0.6;
      else intensity = 0.2;

      // 🎨 color gradient (green → yellow → red)
      let color = "#22c55e"; // green

      if (intensity > 0.7) color = "#ef4444"; // red
      else if (intensity > 0.4) color = "#eab308"; // yellow

      // 📏 dynamic radius (heat effect)
      const radius = 10 + intensity * 25;

      return {
        id: slot.id,
        position: [slot.y, slot.x],
        color,
        radius,
        intensity
      };
    });
  }, [slots]);

  return (
    <>
      {heatmapData.map((point) => (
        <Circle
          key={point.id}
          center={point.position}
          radius={point.radius}
          pathOptions={{
            color: point.color,
            fillColor: point.color,
            fillOpacity: 0.3 + point.intensity * 0.4, // 🔥 glow effect
          }}
        />
      ))}
    </>
  );
}