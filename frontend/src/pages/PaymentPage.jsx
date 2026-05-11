import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/common/Navbar";
import DashboardBackground from "../components/common/DashboardBackground";
import { useParking } from "../context/ParkingContext";

export default function PaymentPage() {
const { state } = useLocation();
const navigate = useNavigate();
const { refreshSession } = useParking();

const session = state;

const [charges, setCharges] = useState(null);
const [balance, setBalance] = useState(null);
const [loading, setLoading] = useState(false);
const [initialLoading, setInitialLoading] = useState(true);
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);

// ===============================
// 🔐 VALIDATE SESSION
// ===============================
useEffect(() => {
if (!session?.id) {
navigate("/dashboard");
}
}, [session, navigate]);

// ===============================
// 💰 LOAD DATA (PARALLEL)
// ===============================
useEffect(() => {
if (!session?.id) return;


const loadData = async () => {
  try {
    setInitialLoading(true);

    const [walletRes, chargeRes] = await Promise.all([
      api.get("/wallet/balance/"),
      api.get(`/sessions/${session.id}/charges/`),
    ]);

    setBalance(walletRes.data.wallet_balance || 0);
    setCharges(chargeRes.data.amount || 0);

  } catch (err) {
    console.error("Payment load error:", err);
    setError("Failed to load payment details");
  } finally {
    setInitialLoading(false);
  }
};

loadData();


}, [session]);

// ===============================
// 💳 PAY HANDLER
// ===============================
const handlePay = async () => {
if (loading || success) return;


setLoading(true);
setError("");

try {
  if (balance < charges) {
    setError("Insufficient wallet balance");
    return;
  }

  await api.post("/pay/", {
    session: session.id,
    method: "WALLET",
  });

  await refreshSession();

  setSuccess(true);

  setTimeout(() => {
    navigate("/dashboard");
  }, 2000);

} catch (err) {
  console.error(err);

  setError(
    err?.response?.data?.message ||
    "Payment failed. Try again."
  );
} finally {
  setLoading(false);
}


};

// ===============================
// 🔄 LOADING SCREEN
// ===============================
if (initialLoading) {
return ( <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
Loading payment details... </div>
);
}

// ===============================
// ❌ INVALID SESSION
// ===============================
if (!session?.id) {
return ( <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
No active parking session </div>
);
}

return (
<> <Navbar />


  <DashboardBackground>
    <div className="min-h-screen flex items-center justify-center text-white">

      <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 p-8 rounded-2xl w-[420px] shadow-xl">

        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">
          Exit & Pay
        </h2>

        {/* SUCCESS */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-3 rounded mb-4 text-center">
            ✅ Payment Successful! Redirecting...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* DETAILS */}
        <div className="space-y-4 text-lg">

          <div className="flex justify-between">
            <span>Slot</span>
            <span className="text-emerald-400">
              {session.slot_code || "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Wallet Balance</span>
            <span className="text-yellow-400">
              ₹{balance}
            </span>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Total Amount</span>
            <span className="text-green-400">
              ₹{charges}
            </span>
          </div>

        </div>

        {/* PAY BUTTON */}
        <button
          onClick={handlePay}
          disabled={loading || success}
          className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay & Exit"}
        </button>

        {/* CANCEL */}
        {!success && (
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 w-full border border-slate-600 py-2 rounded-lg hover:bg-slate-700"
          >
            Cancel
          </button>
        )}

      </div>

    </div>
  </DashboardBackground>
</>


);
}





















// // import { useLocation, useNavigate } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import api from "../services/api";
// // import Navbar from "../components/common/Navbar";
// // import DashboardBackground from "../components/common/DashboardBackground";

// // export default function PaymentPage() {
// //   const { state } = useLocation();
// //   const navigate = useNavigate();

// //   const session = state;

// //   const [charges, setCharges] = useState(0);
// //   const [loading, setLoading] = useState(false);

// //   // Validate session
// //   useEffect(() => {
// //     if (!session?.id) {
// //       navigate("/dashboard");
// //     }
// //   }, [session, navigate]);

// //   // Load payable amount
// //   useEffect(() => {
// //     if (!session?.id) return;

// //     api
// //       .get(`/sessions/${session.id}/charges/`)
// //       .then((res) => setCharges(res.data.amount))
// //       .catch(() => setCharges(0));
// //   }, [session]);

// //   const handlePay = async () => {
// //     try {
// //       setLoading(true);

// //       // Exit parking session (calculates final bill)
// //       const exit = await api.post("/sessions/exit/", {
// //         session: session.id,
// //       });

// //       const amount = exit.data.charges || charges;

// //       // Pay using wallet
// //       await api.post("/pay/", {
// //         session: session.id,
// //         method: "WALLET",
// //       });

// //       alert(`Paid ₹${amount}. Slot freed.`);

