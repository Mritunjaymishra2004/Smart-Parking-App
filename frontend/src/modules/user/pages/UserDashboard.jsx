import { useNavigate } from "react-router-dom";
import {
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  Wallet,
  MapPinned,
  CreditCard,
  Clock,
  TrendingUp,
  Wifi,
  Zap,
  ParkingCircle,
  Activity,
  Car,
  Timer,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useParking } from "../../../context/ParkingContext";

import EmptyState from "../../../shared/ui/EmptyState";
import StatCard from "../../../shared/ui/StatCard";
import Loader from "../../../shared/ui/Loader";

export default function UserDashboard() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { session } =
    useParking() || {};

  const [wallet,
    setWallet] =
    useState(500);

  const [amount,
    setAmount] =
    useState("");

  const [elapsed,
    setElapsed] =
    useState(0);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setLoading(false);
      }, 800);

    return () =>
      clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!session) return;

    const interval =
      setInterval(() => {
        setElapsed(
          (prev) => prev + 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [session]);

  const formattedTime =
    useMemo(() => {
      const h =
        Math.floor(
          elapsed / 3600
        );

      const m =
        Math.floor(
          (elapsed % 3600) / 60
        );

      const s =
        elapsed % 60;

      return `${h}h ${m}m ${s}s`;
    }, [elapsed]);

  const estimatedCost =
    Math.floor(
      elapsed / 60
    ) * 2;

  const addMoney = () => {
    const value =
      Number(amount);

    if (!value || value <= 0)
      return;

    setWallet(
      (prev) => prev + value
    );

    setAmount("");
  };

  if (loading)
    return <Loader />;

  if (!user)
    return (
      <EmptyState
        title="User Not Found"
      />
    );

  return (
    <div className="min-h-screen space-y-8 pb-10">

      {/* HERO */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-cyan-500/10 border border-white/10 shadow-xl">

        <div className="flex flex-col lg:flex-row justify-between gap-6">

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="text-emerald-400 text-xl mt-2">
              {user.username ||
                user.email}
            </p>

            <p className="text-slate-400 mt-3">
              Smart Parking IoT Control Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 h-fit">
            <Wifi className="text-emerald-400" />
            <span className="text-white font-medium">
              Live Connected
            </span>
          </div>

        </div>
      </div>


      {/* STATS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Wallet Balance"
          value={`₹${wallet}`}
          icon={<Wallet />}
          color="emerald"
        />

        <StatCard
          title="Parking Time"
          value={formattedTime}
          icon={<Clock />}
          color="blue"
        />

        <StatCard
          title="Estimated Cost"
          value={`₹${estimatedCost}`}
          icon={<CreditCard />}
          color="amber"
        />

        <StatCard
          title="Parking Status"
          value={
            session
              ? "Active"
              : "Idle"
          }
          icon={<Activity />}
          color="red"
        />

      </div>


      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <ActionCard
          icon={<MapPinned />}
          title="Find Slot"
          desc="Book available slot"
          onClick={() =>
            navigate("/user/slots")
          }
        />

        <ActionCard
          icon={<ParkingCircle />}
          title="My Bookings"
          desc="Track reservations"
          onClick={() =>
            navigate("/user/bookings")
          }
        />

        <ActionCard
          icon={<CreditCard />}
          title="Payments"
          desc="Manage transactions"
          onClick={() =>
            navigate("/user/payment")
          }
        />

        <ActionCard
          icon={<Car />}
          title="Profile"
          desc="Update details"
          onClick={() =>
            navigate("/user/profile")
          }
        />

      </div>


      {/* SESSION + WALLET */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* ACTIVE SESSION */}
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-8 shadow-xl">

          <div className="flex items-center gap-3 mb-6">
            <Timer className="text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">
              Live Parking Session
            </h2>
          </div>

          <div className="space-y-4">

            <Info
              icon={<Clock />}
              label="Elapsed Time"
              value={formattedTime}
            />

            <Info
              icon={<CreditCard />}
              label="Estimated Cost"
              value={`₹${estimatedCost}`}
            />

            <Info
              icon={<CheckCircle2 />}
              label="Status"
              value={
                session
                  ? "Running"
                  : "Inactive"
              }
            />

          </div>

        </div>


        {/* WALLET */}
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-8 shadow-xl">

          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-emerald-400" />
            <h2 className="text-2xl font-semibold text-white">
              Recharge Wallet
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="Enter amount"
              className="flex-1 px-5 py-4 rounded-2xl bg-slate-800 text-white border border-slate-700"
            />

            <button
              onClick={addMoney}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition"
            >
              Add Money
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

function ActionCard({
  icon,
  title,
  desc,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-3xl bg-slate-900/70 border border-white/10 p-8 hover:scale-105 transition-all text-left shadow-lg"
    >
      <div className="text-emerald-400 mb-4">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="text-slate-400 text-sm mt-2">
        {desc}
      </p>
    </button>
  );
}

function Info({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5">

      <div className="flex items-center gap-3 text-white">
        {icon}
        {label}
      </div>

      <span className="text-emerald-400 font-medium">
        {value}
      </span>

    </div>
  );
}