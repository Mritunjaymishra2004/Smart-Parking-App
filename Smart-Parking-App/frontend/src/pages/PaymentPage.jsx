import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/common/Navbar";
import DashboardBackground from "../components/common/DashboardBackground";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const session = state;

  const [charges, setCharges] = useState(0);
  const [loading, setLoading] = useState(false);

  // Validate session
  useEffect(() => {
    if (!session?.id) {
      navigate("/dashboard");
    }
  }, [session, navigate]);

  // Load payable amount
  useEffect(() => {
    if (!session?.id) return;

    api
      .get(`/sessions/${session.id}/charges/`)
      .then((res) => setCharges(res.data.amount))
      .catch(() => setCharges(0));
  }, [session]);

  const handlePay = async () => {
    try {
      setLoading(true);

      // Exit parking session (calculates final bill)
      const exit = await api.post("/sessions/exit/", {
        session: session.id,
      });

      const amount = exit.data.charges || charges;

      // Pay using wallet
      await api.post("/pay/", {
        session: session.id,
        method: "WALLET",
      });

      alert(`Paid ₹${amount}. Slot freed.`);

      navigate("/dashboard", { state: { slotFreed: true } });
    } catch (err) {
      console.error(err);
      alert("❌ Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        No active parking session
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <DashboardBackground>
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="bg-slate-800 p-8 rounded-xl w-[400px] shadow-xl">

            <h2 className="text-2xl font-bold mb-6 text-center">
              Exit & Pay
            </h2>

            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span>Slot</span>
                <span className="text-emerald-400">
                  {session.slot_code}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Vehicle</span>
                <span>{session.plate || "Your Vehicle"}</span>
              </div>

              <div className="flex justify-between">
                <span>Amount</span>
                <span className="text-green-400 font-bold">
                  ₹{charges}
                </span>
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg text-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay & Exit"}
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 w-full border border-slate-600 py-2 rounded-lg hover:bg-slate-700"
            >
              Cancel
            </button>

          </div>
        </div>
      </DashboardBackground>
    </>
  );
}