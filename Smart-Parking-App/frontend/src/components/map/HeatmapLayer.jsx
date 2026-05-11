import { Circle } from "react-leaflet";

export default function HeatmapLayer({ slots = [] }) {
  return (
    <>
      {slots.map(slot => {
        let color = "#22c55e"; // green
        let radius = 10;

        if (slot.is_reserved) {
          color = "#eab308"; // yellow
          radius = 15;
        }
        if (slot.is_occupied) {
          color = "#ef4444"; // red
          radius = 20;
        }

        return (
          <Circle
            key={slot.id}
            center={[slot.y, slot.x]}
            radius={radius}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.4
            }}
          />
        );
      })}
    </>
  );
}