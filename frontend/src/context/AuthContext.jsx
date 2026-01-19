
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { connectSocket } from "../utils/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [viewRole, setViewRole] = useState("user");
  const [loading, setLoading] = useState(true);

  // 🔄 Load logged-in user
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me/");
        setUser(res.data);
        setViewRole(res.data.role);

        // Connect websocket AFTER auth is valid
        connectSocket();
      } catch (err) {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    const res = await api.post("/auth/login/", {
      email,
      password,
    });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    const me = await api.get("/auth/me/");
    setUser(me.data);
    setViewRole(me.data.role);

    connectSocket(); // connect only after token saved
  };

  // 📝 SIGNUP
  const signup = async (email, password, name) => {
    await api.post("/auth/signup/", {
      email,
      password,
      name,
      role: "user",
    });

    // auto login
    await login(email, password);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  const switchRole = (role) => setViewRole(role);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, viewRole, switchRole, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);











