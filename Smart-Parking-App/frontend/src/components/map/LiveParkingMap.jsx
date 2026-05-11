import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  freeSlotIcon,
  busySlotIcon,
  reservedIcon,
  carIcon,
} from "../../utils/leafletIcon";
import { connectSocket, connectVehicleUpdates } from "../../utils/socket";
import { useAuth } from "../../context/AuthContext";
import { useParking } from "../../context/ParkingContext";
import VehiclePickerModal from "../user/VehiclePickerModal";

export default function LiveParkingMap() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startParking } = useParking();

  const [slots, setSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  // Load slots
  useEffect(() => {
    api.get("/slots/")
      .then(res => setSlots(res.data))
      .catch(() => {
        setSlots([
          { id: 1, code: "A1", x: 77.2001, y: 28.6101, is_occupied: false, is_reserved: false },
          { id: 2, code: "A2", x: 77.2005, y: 28.6103, is_occupied: true, is_reserved: false },
        ]);
      });
  }, []);

  // Live slot updates
  useEffect(() => {
    return connectSocket(msg => {
      if (msg.type === "slots_update") {
        setSlots(msg.slots);
      }
    });
  }, []);

  // Live vehicle updates
  useEffect(() => {
    return connectVehicleUpdates(msg => {
      if (msg.type === "vehicle_position") {
        setVehicles(prev => [
          ...prev.filter(v => v.vehicle_id !== msg.vehicle_id),
          msg,
        ]);
      }
    });
  }, []);

  // User clicks free slot
  const onSlotClick = (slot) => {
    if (!user?.vehicles || user.vehicles.length === 0) {
      navigate("/add-vehicle");
      return;
    }

    if (user.vehicles.length === 1) {
      startParking(slot, user.vehicles[0]);
      return;
    }

    setSelectedSlot(slot);
    setShowVehicleModal(true);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[28.6105, 77.2007]}
        zoom={16}
        className="absolute inset-0 w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {slots.map(slot => (
          <Marker
            key={slot.id}
            position={[slot.y, slot.x]}
            icon={
              slot.is_occupied
                ? busySlotIcon
                : slot.is_reserved
                ? reservedIcon
                : freeSlotIcon
            }
            eventHandlers={{
              click: () => {
                if (!slot.is_occupied && !slot.is_reserved) {
                  onSlotClick(slot);
                }
              },
            }}
          >
            <Popup>
              <b>Slot {slot.code}</b><br />
              {slot.is_occupied ? "Occupied" : slot.is_reserved ? "Reserved" : "Available"}
            </Popup>
          </Marker>
        ))}

        {vehicles.map(v => (
          <Marker key={v.vehicle_id} position={[v.y, v.x]} icon={carIcon}>
            <Popup>{v.plate || `Vehicle ${v.vehicle_id}`}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {showVehicleModal && (
        <VehiclePickerModal
          vehicles={user.vehicles}
          onSelect={(vehicle) => {
            startParking(selectedSlot, vehicle);
            setShowVehicleModal(false);
            setSelectedSlot(null);
          }}
          onClose={() => setShowVehicleModal(false)}
        />
      )}
    </div>
  );
}