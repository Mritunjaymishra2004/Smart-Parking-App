import { Polyline } from "react-leaflet";

export default function VehicleTrails({ vehicles = [] }) {
  return (
    <>
      {vehicles.map(v => {
        if (!v.trail || v.trail.length < 2) return null;

        return (
          <Polyline
            key={v.vehicle_id}
            positions={v.trail}
            pathOptions={{
              color: "#38bdf8",
              weight: 3
            }}
          />
        );
      })}
    </>
  );
}
