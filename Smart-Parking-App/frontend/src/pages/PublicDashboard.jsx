
import { useNavigate } from "react-router-dom";
import DashboardBackground from "../components/common/DashboardBackground";

export default function PublicDashboard() {
  const navigate = useNavigate();

  return (
    <DashboardBackground>
      <div className="min-h-screen text-white flex flex-col">

        {/* HEADER */}
        <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold"> Smart Parking System</h1>
          <div className="space-x-3">
            <button
              onClick={() => navigate("/login")}
              className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Signup
            </button>
          </div>
        </header>

        {/* HERO */}
        <main className="flex-1 flex flex-col justify-center items-center text-center p-10">

          <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-2xl p-10 shadow-2xl max-w-4xl">

            <h2 className="text-4xl font-bold mb-4">
              Smart Parking Made Easy
            </h2>

            <p className="text-slate-300 mb-10">
              Book parking slots, navigate to your spot, pay online, and avoid violations with AI-powered Smart Parking.
            </p>

            {/* FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

              <div className="bg-slate-800 p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">Live Slots</h3>
                <p className="text-slate-400">
                  View real-time parking availability
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">Smart Navigation</h3>
                <p className="text-slate-400">
                  Get guided to your reserved slot
                </p>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl shadow">
                <h3 className="text-lg font-bold mb-2">Digital Payments</h3>
                <p className="text-slate-400">
                  Pay and exit without waiting
                </p>
              </div>

            </div>

            {/* CTA */}
            <button
              onClick={() => navigate("/login")}
              className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-xl text-black font-bold text-lg shadow-lg"
            >
              Book Parking Now
            </button>

          </div>
        </main>
      </div>
    </DashboardBackground>
  );
}