import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../../../api/axios";

import {
  Mail,
  Loader2,
  ArrowLeft,
} from "lucide-react";


// ======================================================
// FORGOT PASSWORD
// ======================================================

export default function ForgotPassword() {
  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return setError(
        "Email is required"
      );
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post(
        "/auth/password-reset/",
        {
          email,
        }
      );

      setMessage(
        "OTP sent to your registered email"
      );

      setTimeout(() => {
        navigate(
          "/reset-password",
          {
            state: {
              email,
            },
          }
        );
      }, 1500);

    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Email not found"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        space-y-6
        text-white
      "
    >

      {/* HEADER */}
      <div className="
        text-center
        mb-8
      ">
        <h2 className="
          text-4xl
          font-bold
          bg-gradient-to-r
          from-emerald-400
          to-blue-400
          bg-clip-text
          text-transparent
        ">
          Reset Password
        </h2>

        <p className="
          text-slate-400
          mt-3
        ">
          Enter your registered email
        </p>
      </div>


      {/* ERROR */}
      {error && (
        <div className="
          bg-red-500/10
          border border-red-500/20
          text-red-400
          rounded-2xl
          p-4
          text-sm
          text-center
        ">
          {error}
        </div>
      )}


      {/* SUCCESS */}
      {message && (
        <div className="
          bg-emerald-500/10
          border border-emerald-500/20
          text-emerald-400
          rounded-2xl
          p-4
          text-sm
          text-center
        ">
          {message}
        </div>
      )}


      {/* EMAIL */}
      <div>
        <label className="
          block text-sm
          text-slate-300
          mb-2
        ">
          Email
        </label>

        <div className="relative">

          <Mail
            size={18}
            className="
              absolute
              left-4 top-4
              text-slate-500
            "
          />

          <input
            type="email"
            value={email}
            required
            disabled={loading}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="Enter your email"
            className="
              w-full
              pl-12 pr-4 py-4
              rounded-2xl
              bg-slate-800/70
              border border-white/10
              focus:ring-2
              focus:ring-emerald-500
              outline-none
            "
          />

        </div>
      </div>


      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-emerald-500
          to-blue-500
          hover:scale-[1.02]
          transition-all
          font-semibold
          flex items-center
          justify-center
          gap-2
        "
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Sending OTP...
          </>
        ) : (
          "Send OTP"
        )}
      </button>


      {/* BACK */}
      <div className="
        text-center
      ">
        <Link
          to="/login"
          className="
            inline-flex
            items-center
            gap-2
            text-emerald-400
            hover:underline
          "
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>

    </form>
  );
}