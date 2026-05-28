import api from "../api/axios";


// ======================================================
// LOGIN
// ======================================================

export const loginUser =
  async (credentials) => {

    const response =
      await api.post(
        "/auth/login/",
        credentials
      );

    // ==========================================
    // SAVE TOKENS
    // ==========================================

    if (response.data.access) {

      localStorage.setItem(
        "access",
        response.data.access
      );
    }

    if (response.data.refresh) {

      localStorage.setItem(
        "refresh",
        response.data.refresh
      );
    }

    return response.data;
  };


// ======================================================
// SIGNUP
// ======================================================

export const signupUser =
  async (userData) => {

    const response =
      await api.post(
        "/auth/signup/",
        userData
      );

    return response.data;
  };


// ======================================================
// GET CURRENT USER
// ======================================================

export const getCurrentUser =
  async () => {

    const response =
      await api.get(
        "/auth/me/"
      );

    return response.data;
  };


// ======================================================
// REFRESH TOKEN
// ======================================================

export const refreshAccessToken =
  async () => {

    const refreshToken =
      localStorage.getItem(
        "refresh"
      );

    if (!refreshToken) {

      throw new Error(
        "No refresh token found"
      );
    }

    const response =
      await api.post(
        "/auth/refresh/",
        {
          refresh: refreshToken,
        }
      );

    // ==========================================
    // SAVE NEW ACCESS TOKEN
    // ==========================================

    localStorage.setItem(
      "access",
      response.data.access
    );

    return response.data;
  };


// ======================================================
// LOGOUT
// ======================================================

export const logoutUser =
  () => {

    localStorage.removeItem(
      "access"
    );

    localStorage.removeItem(
      "refresh"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";
  };


// ======================================================
// CHECK AUTH
// ======================================================

export const isAuthenticated =
  () => {

    return !!localStorage.getItem(
      "access"
    );
  };


// ======================================================
// GET ACCESS TOKEN
// ======================================================

export const getAccessToken =
  () => {

    return localStorage.getItem(
      "access"
    );
  };


// ======================================================
// SAVE USER
// ======================================================

export const saveUser =
  (user) => {

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );
  };


// ======================================================
// GET SAVED USER
// ======================================================

export const getSavedUser =
  () => {

    const user =
      localStorage.getItem(
        "user"
      );

    return user
      ? JSON.parse(user)
      : null;
  };