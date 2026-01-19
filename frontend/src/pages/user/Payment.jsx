import { useEffect, useState } from "react";
import { useParking } from "../../context/ParkingContext";
import { useAuth } from "../../context/AuthContext";
import { calculateBill } from "../../utils/parkingEngine";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const { session, stopParking } = useParking();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (session) {
        setBill(calculateBill(session.startTime, Date.now(), session.vehicleType));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [session]);

  if (!session) return <div className="p-10 text-white">No active parking</div>;

  const handlePay = () => {
    setUser({
      ...user,
      wallet: user.wallet - bill.amount,
      activeSlot: null,
    });

    stopParking();
    navigate("/dashboard", { state: { slotFreed: true } });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="bg-slate-900 p-8 rounded-xl w-[400px] space-y-4">
        <h2 className="text-xl font-bold">🧾 Parking Bill</h2>
        <p>Slot: {session.slotCode}</p>
        <p>Vehicle: {session.vehicleType.toUpperCase()}</p>
        <p>Time: {bill?.minutes} minutes</p>
        <p className="text-2xl font-bold">₹{bill?.amount}</p>

        <button
          onClick={handlePay}
          className="w-full bg-emerald-600 py-2 rounded-lg font-bold"
        >
          Pay & Exit
        </button>
      </div>
    </div>
  );
}
