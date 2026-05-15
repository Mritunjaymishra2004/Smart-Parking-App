import axios from "axios";

// ======================================================
// BASE URL
// ======================================================

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://smart-parking-app-4on2.vercel.app/api/v1/auth";
  

// ======================================================
// AXIOS INSTANCE
// ======================================================

const api = axios.create({
  baseURL,

  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(

  (config) => {

    const accessToken =
      localStorage.getItem("access");

    if (accessToken) {

      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

// ======================================================
// TOKEN REFRESH LOGIC
// ======================================================

let isRefreshing = false;

let failedQueue = [];

// ======================================================
// PROCESS FAILED REQUESTS
// ======================================================

const processQueue = (
  error,
  token = null
) => {

  failedQueue.forEach((prom) => {

    if (error) {
      prom.reject(error);

    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    // =========================================
    // TOKEN EXPIRED
    // =========================================

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      // =====================================
      // ALREADY REFRESHING
      // =====================================

      if (isRefreshing) {

        return new Promise(
          (resolve, reject) => {

            failedQueue.push({
              resolve,
              reject,
            });
          }
        ).then((token) => {

          originalRequest.headers.Authorization =
            `Bearer ${token}`;

          return api(originalRequest);
        });
      }

      originalRequest._retry = true;

      isRefreshing = true;

      try {

        const refreshToken =
          localStorage.getItem("refresh");

        // =====================================
        // NO REFRESH TOKEN
        // =====================================

        if (!refreshToken) {

          localStorage.clear();

          window.location.href =
            "/login";

          return Promise.reject(error);
        }

        // =====================================
        // REFRESH ACCESS TOKEN
        // =====================================

        const response =
          await axios.post(
            `${baseURL}/auth/refresh/`,
            {
              refresh: refreshToken,
            }
          );

        const newAccess =
          response.data.access;

        // =====================================
        // SAVE NEW TOKEN
        // =====================================

        localStorage.setItem(
          "access",
          newAccess
        );

        api.defaults.headers.Authorization =
          `Bearer ${newAccess}`;

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        processQueue(
          null,
          newAccess
        );

        return api(originalRequest);

      } catch (refreshError) {

        processQueue(refreshError);

        localStorage.clear();

        window.location.href =
          "/login";

        return Promise.reject(
          refreshError
        );

      } finally {

        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ======================================================
// EXPORT
// ======================================================

export default api;
