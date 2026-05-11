
import { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import DashboardBackground from "../../components/common/DashboardBackground";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/password-reset/", { email });

      setMessage("OTP sent to your registered email");

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1200);
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
    <DashboardBackground>
      <div className="min-h-screen flex items-center justify-center px-4">

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 p-8 rounded-2xl w-full max-w-md text-white shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Reset Password
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

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-5 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <p className="text-sm text-slate-400 mt-6 text-center">
            Remembered your password?{" "}
            <Link to="/login" className="text-emerald-400 hover:underline">
              Login
            </Link>
          </p>
        </form>

      </div>
    </DashboardBackground>
  );
}




































// import { useState } from "react";
// import api from "../../services/api";
// import { Link, useNavigate } from "react-router-dom";

// export default function ForgotPassword() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setLoading(true);

//     try {
//       await api.post("/auth/password-reset/", { email });

//       setMessage("OTP sent to your registered email");

//       setTimeout(() => {
//         navigate("/reset-password", {
//           state: { email },
//         });
//       }, 1200);
//     } catch (err) {
//       console.error(err);
//       setError(
//         err?.response?.data?.error ||
//         err?.response?.data?.detail ||
//         "Email not found"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

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

//         <input
//           type="email"
//           placeholder="Enter your registered email"
//           value={email}
//           required
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-4 px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-emerald-500"
//         />

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
//           {loading ? "Sending OTP..." : "Send OTP"}
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


