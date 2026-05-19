import {
  useEffect,
  useState,
} from "react";

import {

  getCurrentUser,

  isAuthenticated,

  loginUser,

  logoutUser,

  signupUser,

} from "../services/authService";


// ======================================================
// USE AUTH HOOK
// ======================================================

export default function useAuth() {

  // ====================================================
  // STATE
  // ====================================================

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [authenticated,
    setAuthenticated] =
    useState(false);


  // ====================================================
  // LOAD USER
  // ====================================================

  const loadUser =
    async () => {

      try {

        if (!isAuthenticated()) {

          setLoading(false);

          setAuthenticated(false);

          return;
        }

        const userData =
          await getCurrentUser();

        setUser(userData);

        setAuthenticated(true);

      } catch (error) {

        console.error(
          "Load user error:",
          error
        );

        setAuthenticated(false);

      } finally {

        setLoading(false);
      }
    };


  // ====================================================
  // LOGIN
  // ====================================================

  const login =
    async (credentials) => {

      try {

        const data =
          await loginUser(
            credentials
          );

        await loadUser();

        return {
          success: true,
          data,
        };

      } catch (error) {

        console.error(
          "Login error:",
          error
        );

        return {
          success: false,
          error,
        };
      }
    };


  // ====================================================
  // SIGNUP
  // ====================================================

  const signup =
    async (userData) => {

      try {

        const data =
          await signupUser(
            userData
          );

        return {
          success: true,
          data,
        };

      } catch (error) {

        console.error(
          "Signup error:",
          error
        );

        return {
          success: false,
          error,
        };
      }
    };


  // ====================================================
  // LOGOUT
  // ====================================================

  const logout =
    () => {

      logoutUser();

      setUser(null);

      setAuthenticated(false);
    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    loadUser();

  }, []);


  // ====================================================
  // RETURN
  // ====================================================

  return {

    user,

    loading,

    authenticated,

    login,

    signup,

    logout,

    refreshUser:
      loadUser,
  };
}