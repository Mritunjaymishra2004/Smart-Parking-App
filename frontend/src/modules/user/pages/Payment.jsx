import {
  useState,
} from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  ShieldCheck,
  Clock3,
  Loader2,
  Receipt,
  Sparkles,
  Wifi,
} from "lucide-react";

import EmptyState from "../../../shared/ui/EmptyState";

export default function Payment() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const bookingData =
    location.state;

  const [loading,
    setLoading] =
    useState(false);

  const [success,
    setSuccess] =
    useState(false);

  const [error,
    setError] =
    useState("");

  if (!bookingData) {
    return (
      <EmptyState
        title="No Booking Found"
        description="Please book slot first."
      />
    );
  }

  const {
    slot,
    hours,
    price,
  } = bookingData;

  const bookingId =
    `BK-${Date.now()}`;

  const handlePayment =
    async () => {
      try {
        setLoading(true);
        setError("");

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              2000
            )
        );

        setSuccess(true);

        setTimeout(() => {
          navigate(
            "/user/dashboard"
          );
        }, 2500);

      } catch {
        setError(
          "Payment failed. Retry."
        );
      } finally {
        setLoading(false);
      }
    };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-xl w-full rounded-3xl bg-slate-900/80 border border-emerald-500/20 p-12 text-center shadow-2xl">

          <CheckCircle2
            size={90}
            className="mx-auto text-emerald-400 mb-6"
          />

          <h2 className="text-4xl font-bold text-emerald-400">
            Payment Successful
          </h2>

          <p className="mt-4 text-slate-400">
            Parking slot booked successfully
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 pb-10">

      {/* SUMMARY */}
      <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-8 shadow-xl">

        <div className="flex items-center gap-4 mb-8">

          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
            <Receipt size={34} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white">
              Payment Summary
            </h1>

            <p className="text-slate-400">
              Secure Smart Checkout
            </p>
          </div>

        </div>

        <Info
          icon={<Receipt />}
          label="Booking ID"
          value={bookingId}
        />

        <Info
          icon={<Clock3 />}
          label="Duration"
          value={`${hours} Hours`}
        />

        <Info
          icon={<ShieldCheck />}
          label="Slot"
          value={slot.code}
        />

        <Info
          icon={<Wifi />}
          label="IoT Status"
          value="Connected"
        />

        <Info
          icon={<Sparkles />}
          label="Reservation"
          value="Confirmed"
        />

      </div>

      {/* CHECKOUT */}
      <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-8 shadow-xl">

        <h2 className="text-3xl font-bold mb-8 text-white">
          Checkout
        </h2>

        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-red-500/10 text-red-400">
            {error}
          </div>
        )}

        <div className="rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 p-8 mb-8">

          <div className="flex justify-between mb-10">
            <CreditCard size={30} />
            <span className="text-slate-400">
              SmartPay
            </span>
          </div>

          <h3 className="text-3xl font-bold tracking-widest text-white">
            **** **** **** 2048
          </h3>

          <p className="mt-6 text-slate-400">
            Protected Transaction
          </p>

        </div>

        <div className="flex justify-between items-center p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-8">

          <div className="flex items-center gap-2 text-white">
            <IndianRupee />
            Total
          </div>

          <span className="text-4xl font-bold text-emerald-400">
            ₹{price}
          </span>

        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 font-semibold flex items-center justify-center gap-3 hover:scale-105 transition"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard />
              Pay Now
            </>
          )}
        </button>

      </div>

    </div>
  );
}

function Info({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex justify-between items-center p-5 rounded-2xl bg-white/5 mb-4">
      <div className="flex items-center gap-3 text-white">
        {icon}
        {label}
      </div>

      <span className="text-emerald-400">
        {value}
      </span>
    </div>
  );
}