import axios from "axios";

// ======================================================
// BASE URL
// ======================================================

const api = axios.create({

  baseURL:
    "https://smart-parking-app-4on2.vercel.app/api",

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


// import axios from "axios";

// const api = axios.create({

//   baseURL:
//     "http://127.0.0.1:8000/api",

//   headers: {
//     "Content-Type":
//       "application/json",
//   },
// });

// let isRefreshing = false;

// let failedQueue = [];

// // =====================================
// // PROCESS FAILED REQUESTS
// // =====================================

// const processQueue = (
//   error,
//   token = null
// ) => {

//   failedQueue.forEach((prom) => {

//     if (error) {

//       prom.reject(error);

//     } else {

//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// // =====================================
// // ATTACH ACCESS TOKEN
// // =====================================

// api.interceptors.request.use(

//   (config) => {

//     const token =
//       localStorage.getItem("access");

//     if (token) {

//       config.headers.Authorization =
//         `Bearer ${token}`;
//     }

//     return config;
//   },

//   (error) =>
//     Promise.reject(error)
// );

// // =====================================
// // HANDLE TOKEN REFRESH
// // =====================================

// api.interceptors.response.use(

//   (response) => response,

//   async (error) => {

//     const originalRequest =
//       error.config;

//     // Network/server error
//     if (!error.response) {

//       console.error(
//         "Network error or server down"
//       );

//       return Promise.reject(error);
//     }

//     // =================================
//     // TOKEN EXPIRED
//     // =================================

//     if (
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {

//       // skip login/signup
//       if (
//         originalRequest.url.includes(
//           "/auth/login"
//         ) ||

//         originalRequest.url.includes(
//           "/auth/signup"
//         )
//       ) {

//         return Promise.reject(error);
//       }

//       // wait while refreshing
//       if (isRefreshing) {

//         return new Promise(
//           (
//             resolve,
//             reject
//           ) => {

//             failedQueue.push({
//               resolve,
//               reject,
//             });
//           }
//         )

//         .then((token) => {

//           originalRequest.headers.Authorization =
//             `Bearer ${token}`;

//           return api(originalRequest);
//         })

//         .catch((err) =>
//           Promise.reject(err)
//         );
//       }

//       originalRequest._retry = true;

//       isRefreshing = true;

//       try {

//         const refresh =
//           localStorage.getItem(
//             "refresh"
//           );

//         if (!refresh) {

//           throw new Error(
//             "No refresh token"
//           );
//         }

//         const res =
//           await axios.post(

//             "http://127.0.0.1:8000/api/auth/refresh/",

//             {
//               refresh,
//             }
//           );

//         const newAccess =
//           res.data.access;

//         localStorage.setItem(
//           "access",
//           newAccess
//         );

//         processQueue(
//           null,
//           newAccess
//         );

//         originalRequest.headers.Authorization =
//           `Bearer ${newAccess}`;

//         return api(originalRequest);

//       } catch (err) {

//         processQueue(err);

//         localStorage.removeItem(
//           "access"
//         );

//         localStorage.removeItem(
//           "refresh"
//         );

//         window.location.href =
//           "/login";

//         return Promise.reject(err);

//       } finally {

//         isRefreshing = false;
//       }
//     }

//     // =================================
//     // SERVER ERROR
//     // =================================

//     if (
//       error.response.status === 500
//     ) {

//       console.error(
//         "Server error:",
//         error.response.data
//       );
//     }

//     return Promise.reject(error);
//   }
// );

// // =====================================
// // HELPERS
// // =====================================

// export const startParking = (
//   vehicleId
// ) =>

//   api.post(
//     "/vehicle/entry/",
//     {
//       vehicle: vehicleId,
//     }
//   );

// export default api;







// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",
//   baseURL: "https://smart-parking-app-nw8a.onrender.com",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ===============================
// // 🔒 REFRESH CONTROL
// // ===============================
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// // ===============================
// // 🔹 REQUEST INTERCEPTOR (Attach Token)
// // ===============================
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("access");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ===============================
// // 🔹 RESPONSE INTERCEPTOR
// // ===============================
// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     // ✅ NETWORK ERROR HANDLING (NEW)
//     if (!error.response) {
//       console.error("Network error or server down");
//       return Promise.reject(error);
//     }

//     // ===============================
//     // 🔥 HANDLE 401 (TOKEN EXPIRED)
//     // ===============================
//     if (error.response.status === 401 && !originalRequest._retry) {

//       // ⛔ Skip refresh for login/signup
//       if (
//         originalRequest.url.includes("/auth/login") ||
//         originalRequest.url.includes("/auth/signup")
//       ) {
//         return Promise.reject(error);
//       }

//       // 🔁 If already refreshing → queue request
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = "Bearer " + token;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refresh = localStorage.getItem("refresh");

//         if (!refresh) throw new Error("No refresh token");

//         // 🔥 Refresh request
//         const res = await axios.post(
//           "http://127.0.0.1:8000/api/auth/refresh/",
//           { refresh }
//         );

//         const newAccess = res.data.access;

//         // ✅ Save new token
//         localStorage.setItem("access", newAccess);

//         // 🔥 Process queued requests
//         processQueue(null, newAccess);

//         // ✅ Retry original request
//         originalRequest.headers.Authorization = `Bearer ${newAccess}`;
//         return api(originalRequest);

//       } catch (err) {
//         console.warn("Session expired");

//         processQueue(err, null);

//         // 🔥 CLEAR SESSION
//         localStorage.removeItem("access");
//         localStorage.removeItem("refresh");

//         return Promise.reject(err);

//       } finally {
//         isRefreshing = false;
//       }
//     }

//     // ===============================
//     // 🔴 HANDLE 500 (SERVER ERROR)
//     // ===============================
//     if (error.response.status === 500) {
//       console.error("Server error:", error.response.data);
//     }

//     // ===============================
//     // 🔴 HANDLE 400 (VALIDATION)
//     // ===============================
//     if (error.response.status === 400) {
//       console.warn("Bad request:", error.response.data);
//     }

//     return Promise.reject(error);
//   }
// );

// // ===============================
// // 🔹 PARKING API (Example)
// // ===============================
// export const startParking = (vehicleId) =>
//   api.post("/vehicle/entry/", {
//     vehicle: vehicleId,
//   });

// export default api;