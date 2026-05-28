import api from "./api";

// ================================
// ADMIN DASHBOARD
// ================================

export const getAdminStats = async () => {
  try {
    return await api.get("/admin/stats/");
  } catch (error) {
    console.error("Admin stats fetch failed:", error);
    throw error;
  }
};

export const getAdminSessions = async () => {
  try {
    return await api.get("/admin/sessions/");
  } catch (error) {
    console.error("Admin sessions fetch failed:", error);
    throw error;
  }
};

export const getViolations = async () => {
  try {
    return await api.get("/admin/violations/");
  } catch (error) {
    console.error("Violations fetch failed:", error);
    throw error;
  }
};

// ================================
// PARKING LOTS
// ================================

export const getParkingLots = async () => {
  try {
    return await api.get("/parking/lots/");
  } catch (error) {
    console.error("Parking lots fetch failed:", error);
    throw error;
  }
};
