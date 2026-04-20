import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const violationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/564/564619.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});

export default function ViolationLayer({ violations = [] }) {
  return (
    <>
      {violations.map((v, i) => (
        <Marker
          key={i}
          position={[v.y, v.x]}
          icon={violationIcon}
        >
          <Popup>
            <b>Violation</b><br />
            {v.type || "Unknown"}<br />
            Vehicle: {v.vehicle_id}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
