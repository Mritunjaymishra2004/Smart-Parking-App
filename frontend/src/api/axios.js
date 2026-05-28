import axios from "axios";


// ======================================================
// API URL
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";


// ======================================================
// AXIOS INSTANCE
// ======================================================

const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json",
  },

  timeout: 15000,

  withCredentials: false,
});


// ======================================================
// TOKEN HELPERS
// ======================================================

export const getAccessToken =
  () =>
    localStorage.getItem(
      "access"
    );

export const getRefreshToken =
  () =>
    localStorage.getItem(
      "refresh"
    );

export const setAccessToken =
  (token) => {
    localStorage.setItem(
      "access",
      token
    );
  };

export const setRefreshToken =
  (token) => {
    localStorage.setItem(
      "refresh",
      token
    );
  };

export const clearTokens =
  () => {
    localStorage.removeItem(
      "access"
    );

    localStorage.removeItem(
      "refresh"
    );
  };


// ======================================================
// REDIRECT
// ======================================================

const redirectToLogin =
  () => {
    clearTokens();

    if (
      window.location.pathname !==
      "/login"
    ) {
      window.location.href =
        "/login";
    }
  };


// ======================================================
// REFRESH STATE
// ======================================================

let isRefreshing = false;

let failedQueue = [];


// ======================================================
// PROCESS QUEUE
// ======================================================

const processQueue = (
  error,
  token = null
) => {
  failedQueue.forEach(
    (promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    }
  );

  failedQueue = [];
};


// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(
  (config) => {
    const token =
      getAccessToken();

    if (
      token &&
      token !== "undefined" &&
      token !== "null"
    ) {
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

  async (error) => {

    // ================================================
    // NETWORK ERROR
    // ================================================

    if (!error.response) {

      console.error(
        "Backend Connection Failed:",
        error.message
      );

      return Promise.reject(
        error
      );
    }

    const originalRequest =
      error.config;


    // ================================================
    // REFRESH LOOP PREVENTION
    // ================================================

    if (
      originalRequest.url?.includes(
        "/auth/refresh/"
      )
    ) {
      redirectToLogin();

      return Promise.reject(
        error
      );
    }


    // ================================================
    // TOKEN REFRESH
    // ================================================

    if (
      error.response.status ===
        401 &&
      !originalRequest._retry
    ) {

      if (isRefreshing) {

        return new Promise(
          (
            resolve,
            reject
          ) => {

            failedQueue.push({
              resolve,
              reject,
            });

          }
        ).then(
          (token) => {

            originalRequest.headers.Authorization =
              `Bearer ${token}`;

            return api(
              originalRequest
            );
          }
        );
      }

      originalRequest._retry =
        true;

      isRefreshing = true;

      try {

        const refresh =
          getRefreshToken();

        if (!refresh) {
          redirectToLogin();

          return Promise.reject(
            error
          );
        }

        const response =
          await axios.post(
            `${API_BASE_URL}/auth/refresh/`,
            {
              refresh,
            }
          );

        const newAccess =
          response.data.access;

        setAccessToken(
          newAccess
        );

        api.defaults.headers.common.Authorization =
          `Bearer ${newAccess}`;

        processQueue(
          null,
          newAccess
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(
          originalRequest
        );

      } catch (
        refreshError
      ) {

        processQueue(
          refreshError,
          null
        );

        redirectToLogin();

        return Promise.reject(
          refreshError
        );

      } finally {

        isRefreshing = false;
      }
    }

    return Promise.reject(
      error
    );
  }
);


// ======================================================
// EXPORT
// ======================================================

export default api;