// //       navigate("/dashboard", { state: { slotFreed: true } });
// //     } catch (err) {
// //       console.error(err);
// //       alert("Payment failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (!session) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
// //         No active parking session
// //       </div>
// //     );
// //   }

// //   return (
// //     <>
// //       <Navbar />

// //       <DashboardBackground>
// //         <div className="min-h-screen flex items-center justify-center text-white">
// //           <div className="bg-slate-800 p-8 rounded-xl w-[400px] shadow-xl">

// //             <h2 className="text-2xl font-bold mb-6 text-center">
// //               Exit & Pay
// //             </h2>

// //             <div className="space-y-3 text-lg">
// //               <div className="flex justify-between">
// //                 <span>Slot</span>
// //                 <span className="text-emerald-400">
// //                   {session.slot_code}
// //                 </span>
// //               </div>

// //               <div className="flex justify-between">
// //                 <span>Vehicle</span>
// //                 <span>{session.plate || "Your Vehicle"}</span>
// //               </div>

// //               <div className="flex justify-between">
// //                 <span>Amount</span>
// //                 <span className="text-green-400 font-bold">
// //                   ₹{charges}
// //                 </span>
// //               </div>
// //             </div>

// //             <button
// //               onClick={handlePay}
// //               disabled={loading}
// //               className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg text-lg font-semibold disabled:opacity-50"
// //             >
// //               {loading ? "Processing..." : "Pay & Exit"}
// //             </button>

// //             <button
// //               onClick={() => navigate("/dashboard")}
// //               className="mt-4 w-full border border-slate-600 py-2 rounded-lg hover:bg-slate-700"
// //             >
// //               Cancel
// //             </button>

// //           </div>
// //         </div>
// //       </DashboardBackground>
// //     </>
// //   );
// // } 


// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../services/api";
// import Navbar from "../components/common/Navbar";
// import DashboardBackground from "../components/common/DashboardBackground";

// export default function PaymentPage() {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   // 🔥 Safe session (fallback from localStorage)
//   const session = state || {
//     id: localStorage.getItem("session_id"),
//     slot_code: "N/A",
//   };

//   const [charges, setCharges] = useState(0);
//   const [balance, setBalance] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // ===============================
//   // 🔹 Validate session
//   // ===============================
//   useEffect(() => {
//     if (!session?.id) {
//       navigate("/dashboard");
//     }
//   }, [session, navigate]);

//   // ===============================
//   // 🔹 Load wallet balance
//   // ===============================
//   useEffect(() => {
//     api.get("/wallet/balance/")
//       .then(res => setBalance(res.data.wallet_balance))
//       .catch(() => setBalance(0));
//   }, []);

//   // ===============================
//   // 🔹 Calculate charges (preview)
//   // ===============================
//   useEffect(() => {
//     if (!session?.id) return;

//     api.get(`/sessions/${session.id}/charges/`)
//       .then(res => setCharges(res.data.amount))
//       .catch(() => setCharges(0));
//   }, [session]);

//   // ===============================
//   // 🔹 Pay & Exit
//   // ===============================
//   const handlePay = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       // Step 1: Exit session (final bill)
//       const exit = await api.post("/sessions/exit/", {
//         session: session.id,
//       });

//       const amount = exit.data.charges || charges;

//       // Step 2: Check wallet
//       if (balance < amount) {
//         setError("Insufficient wallet balance");
//         return;
//       }

//       // Step 3: Pay
//       await api.post("/pay/", {
//         session: session.id,
//         method: "WALLET",
//       });

//       alert(`Payment successful! ₹${amount}`);

//       localStorage.removeItem("session_id");

//       navigate("/dashboard");

//     } catch (err) {
//       console.error(err);
//       setError("Payment failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!session?.id) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
//         No active parking session
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />

//       <DashboardBackground>
//         <div className="min-h-screen flex items-center justify-center text-white">

//           <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 p-8 rounded-2xl w-[420px] shadow-xl">

//             <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">
//               Exit & Pay
//             </h2>

//             {error && (
//               <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm text-center">
//                 {error}
//               </div>
//             )}

//             <div className="space-y-3 text-lg">

//               <div className="flex justify-between">
//                 <span>Slot</span>
//                 <span className="text-emerald-400">
//                   {session.slot_code}
//                 </span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Wallet</span>
//                 <span className="text-yellow-400">
//                   ₹{balance}
//                 </span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Amount</span>
//                 <span className="text-green-400 font-bold">
//                   ₹{charges}
//                 </span>
//               </div>

//             </div>

//             <button
//               onClick={handlePay}
//               disabled={loading}
//               className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition disabled:opacity-50"
//             >
//               {loading ? "Processing..." : "Pay & Exit"}
//             </button>

//             <button
//               onClick={() => navigate("/dashboard")}
//               className="mt-4 w-full border border-slate-600 py-2 rounded-lg hover:bg-slate-700"
//             >
//               Cancel
//             </button>

//           </div>

//         </div>
//       </DashboardBackground>
//     </>
//   );
// }