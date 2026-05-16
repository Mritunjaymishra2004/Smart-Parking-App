import axios from "axios";

// ======================================================
// BASE URL
// ======================================================

const api = axios.create({

  baseURL:
    "https://smart-parking-app-hazel.vercel.app/api",

  headers: {
    "Content-Type":
      "application/json",
  },

});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "access"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    // ==============================================
    // AUTO LOGOUT ON 401
    // ==============================================

    if (
      error.response?.status ===
      401
    ) {

      localStorage.removeItem(
        "access"
      );

      localStorage.removeItem(
        "refresh"
      );
    }

    return Promise.reject(error);
  }
);

export default api;

