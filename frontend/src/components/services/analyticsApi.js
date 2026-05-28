import api from "../api/axios";


// ======================================================
// GENERIC REQUEST
// ======================================================

const request =
  async (

    endpoint,

    config = {}

  ) => {

    try {

      const response =
        await api.get(

          endpoint,

          config
        );

      return response;

    } catch (error) {

      console.error(

        `Analytics API Error: ${endpoint}`,

        error?.response?.data ||

        error.message ||

        error
      );

      throw error;
    }
  };


// ======================================================
// ADMIN STATS
// ======================================================

export const getAdminStats =
  async () => {

    return request(
      "/admin/stats/"
    );
  };


// ======================================================
// DASHBOARD ANALYTICS
// ======================================================

export const getDashboardAnalytics =
  async (
    params = {}
  ) => {

    return request(

      "/analytics/dashboard/",

      {
        params,
      }
    );
  };


// ======================================================
// REVENUE ANALYTICS
// ======================================================

export const getRevenueAnalytics =
  async () => {

    return request(
      "/admin/payments/"
    );
  };


// ======================================================
// BOOKING ANALYTICS
// ======================================================

export const getBookingTrends =
  async () => {

    return request(
      "/admin/bookings/"
    );
  };


// ======================================================
// OCCUPANCY ANALYTICS
// ======================================================

export const getOccupancyAnalytics =
  async () => {

    return request(
      "/slots/"
    );
  };


// ======================================================
// SLOT STATUS ANALYTICS
// ======================================================

export const getSlotStatusAnalytics =
  async () => {

    return request(
      "/slots/"
    );
  };


// ======================================================
// LIVE VEHICLE ANALYTICS
// ======================================================

export const getLiveAnalytics =
  async () => {

    return request(
      "/admin/live-vehicles/"
    );
  };


// ======================================================
// SESSION ANALYTICS
// ======================================================

export const getSessionAnalytics =
  async () => {

    return request(
      "/admin/sessions/"
    );
  };


// ======================================================
// VIOLATION ANALYTICS
// ======================================================

export const getViolationAnalytics =
  async () => {

    return request(
      "/admin/violations/"
    );
  };


// ======================================================
// EXPORT CSV REPORT
// ======================================================

export const exportCSVReport =
  async (
    type = "bookings"
  ) => {

    try {

      const response =
        await api.get(

          `/admin/export/csv/${type}/`,

          {

            responseType:
              "blob",
          }
        );

      return response.data;

    } catch (error) {

      console.error(

        "CSV export error:",

        error?.response?.data ||

        error.message ||

        error
      );

      throw error;
    }
  };


// ======================================================
// EXPORT PDF REPORT
// ======================================================

export const exportPDFReport =
  async (
    type = "bookings"
  ) => {

    try {

      const response =
        await api.get(

          `/admin/export/pdf/${type}/`,

          {

            responseType:
              "blob",
          }
        );

      return response.data;

    } catch (error) {

      console.error(

        "PDF export error:",

        error?.response?.data ||

        error.message ||

        error
      );

      throw error;
    }
  };


// ======================================================
// DEFAULT EXPORT
// ======================================================

const analyticsService = {

  getAdminStats,

  getDashboardAnalytics,

  getRevenueAnalytics,

  getBookingTrends,

  getOccupancyAnalytics,

  getSlotStatusAnalytics,

  getLiveAnalytics,

  getSessionAnalytics,

  getViolationAnalytics,

  exportCSVReport,

  exportPDFReport,
};

export default analyticsService;