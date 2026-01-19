
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DashboardBackground from "../../components/common/DashboardBackground";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load email from forgot-password page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/password-reset-confirm/", {
        email,
        otp,
        new_password: newPassword,
      });

      setMessage("✅ Password reset successfully!");

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

  // If user reloads page without email
  if (!email) {
    return (
      <DashboardBackground>
        <div className="min-h-screen flex flex-col items-center justify-center text-white">
          <p className="text-red-400 mb-4">
            Invalid password reset request.
          </p>
          <Link to="/forgot-password" className="text-emerald-400 underline">
            Try Again
          </Link>
        </div>
      </DashboardBackground>
    );
  }

  return (
    <DashboardBackground>
      <div className="min-h-screen flex items-center justify-center px-4">

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 p-8 rounded-2xl w-full max-w-md text-white shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            🔑 Reset Password
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-2 rounded mb-4 text-sm text-center">
              {message}
            </div>
          )}

          {/* OTP */}
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* New Password */}
          <div className="relative mb-5">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-emerald-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className="text-sm text-slate-400 mt-6 text-center">
            Back to{" "}
            <Link to="/login" className="text-emerald-400 hover:underline">
              Login
            </Link>
          </p>

        </form>

      </div>
    </DashboardBackground>
  );
}















// import { useState, useEffect } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import api from "../../services/api";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// export default function ResetPassword() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Get email from navigation state
//   useEffect(() => {
//     if (location.state?.email) {
//       setEmail(location.state.email);
//     }
//   }, [location.state]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setLoading(true);

//     try {
//       await api.post("/auth/password-reset-confirm/", {
//         email,
//         otp,
//         new_password: newPassword,
//       });

//       setMessage("Password reset successful!");

//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);
//     } catch (err) {
//       console.error(err);
//       setError(
//         err?.response?.data?.error ||
//         err?.response?.data?.detail ||
//         "Invalid or expired OTP"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // If user reloads without email
//   if (!email) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
//         <p className="text-red-400 mb-4">
//           Invalid password reset request.
//         </p>
//         <Link to="/forgot-password" className="text-emerald-400 underline">
//           Try Again
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-slate-800 p-6 rounded-xl w-full max-w-sm border border-slate-700"
//       >
//         <h2 className="text-xl text-white mb-4 text-center">
//           Reset Password
//         </h2>

//         {error && (
//           <p className="text-red-400 text-sm mb-3 text-center">
//             {error}
//           </p>
//         )}

//         {message && (
//           <p className="text-emerald-400 text-sm mb-3 text-center">
//             {message}
//           </p>
//         )}

//         {/* OTP */}
//         <input
//           type="text"
//           placeholder="Enter OTP"
//           value={otp}
//           required
//           onChange={(e) => setOtp(e.target.value)}
//           className="w-full mb-3 px-3 py-2 rounded bg-slate-700 text-white outline-none"
//         />

//         {/* NEW PASSWORD */}
//         <div className="relative mb-4">
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="New Password"
//             value={newPassword}
//             required
//             onChange={(e) => setNewPassword(e.target.value)}
//             className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none pr-10"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-2.5 text-slate-400 hover:text-emerald-400"
//           >
//             {showPassword ? <FaEyeSlash /> : <FaEye />}
//           </button>
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 rounded text-white font-medium
//             ${
//               loading
//                 ? "bg-slate-600 cursor-not-allowed"
//                 : "bg-emerald-500 hover:bg-emerald-600"
//             }`}
//         >
//           {loading ? "Resetting..." : "Reset Password"}
//         </button>

//         <p className="text-sm text-slate-400 mt-4 text-center">
//           Back to{" "}
//           <Link to="/login" className="text-emerald-400 hover:underline">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

