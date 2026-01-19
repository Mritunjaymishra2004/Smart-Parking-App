import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/common/Navbar";
import DashboardBackground from "../../components/common/DashboardBackground";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/my-bookings/")
      .then(res => setBookings(res.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <DashboardBackground>
        <div className="min-h-screen p-8 text-white">

          <h1 className="text-3xl font-bold mb-6">
            📄 My Parking Bookings
          </h1>

          {loading && <p className="text-slate-400">Loading bookings...</p>}

          {!loading && bookings.length === 0 && (
            <p className="text-slate-400">You have no bookings yet.</p>
          )}

          <div className="space-y-4 mt-4">
            {bookings.map(b => (
              <div
                key={b.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold">
                    Slot {b.slot.code}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      b.status === "ACTIVE"
                        ? "bg-green-600"
                        : b.status === "BOOKED"
                        ? "bg-yellow-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                  <div>
                    <p><b>Vehicle:</b> {b.vehicle.plate}</p>
                    <p><b>Price:</b> ₹{b.price}</p>
                  </div>

                  <div>
                    <p><b>From:</b> {formatTime(b.start_time)}</p>
                    <p><b>To:</b> {formatTime(b.end_time)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </DashboardBackground>
    </>
  );
}

function formatTime(time) {
  return new Date(time).toLocaleString();
}













