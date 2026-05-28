
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import DashboardBackground from "../../components/common/DashboardBackground";
// import { Eye, EyeOff } from "lucide-react";

// export default function Signup() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [role, setRole] = useState("user");
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       await api.post("/auth/signup/", {
//         name,
//         email,
//         password,
//         role,
//       });

//       setSuccess("Account created! Redirecting to login…");

//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);
//     } catch (err) {
//       setError(err?.response?.data?.error || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardBackground>
//       <div className="min-h-screen flex items-center justify-center px-4">

//         <form
//           onSubmit={submit}
//           className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full max-w-md text-white shadow-xl"
//         >
//           <h1 className="text-3xl font-bold mb-6 text-center">
//             Create Account ✨
//           </h1>

//           {error && (
//             <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm text-center">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-2 rounded mb-4 text-sm text-center">
//               {success}
//             </div>
//           )}

//           {/* NAME */}
//           <input
//             type="text"
//             placeholder="Full Name"
//             className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />

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
//               className="absolute right-3 top-3 text-slate-400 hover:text-emerald-400"
//             >
//               {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           {/* ROLE */}
//           <select
//             className="w-full p-3 mb-5 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="user">User</option>
//             <option value="admin">Admin</option>
//           </select>

//           {/* SIGNUP BUTTON */}
//           <button
//             disabled={loading}
//             className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold transition"
//           >
//             {loading ? "Creating..." : "Create Account"}
//           </button>

//           {/* LOGIN LINK */}
//           <p className="text-center text-slate-400 text-sm mt-6">
//             Already have an account?{" "}
//             <button
//               type="button"
//               onClick={() => navigate("/login")}
//               className="text-emerald-400 hover:underline"
//             >
//               Login
//             </button>
//           </p>

//         </form>

//       </div>
//     </DashboardBackground>
//   );
// }   

import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Shield,
} from "lucide-react";

import api from "../../../api/axios";


// ======================================================
// SIGNUP
// ======================================================

export default function Signup() {
  const navigate =
    useNavigate();

  const [form,
    setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "user",
    });

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const [success,
    setSuccess] =
    useState("");


  // ======================================================
  // INPUT
  // ======================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };


  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        await api.post(
          "/auth/signup/",
          form
        );

        setSuccess(
          "Account created successfully"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);

      } catch (err) {
        setError(
          err?.response?.data?.error ||
          "Signup failed"
        );
      } finally {
        setLoading(false);
      }
    };


  // ======================================================
  // GOOGLE AUTH
  // ======================================================

  const handleGoogleSignup =
    () => {
      window.location.href =
        "http://127.0.0.1:8000/auth/google/";
    };


  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        space-y-5
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
          Create Account
        </h2>

        <p className="
          text-slate-400
          mt-3
        ">
          Smart Parking System
        </p>
      </div>


      {/* ERROR */}
      {error && (
        <div className="
          bg-red-500/10
          border border-red-500/20
          text-red-400
          p-4
          rounded-2xl
          text-sm
        ">
          {error}
        </div>
      )}


      {/* SUCCESS */}
      {success && (
        <div className="
          bg-emerald-500/10
          border border-emerald-500/20
          text-emerald-400
          p-4
          rounded-2xl
          text-sm
        ">
          {success}
        </div>
      )}


      {/* NAME */}
      <div className="relative">
        <User
          size={18}
          className="
            absolute
            left-4 top-4
            text-slate-500
          "
        />

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="
            w-full
            pl-12 pr-4 py-4
            rounded-2xl
            bg-slate-800/70
            border border-white/10
            outline-none
          "
        />
      </div>


      {/* EMAIL */}
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
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="
            w-full
            pl-12 pr-4 py-4
            rounded-2xl
            bg-slate-800/70
            border border-white/10
          "
        />
      </div>


      {/* PASSWORD */}
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
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="
            w-full
            pl-12 pr-12 py-4
            rounded-2xl
            bg-slate-800/70
            border border-white/10
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
          "
        >
          {showPassword
            ? <EyeOff size={18} />
            : <Eye size={18} />}
        </button>
      </div>


      {/* ROLE CHOICE */}
      <div className="
        grid grid-cols-2 gap-4
      ">

        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              role: "user",
            })
          }
          className={`
            p-4 rounded-2xl border
            ${
              form.role === "user"
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-white/10"
            }
          `}
        >
          <User className="mx-auto mb-2" />
          User
        </button>

        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              role: "admin",
            })
          }
          className={`
            p-4 rounded-2xl border
            ${
              form.role === "admin"
                ? "border-blue-500 bg-blue-500/10"
                : "border-white/10"
            }
          `}
        >
          <Shield className="mx-auto mb-2" />
          Admin
        </button>

      </div>


      {/* SIGNUP */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full py-4
          rounded-2xl
          bg-gradient-to-r
          from-emerald-500
          to-blue-500
          font-semibold
        "
      >
        {loading
          ? "Creating..."
          : "Create Account"}
      </button>


      {/* GOOGLE */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        className="
          w-full py-4
          rounded-2xl
          border border-white/10
          bg-white/5
          hover:bg-white/10
          font-medium
        "
      >
        Continue with Google
      </button>


      {/* LOGIN */}
      <p className="
        text-center
        text-slate-400
      ">
        Already have an account?{" "}
        <Link
          to="/login"
          className="
            text-emerald-400
          "
        >
          Login
        </Link>
      </p>

    </form>
  );
}