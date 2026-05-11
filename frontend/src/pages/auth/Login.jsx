import {
  useState,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import DashboardBackground from "../../components/common/DashboardBackground";

import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

// ======================================================
// LOGIN PAGE
// ======================================================

export default function Login() {

  const { login } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // ====================================================
  // FORM STATE
  // ====================================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPass, setShowPass] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ====================================================
  // REDIRECT PATH
  // ====================================================

  const from =
    location.state?.from?.pathname;

  // ====================================================
  // SUBMIT
  // ====================================================

  const submit = async (e) => {

    e.preventDefault();

    // ==============================================
    // VALIDATION
    // ==============================================

    if (!email.trim()) {

      return setError(
        "Email is required"
      );
    }

    if (!password.trim()) {

      return setError(
        "Password is required"
      );
    }

    setError("");

    setLoading(true);

    try {

      const user =
        await login(
          email,
          password
        );

      // ============================================
      // ROLE BASED REDIRECT
      // ============================================

      if (from) {

        navigate(from, {
          replace: true,
        });

      } else if (
        user?.role === "admin"
      ) {

        navigate(
          "/admin",
          {
            replace: true,
          }
        );

      } else {

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );
      }

    } catch (err) {

      console.error(
        "Login error:",
        err
      );

      // ============================================
      // BACKEND ERROR
      // ============================================

      if (
        err?.response?.status === 401
      ) {

        setError(
          "Invalid email or password"
        );

      } else if (
        err?.response?.data?.detail
      ) {

        setError(
          err.response.data.detail
        );

      } else if (
        err?.response?.data?.error
      ) {

        setError(
          err.response.data.error
        );

      } else {

        setError(
          "Unable to connect to server"
        );
      }

    } finally {

      setLoading(false);
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (

    <DashboardBackground>

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
      ">

        <form
          onSubmit={submit}
          className="
            w-full
            max-w-md
            bg-slate-900/80
            backdrop-blur-xl
            border
            border-slate-800
            rounded-3xl
            p-8
            shadow-2xl
            text-white
            animate-fadeIn
          "
        >

          {/* ===================================== */}
          {/* TITLE */}
          {/* ===================================== */}

          <div className="text-center mb-8">

            <h1 className="
              text-4xl
              font-bold
              text-emerald-400
            ">
              Welcome Back
            </h1>

            <p className="
              text-slate-400
              mt-2
            ">
              Login to Smart Parking
            </p>

          </div>

          {/* ===================================== */}
          {/* ERROR */}
          {/* ===================================== */}

          {error && (

            <div className="
              bg-red-500/10
              border
              border-red-500
              text-red-400
              p-3
              rounded-xl
              mb-5
              text-sm
              text-center
            ">
              {error}
            </div>
          )}

          {/* ===================================== */}
          {/* EMAIL */}
          {/* ===================================== */}

          <div className="mb-4">

            <label className="
              block
              text-sm
              text-slate-300
              mb-2
            ">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              disabled={loading}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                p-3
                rounded-xl
                bg-slate-800
                border
                border-slate-700
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
                disabled:opacity-50
              "
              required
            />

          </div>

          {/* ===================================== */}
          {/* PASSWORD */}
          {/* ===================================== */}

          <div className="mb-4">

            <label className="
              block
              text-sm
              text-slate-300
              mb-2
            ">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPass
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                value={password}
                disabled={loading}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  p-3
                  pr-12
                  rounded-xl
                  bg-slate-800
                  border
                  border-slate-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                  disabled:opacity-50
                "
                required
              />

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  setShowPass(
                    !showPass
                  )
                }
                className="
                  absolute
                  right-3
                  top-3
                  text-slate-400
                  hover:text-white
                "
              >
                {showPass
                  ? <EyeOff size={20} />
                  : <Eye size={20} />
                }
              </button>

            </div>

          </div>

          {/* ===================================== */}
          {/* FORGOT PASSWORD */}
          {/* ===================================== */}

          <div className="
            text-right
            mb-6
          ">

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                navigate(
                  "/forgot-password"
                )
              }
              className="
                text-sm
                text-emerald-400
                hover:underline
              "
            >
              Forgot password?
            </button>

          </div>

          {/* ===================================== */}
          {/* BUTTON */}
          {/* ===================================== */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-emerald-600
              hover:bg-emerald-700
              py-3
              rounded-xl
              font-semibold
              transition
              disabled:opacity-50
              flex
              items-center
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
                Logging in...
              </>
            ) : (
              "Login"
            )}

          </button>

          {/* ===================================== */}
          {/* SIGNUP */}
          {/* ===================================== */}

          <p className="
            text-center
            text-slate-400
            text-sm
            mt-6
          ">

            Don’t have an account?{" "}

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                navigate("/signup")
              }
              className="
                text-emerald-400
                hover:underline
              "
            >
              Sign up
            </button>

          </p>

        </form>

      </div>

    </DashboardBackground>
  );
}


















// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import DashboardBackground from "../../components/common/DashboardBackground";
// import { Eye, EyeOff } from "lucide-react";

// export default function Login({ embedded }) {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await login(email, password);
//       navigate("/"); // redirect after login
//     } catch (err) {
//       setError(err.response?.data?.error || "Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardBackground>
//       <div className="min-h-screen flex items-center justify-center">

//         <form
//           onSubmit={submit}
//           className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 p-8 rounded-2xl w-full max-w-md text-white shadow-xl"
//         >
//           <h1 className="text-3xl font-bold mb-6 text-center">
//             Welcome Back
//           </h1>

//           {error && (
//             <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm text-center">
//               {error}
//             </div>
//           )}

//           {/* EMAIL */}
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           {/* PASSWORD WITH EYE */}
//           <div className="relative mb-4">
//             <input
//               type={showPass ? "text" : "password"}
//               placeholder="Password"
//               className="w-full p-3 pr-10 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <button
//               type="button"
//               onClick={() => setShowPass(!showPass)}
//               className="absolute right-3 top-3 text-slate-400 hover:text-white"
//             >
//               {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {/* FORGOT PASSWORD */}
//           <div className="text-right mb-4">
//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               className="text-sm text-emerald-400 hover:underline"
//             >
//               Forgot password?
//             </button>
//           </div>

//           {/* LOGIN BUTTON */}
//           <button
//             disabled={loading}
//             className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>

//           {/* SIGNUP LINK */}
//           <p className="text-center text-slate-400 text-sm mt-6">
//             Don’t have an account?{" "}
//             <button
//               type="button"
//               onClick={() => navigate("/signup")}
//               className="text-emerald-400 hover:underline"
//             >
//               Sign up
//             </button>
//           </p>
//         </form>

//       </div>
//     </DashboardBackground>
//   );
// }



// import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import DashboardBackground from "../../components/common/DashboardBackground";
// import { Eye, EyeOff } from "lucide-react";

// export default function Login() {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ===============================
//   // 🔹 HANDLE LOGIN
//   // ===============================
//   const submit = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       return setError("Please enter email and password");
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const user = await login(email, password);

//       // 🔥 SAFE REDIRECT (NO LOOP)
//       if (user?.role === "admin") {
//         navigate("/admin", { replace: true });
//       } else {
//         navigate("/dashboard", { replace: true });
//       }

//     } catch (err) {
//       console.error(err);

//       if (err.response?.status === 401) {
//         setError("Invalid email or password");
//       } else if (err.response?.data?.error) {
//         setError(err.response.data.error);
//       } else {
//         setError("Server error. Try again.");
//       }

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardBackground>
//       <div className="min-h-screen flex items-center justify-center px-4">

//         <form
//           onSubmit={submit}
//           className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 p-8 rounded-2xl w-full max-w-md text-white shadow-xl"
//         >
//           <h1 className="text-3xl font-bold mb-6 text-center text-emerald-400">
//             Welcome Back
//           </h1>

//           {/* ERROR MESSAGE */}
//           {error && (
//             <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm text-center">
//               {error}
//             </div>
//           )}

//           {/* EMAIL */}
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           {/* PASSWORD */}
//           <div className="relative mb-4">
//             <input
//               type={showPass ? "text" : "password"}
//               placeholder="Password"
//               className="w-full p-3 pr-10 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <button
//               type="button"
//               onClick={() => setShowPass(!showPass)}
//               className="absolute right-3 top-3 text-slate-400 hover:text-white"
//             >
//               {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {/* FORGOT PASSWORD */}
//           <div className="text-right mb-4">
//             <button
//               type="button"
//               onClick={() => navigate("/forgot-password")}
//               className="text-sm text-emerald-400 hover:underline"
//             >
//               Forgot password?
//             </button>
//           </div>

//           {/* LOGIN BUTTON */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>

//           {/* SIGNUP */}
//           <p className="text-center text-slate-400 text-sm mt-6">
//             Don’t have an account?{" "}
//             <button
//               type="button"
//               onClick={() => navigate("/signup")}
//               className="text-emerald-400 hover:underline"
//             >
//               Sign up
//             </button>
//           </p>
//         </form>

//       </div>
//     </DashboardBackground>
//   );
// }