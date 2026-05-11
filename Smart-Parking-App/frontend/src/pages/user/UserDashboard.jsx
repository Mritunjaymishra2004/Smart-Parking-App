import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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

  // ================================
  // Slot released message
  // ================================
  useEffect(() => {
    if (state?.slotFreed) {
      alert("Slot released. Thank you for using Smart Parking!");
    }
  }, [state]);

  // ================================
  // Load wallet + active session
  // ================================
  const loadData = async () => {
    try {
      const walletRes = await api.get("/wallet/balance/");
      setWallet(walletRes.data.wallet_balance);

      const sessionRes = await api.get("/sessions/");
      const active = sessionRes.data.find(s => s.exit_time === null);
      setActiveSession(active || null);
    } catch {
      setWallet(0);
      setActiveSession(null);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================================
  // Live timer from backend start_time
  // ================================
  useEffect(() => {
    if (!activeSession) return;

    const start = new Date(activeSession.entry_time);

    const timer = setInterval(() => {
      const now = new Date();
      const seconds = Math.floor((now - start) / 1000);
      setElapsed(seconds);

      const hours = seconds / 3600;
      setEstimated(Math.ceil(hours * 50));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  // ================================
  // Add money
  // ================================
  const addMoney = async () => {
    if (!amount || amount <= 0) return;

    try {
      const res = await api.post("/wallet/add/", { amount });
      setWallet(res.data.wallet_balance);
      setAmount("");
      alert("Wallet updated!");
    } catch {
      alert("Wallet update failed");
    }
  };

  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="pt-16 h-screen flex text-white">

          {/* ================= MAP ================= */}
          <div className="flex-1 p-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl h-full overflow-hidden shadow-xl">
              <div className="px-4 py-3 border-b border-slate-800">
                <h2 className="text-lg font-semibold">Live Parking Map</h2>
              </div>
              <div className="h-[calc(100%-48px)]">
                <LiveParkingMap />
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="w-[360px] bg-slate-900 border-l border-slate-800 p-4 space-y-4 overflow-y-auto">

            {/* PROFILE */}
            <div className="bg-slate-800 p-4 rounded-xl">
              <h3 className="font-bold">Profile</h3>
              <p>{user?.name}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>

            {/* ACTIVE PARKING */}
            <div className="bg-slate-800 p-4 rounded-xl border border-emerald-600">
              <h3 className="font-bold text-emerald-400">ACTIVE PARKING</h3>

              {activeSession ? (
                <>
                  <p className="mt-1 text-slate-300">
                    Slot {activeSession.slot_code}
                  </p>

                  <div className="mt-3 bg-slate-900 p-3 rounded">
                    <p className="text-slate-400">Time Parked</p>
                    <p className="text-xl font-bold">
                      {formatTime(elapsed)}
                    </p>
                  </div>

                  <div className="mt-3 bg-slate-900 p-3 rounded">
                    <p className="text-slate-400">Estimated Charge</p>
                    <p className="text-xl font-bold text-emerald-400">
                      ₹{estimated}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate("/payment", { state: activeSession })
                    }
                    className="mt-4 bg-red-600 w-full py-2 rounded hover:bg-red-700"
                  >
                    Exit & Pay
                  </button>
                </>
              ) : (
                <p className="text-slate-400 mt-2">No active session</p>
              )}
            </div>

            {/* WALLET */}
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="font-bold">Wallet</h3>

              <p className="text-2xl font-bold text-emerald-400">
                ₹{wallet}
              </p>

              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  placeholder="Amount"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                <button
                  onClick={addMoney}
                  className="bg-blue-600 px-3 rounded hover:bg-blue-700"
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
                className="mt-2 bg-slate-700 w-full py-1.5 rounded hover:bg-slate-600"
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

