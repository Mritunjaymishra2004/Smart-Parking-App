import axios from "axios";


// ======================================================
// BASE URL
// ======================================================

const baseURL =

  import.meta.env
    .VITE_API_BASE_URL

  ||

  "http://localhost:8000/api/v1";


// ======================================================
// AXIOS INSTANCE
// ======================================================

const api = axios.create({

  baseURL,

  timeout: 15000,

  headers: {

    "Content-Type":
      "application/json",
  },
});


// ======================================================
// TOKEN HELPERS
// ======================================================

const getAccessToken =
  () => {

    try {

      return localStorage.getItem(
        "access"
      );

    } catch {

      return null;
    }
  };


const getRefreshToken =
  () => {

    try {

      return localStorage.getItem(
        "refresh"
      );

    } catch {

      return null;
    }
  };


const setAccessToken =
  (token) => {

    try {

      localStorage.setItem(
        "access",
        token
      );

    } catch (error) {

      console.error(
        "Failed to save token",
        error
      );
    }
  };


const clearAuth =
  () => {

    try {

      localStorage.removeItem(
        "access"
      );

      localStorage.removeItem(
        "refresh"
      );

      localStorage.removeItem(
        "user"
      );

    } catch (error) {

      console.error(
        "Failed to clear auth",
        error
      );
    }
  };


// ======================================================
// SAFE LOGIN REDIRECT
// ======================================================

const redirectToLogin =
  () => {

    if (

      window.location.pathname !==
      "/login"

    ) {

      window.location.replace(
        "/login"
      );
    }
  };


// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(

  (config) => {

    const accessToken =
      getAccessToken();

    // ==============================================
    // AUTH HEADER
    // ==============================================

    if (accessToken) {

      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(
      error
    );
  }
);


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

        promise.reject(
          error
        );

      } else {

        promise.resolve(
          token
        );
      }
    }
  );

  failedQueue = [];
};


// ======================================================
// REFRESH TOKEN
// ======================================================

const refreshAccessToken =
  async () => {

    const refreshToken =
      getRefreshToken();

    if (!refreshToken) {

      throw new Error(
        "No refresh token"
      );
    }

    const response =
      await axios.post(

        `${baseURL}/auth/refresh/`,

        {
          refresh:
            refreshToken,
        },

        {
          timeout: 10000,
        }
      );

    return response.data.access;
  };


// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(

  (response) => {

    return response;
  },

  async (error) => {

    const originalRequest =
      error.config;


    // ==============================================
    // NO RESPONSE
    // ==============================================

    if (!error.response) {

      console.warn(
        "Backend unreachable"
      );

      return Promise.reject(
        error
      );
    }


    // ==============================================
    // TOKEN EXPIRED
    // ==============================================

    if (

      error.response.status === 401 &&

      !originalRequest._retry &&

      !originalRequest.url.includes(
        "/auth/refresh/"
      )

    ) {

      // ============================================
      // WAIT FOR ACTIVE REFRESH
      // ============================================

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

        ).then((token) => {

          originalRequest.headers.Authorization =
            `Bearer ${token}`;

          return api(
            originalRequest
          );
        });
      }


      // ============================================
      // START REFRESH
      // ============================================

      originalRequest._retry = true;

      isRefreshing = true;

      try {

        const newAccess =
          await refreshAccessToken();

        setAccessToken(
          newAccess
        );

        api.defaults.headers.common.Authorization =
          `Bearer ${newAccess}`;

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        processQueue(
          null,
          newAccess
        );

        return api(
          originalRequest
        );

      } catch (refreshError) {

        console.error(
          "Refresh token expired"
        );

        processQueue(
          refreshError
        );

        clearAuth();

        redirectToLogin();

        return Promise.reject(
          refreshError
        );

      } finally {

        isRefreshing = false;
      }
    }


    // ==============================================
    // FORBIDDEN
    // ==============================================

    if (

      error.response.status === 403

    ) {

      console.warn(
        "Permission denied"
      );
    }


    // ==============================================
    // SERVER ERROR
    // ==============================================

    if (

      error.response.status >= 500

    ) {

      console.error(
        "Internal server error"
      );
    }

    return Promise.reject(
      error
    );
  }
);


// ======================================================
// CANCEL TOKEN
// ======================================================

export const cancelTokenSource =
  axios.CancelToken.source;


// ======================================================
// EXPORT
// ======================================================

export default api;