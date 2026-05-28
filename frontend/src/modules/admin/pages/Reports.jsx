import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  FileText,
  IndianRupee,
  Car,
  Download,
  RefreshCw,
  Search,
  Calendar,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

import Loader from "../../../shared/ui/Loader";
import EmptyState from "../../../shared/ui/EmptyState";
import StatCard from "../../../shared/ui/StatCard";

import {
  useNotification,
} from "../../../context/NotificationContext";

import api from "../../../api/axios";


// ======================================================
// REPORTS
// ======================================================

export default function Reports() {
  const {
    success,
    error: showError,
  } = useNotification();

  const [bookings,
    setBookings] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  const [range,
    setRange] =
    useState("monthly");


  const fetchReports =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            `/admin/reports/?range=${range}`
          );

        setBookings(
          response.data || []
        );

      } catch {
        showError?.(
          "Failed to load reports"
        );
      } finally {
        setLoading(false);
      }
    }, [range, showError]);


  useEffect(() => {
    fetchReports();
  }, [fetchReports]);


  const filteredBookings =
    useMemo(() => {
      return bookings.filter(
        (b) =>
          b.user
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [bookings, search]);


  const totalRevenue =
    filteredBookings.reduce(
      (sum, b) =>
        sum +
        Number(
          b.price || 0
        ),
      0
    );

  const completed =
    filteredBookings.filter(
      b =>
        b.status ===
        "completed"
    ).length;


  const exportReports =
    () =>
      success?.(
        "Reports exported"
      );


  if (loading)
    return <Loader />;


  return (
    <div className="
      min-h-screen
      space-y-8
      pb-10
    ">

      {/* HERO */}
      <div className="
        rounded-3xl
        p-8
        bg-gradient-to-r
        from-emerald-500/10
        via-blue-500/10
        to-cyan-500/10
        border border-white/10
      ">
        <h1 className="
          text-5xl font-bold
        ">
          Reports
        </h1>

        <p className="
          text-emerald-400
          text-2xl mt-2
        ">
          Revenue Intelligence Center
        </p>
      </div>


      {/* CONTROLS */}
      <div className="
        flex flex-col md:flex-row
        justify-between gap-4
      ">
        <div className="
          relative max-w-md w-full
        ">
          <Search
            size={18}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-slate-500
            "
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search reports..."
            className="
              w-full
              bg-slate-900
              border border-white/10
              rounded-2xl
              pl-12 pr-4 py-4
            "
          />
        </div>

        <div className="flex gap-3">
          <select
            value={range}
            onChange={(e) =>
              setRange(
                e.target.value
              )
            }
            className="
              px-5 py-4
              rounded-2xl
              bg-slate-900
              border border-white/10
            "
          >
            <option>today</option>
            <option>weekly</option>
            <option>monthly</option>
            <option>yearly</option>
          </select>

          <button
            onClick={fetchReports}
            className="
              p-4 rounded-2xl
              bg-white/5
            "
          >
            <RefreshCw />
          </button>

          <button
            onClick={exportReports}
            className="
              px-5 py-4
              rounded-2xl
              bg-emerald-500
              text-black
              flex items-center gap-2
            "
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>


      {/* STATS */}
      <div className="
        grid md:grid-cols-4 gap-6
      ">
        <StatCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          icon={<IndianRupee />}
          color="emerald"
        />

        <StatCard
          title="Bookings"
          value={filteredBookings.length}
          icon={<Car />}
          color="blue"
        />

        <StatCard
          title="Completed"
          value={completed}
          icon={<CheckCircle />}
          color="amber"
        />

        <StatCard
          title="Growth"
          value="+22%"
          icon={<TrendingUp />}
          color="red"
        />
      </div>


      {/* TABLE */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No Reports Found"
        />
      ) : (
        <div className="
          rounded-3xl
          bg-slate-900/70
          border border-white/10
          overflow-x-auto
        ">
          <table className="w-full">
            <thead className="
              bg-slate-800
            ">
              <tr>
                <th className="p-5">User</th>
                <th className="p-5">Slot</th>
                <th className="p-5">Vehicle</th>
                <th className="p-5">Date</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map(
                (booking) => (
                  <tr
                    key={booking.id}
                    className="
                      border-t border-white/10
                      hover:bg-white/5
                    "
                  >
                    <td className="p-5">
                      {booking.user}
                    </td>

                    <td className="p-5">
                      {booking.slot}
                    </td>

                    <td className="p-5">
                      {booking.vehicle}
                    </td>

                    <td className="p-5 flex items-center gap-2">
                      <Calendar size={15} />
                      {
                        new Date(
                          booking.start_time
                        ).toLocaleString()
                      }
                    </td>

                    <td className="p-5">
                      <span className="
                        px-3 py-1
                        rounded-full
                        bg-emerald-500/10
                        text-emerald-400
                      ">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}