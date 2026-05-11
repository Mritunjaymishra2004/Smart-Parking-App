// ✅ UPDATED UserDashboard.jsx (FINAL INDUSTRY VERSION)

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import LiveParkingMap from "../../components/map/LiveParkingMap";
import Navbar from "../../components/common/Navbar";
import DashboardBackground from "../../components/common/DashboardBackground";
import api from "../../services/api";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();

  const [wallet, setWallet] = useState(0);
  const [amount, setAmount] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [estimated, setEstimated] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(true);

  // ================= SLOT RELEASE =================
  useEffect(() => {
    if (state?.slotFreed) {
      alert("Slot released. Thank you!");
    }
  }, [state]);

  // ================= WALLET =================
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get("/wallet/balance/");
        setWallet(res.data?.wallet_balance ?? 0);
      } catch {
        setWallet(0);
      } finally {
        setLoadingWallet(false);
      }
    };
    fetchWallet();
  }, []);

  // ================= SESSION =================
  const loadSession = async () => {
    try {
      const res = await api.get("/parking/active/"); // ✅ FIXED
      setActiveSession(res.data || null);
    } catch {
      setActiveSession(null);
    }
  };

  useEffect(() => {
    loadSession();
    const refresh = setInterval(loadSession, 30000);
    return () => clearInterval(refresh);
  }, []);

  // ================= TIMER =================
  useEffect(() => {
    if (!activeSession) return;

    const start = new Date(activeSession.entry_time);

    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - start) / 1000);

      setElapsed(seconds);
      setEstimated(Math.ceil((seconds / 3600) * 50));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession]);

  const formattedTime = useMemo(() => {
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    return `${h}h ${m}m ${s}s`;
  }, [elapsed]);

  // ================= WALLET ADD =================
  const addMoney = async () => {
    const value = Number(amount);

    if (!value || value <= 0) return alert("Enter valid amount");
    if (value > 10000) return alert("Max ₹10000");

    try {
      const res = await api.post("/wallet/add/", { amount: value });
      setWallet(res.data?.wallet_balance ?? wallet);
      setAmount("");
    } catch {
      alert("Failed");
    }
  };

  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="pt-16 min-h-screen flex flex-col lg:flex-row text-white">

          {/* ================= MAP ================= */}
          <div className="flex-1 p-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl h-[500px] lg:h-full overflow-hidden shadow-xl">
              
              <div className="px-4 py-3 border-b border-slate-800">
                <h2 className="text-lg font-semibold">
                  Live Parking Map
                </h2>
              </div>

              <div className="h-[calc(100%-48px)]">
                <LiveParkingMap />
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="w-full lg:w-[360px] bg-slate-900 border-l border-slate-800 p-4 space-y-4">

            {/* PROFILE */}
            <div className="bg-slate-800 p-4 rounded-xl">
              <h3 className="font-bold">Profile</h3>
              <p>{user?.name || user?.username}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Quick Actions</h3>

              <button
                onClick={() => navigate("/slots")}
                className="bg-emerald-600 w-full py-2 rounded mb-2 hover:bg-emerald-700"
              >
                Find Parking
              </button>

              <button
                onClick={() => navigate("/map")} // ✅ FIXED
                className="bg-blue-600 w-full py-2 rounded hover:bg-blue-700"
              >
                Open Live Map
              </button>
            </div>

            {/* ACTIVE PARKING */}
            <div className="bg-slate-800 p-4 rounded-xl border border-emerald-600">
              <h3 className="font-bold text-emerald-400">
                ACTIVE PARKING
              </h3>

              {activeSession ? (
                <>
                  <p className="mt-1">
                    Slot {activeSession.slot_code}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    {formattedTime}
                  </p>

                  <p className="mt-2 text-lg text-emerald-400">
                    ₹{estimated}
                  </p>

                  <button
                    onClick={() =>
                      navigate("/payment", { state: activeSession })
                    }
                    className="mt-3 bg-red-600 w-full py-2 rounded hover:bg-red-700"
                  >
                    Exit & Pay
                  </button>
                </>
              ) : (
                <p className="text-slate-400 mt-2">
                  No active session
                </p>
              )}
            </div>

            {/* WALLET */}
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-bold">Wallet</h3>

              <p className="text-2xl text-emerald-400">
                {loadingWallet ? "..." : `₹${wallet}`}
              </p>

              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  placeholder="Amount"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  onClick={addMoney}
                  className="bg-blue-600 px-3 rounded"
                >
                  Add
                </button>
              </div>
            </div>

            {/* BOOKINGS */}
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-bold">My Bookings</h3>

              <button
                onClick={() => navigate("/my-bookings")}
                className="mt-2 bg-slate-700 w-full py-1.5 rounded"
              >
                View History
              </button>
            </div>

          </div>
        </div>
      </DashboardBackground>
    </>
  );
}