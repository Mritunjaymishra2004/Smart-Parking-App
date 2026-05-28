import api from "../api/axios";


// ======================================================
// PARKING LOTS
// ======================================================

export const getParkingLots =
  async () => {

    const response =
      await api.get(
        "/parking/lots/"
      );

    return response.data;
  };


// ======================================================
// SLOTS
// ======================================================

export const getSlots =
  async () => {

    const response =
      await api.get(
        "/slots/"
      );

    return response.data;
  };


// ======================================================
// SINGLE SLOT
// ======================================================

export const getSingleSlot =
  async (slotId) => {

    const response =
      await api.get(
        `/slots/${slotId}/`
      );

    return response.data;
  };


// ======================================================
// BOOKINGS
// ======================================================

export const getBookings =
  async () => {

    const response =
      await api.get(
        "/admin/bookings/"
      );

    return response.data;
  };


// ======================================================
// CREATE RESERVATION
// ======================================================

export const createReservation =
  async (data) => {

    const response =
      await api.post(
        "/reservations/create/",
        data
      );

    return response.data;
  };


// ======================================================
// CANCEL RESERVATION
// ======================================================

export const cancelReservation =
  async (data) => {

    const response =
      await api.post(
        "/reservations/cancel/",
        data
      );

    return response.data;
  };


// ======================================================
// PAYMENTS
// ======================================================

export const getPayments =
  async () => {

    const response =
      await api.get(
        "/admin/payments/"
      );

    return response.data;
  };


// ======================================================
// VEHICLES
// ======================================================

export const getVehicles =
  async () => {

    const response =
      await api.get(
        "/vehicles/"
      );

    return response.data;
  };


// ======================================================
// LIVE VEHICLES
// ======================================================

export const getLiveVehicles =
  async () => {

    const response =
      await api.get(
        "/admin/live-vehicles/"
      );

    return response.data;
  };


// ======================================================
// UPDATE VEHICLE POSITION
// ======================================================

export const updateVehiclePosition =
  async (data) => {

    const response =
      await api.post(
        "/vehicles/position/",
        data
      );

    return response.data;
  };


// ======================================================
// WALLET BALANCE
// ======================================================

export const getWalletBalance =
  async () => {

    const response =
      await api.get(
        "/wallet/balance/"
      );

    return response.data;
  };


// ======================================================
// ADD MONEY
// ======================================================

export const addMoney =
  async (data) => {

    const response =
      await api.post(
        "/wallet/add/",
        data
      );

    return response.data;
  };


// ======================================================
// ADMIN STATS
// ======================================================

export const getAdminStats =
  async () => {

    const response =
      await api.get(
        "/admin/stats/"
      );

    return response.data;
  };