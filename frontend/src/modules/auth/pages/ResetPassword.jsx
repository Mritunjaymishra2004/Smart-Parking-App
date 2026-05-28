import {
  useState,
  useEffect,
} from "react";

import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

import api from "../../../api/axios";

import {
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  Loader2,
  ArrowLeft,
} from "lucide-react";


// ======================================================
// RESET PASSWORD
// ======================================================

export default function ResetPassword() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [email, setEmail] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ======================================================
  // LOAD EMAIL
  // ======================================================

  useEffect(() => {
    if (
      location.state?.email
    ) {
      setEmail(
        location.state.email
      );
    }
  }, [location.state]);


  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      return setError(
        "OTP is required"
      );
    }

    if (!newPassword.trim()) {
      return setError(
        "New password is required"
      );
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post(
        "/auth/password-reset-confirm/",
        {
          email,
          otp,
          new_password:
            newPassword,
        }
      );

      setMessage(
        "Password reset successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Invalid or expired OTP"
      );

    } finally {
      setLoading(false);
    }
  };


  // ======================================================
  // INVALID ACCESS
  // ======================================================

  if (!email) {
    return (
      <div className="
        text-center
        space-y-5
        text-white
      ">
        <p className="
          text-red-400
          text-lg
        ">
          Invalid password reset request
        </p>

        <Link
          to="/forgot-password"
          className="
            text-emerald-400
            hover:underline
          "
        >
          Try Again
        </Link>
      </div>
    );
  }


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
          Set New Password
        </h2>

        <p className="
          text-slate-400
          mt-3
        ">
          Verify OTP and create a new password
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


      {/* OTP */}
      <div>
        <label className="
          block text-sm
          text-slate-300
          mb-2
        ">
          OTP Code
        </label>

        <div className="relative">

          <KeyRound
            size={18}
            className="
              absolute
              left-4 top-4
              text-slate-500
            "
          />

          <input
            type="text"
            value={otp}
            required
            disabled={loading}
            onChange={(e) =>
              setOtp(
                e.target.value
              )
            }
            placeholder="Enter OTP"
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


      {/* PASSWORD */}
      <div>
        <label className="
          block text-sm
          text-slate-300
          mb-2
        ">
          New Password
        </label>

        <div className="relative">

          <Lock
            size={18}
            className="
              absolute
              left-4 top-4
              text-slate-500
            "
          />

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={newPassword}
            required
            disabled={loading}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            placeholder="Create new password"
            className="
              w-full
              pl-12 pr-14 py-4
              rounded-2xl
              bg-slate-800/70
              border border-white/10
              focus:ring-2
              focus:ring-emerald-500
              outline-none
            "
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className="
              absolute
              right-4 top-4
              text-slate-400
            "
          >
            {showPassword
              ? <EyeOff size={20} />
              : <Eye size={20} />}
          </button>

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
            Resetting...
          </>
        ) : (
          "Reset Password"
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