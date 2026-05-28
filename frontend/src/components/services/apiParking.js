import api from "./api";

// Start Parking (ENTRY)
export const startParking = (vehicleId) =>
  api.post("/vehicle/entry/", {
    vehicle: vehicleId,
  });

// End Parking (EXIT)
export const endParking = (parkingId) =>
  api.post("/vehicle/exit/", {
    parking_id: parkingId,
  });

// Get Active Parking
export const getActiveParking = () =>
  api.get("/vehicle/active/");

// Get Slots
export const getSlots = () =>
  api.get("/slots/");

// Book Slot
export const bookSlot = (slotId) =>
  api.post("/booking/create/", {
    slot: slotId,
  });

// My Bookings
export const getMyBookings = () =>
  api.get("/booking/my/");

// Payment
export const makePayment = (bookingId) =>
  api.post("/payment/create/", {
    booking_id: bookingId,
  });