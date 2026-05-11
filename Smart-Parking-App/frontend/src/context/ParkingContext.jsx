import { createContext, useContext, useState } from "react";

const ParkingContext = createContext();

export function ParkingProvider({ children }) {
  const [session, setSession] = useState(null);

  const startParking = (slot, vehicle) => {
    setSession({
      slotId: slot.id,
      slotCode: slot.code,
      vehicleType: vehicle.type,
      startTime: Date.now(),
    });
  };

  const stopParking = () => {
    setSession(null);
  };

  return (
    <ParkingContext.Provider value={{ session, startParking, stopParking }}>
      {children}
    </ParkingContext.Provider>
  );
}

export const useParking = () => useContext(ParkingContext);