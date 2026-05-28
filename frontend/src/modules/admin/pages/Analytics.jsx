import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  Activity,
  Car,
  IndianRupee,
  ParkingCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  TrendingUp,
  BarChart3,
} from "lucide-react";

import {
  useNotification,
} from "../../../context/NotificationContext";

import {
  useWebSocket,
} from "../../../context/WebSocketContext";

import StatCard from "../../../shared/ui/StatCard";
import EmptyState from "../../../shared/ui/EmptyState";
import Loader from "../../../shared/ui/Loader";

import api from "../../../api/axios";


// ======================================================
// ANALYTICS
// ======================================================

export default function Analytics() {
  const {
    connected,
  } = useWebSocket();

  const notification =
    useNotification();

  const [dashboardData,
    setDashboardData] =
    useState({
      total_revenue: 24500,
      total_bookings: 890,
      occupied_slots: 68,
      active_vehicles: 42,
    });

  const [loading,
    setLoading] =
    useState(true);

  const [pageError,
    setPageError] =
    useState("");

  const [range,
    setRange] =
    useState("weekly");


  // ======================================================
  // FETCH
  // ======================================================

  const fetchAnalytics =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await api.get(
            `/admin/analytics/?range=${range}`
          );

        setDashboardData(
          response.data?.dashboard ||
          dashboardData
        );

      } catch {
        notification?.error?.(
          "Analytics load failed"
        );

        setPageError("");

      } finally {
        setLoading(false);
      }
    }, [
      range,
      notification,
      dashboardData,
    ]);


  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);


  const totalRevenue =
    useMemo(() =>
      dashboardData.total_revenue || 0,
      [dashboardData]
    );


  if (loading)
    return <Loader />;

  if (pageError)
    return (
      <EmptyState
        title="Analytics Error"
        description={pageError}
      />
    );


  return (
    <div className="
      min-h-screen
      space-y-8
      pb-10
    ">

      {/* HERO */}
      <div className="
        rounded-3xl p-8
        bg-gradient-to-r
        from-blue-500/10
        via-emerald-500/10
        to-cyan-500/10
        border border-white/10
      ">
        <div className="
          flex flex-col xl:flex-row
          justify-between gap-6
        ">
          <div>
            <h1 className="
              text-5xl font-bold
            ">
              Analytics
            </h1>

            <p className="
              text-emerald-400
              text-2xl mt-2
            ">
              Smart Intelligence Center
            </p>
          </div>

          <div className="
            flex gap-4 flex-wrap
          ">
            <StatusCard
              connected={connected}
            />

            <button
              onClick={fetchAnalytics}
              className="
                px-5 py-4
                rounded-2xl
                bg-white/5
                border border-white/10
                flex items-center gap-2
              "
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <button
              className="
                px-5 py-4
                rounded-2xl
                bg-emerald-500
                text-black
                font-semibold
                flex items-center gap-2
              "
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>


      {/* RANGE */}
      <div className="flex justify-end">
        <select
          value={range}
          onChange={(e) =>
            setRange(
              e.target.value
            )
          }
          className="
            px-5 py-3
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
      </div>


      {/* STATS */}
      <div className="
        grid md:grid-cols-2
        xl:grid-cols-5 gap-6
      ">
        <StatCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          icon={<IndianRupee />}
          color="emerald"
        />

        <StatCard
          title="Bookings"
          value={dashboardData.total_bookings}
          icon={<Activity />}
          color="blue"
        />

        <StatCard
          title="Occupied"
          value={dashboardData.occupied_slots}
          icon={<ParkingCircle />}
          color="amber"
        />

        <StatCard
          title="Vehicles"
          value={dashboardData.active_vehicles}
          icon={<Car />}
          color="red"
        />

        <StatCard
          title="Growth"
          value="+18%"
          icon={<TrendingUp />}
          color="emerald"
        />
      </div>


      {/* CHART PLACEHOLDER */}
      <div className="
        grid xl:grid-cols-2 gap-6
      ">
        <ChartCard
          title="Revenue Analysis"
        />

        <ChartCard
          title="Occupancy Trends"
        />

        <ChartCard
          title="Booking Insights"
        />

        <ChartCard
          title="Slot Distribution"
        />
      </div>

    </div>
  );
}


// ======================================================
// STATUS CARD
// ======================================================

function StatusCard({
  connected,
}) {
  return (
    <div className={`
      px-5 py-4 rounded-2xl
      flex items-center gap-3
      ${
        connected
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }
    `}>
      {connected
        ? <Wifi />
        : <WifiOff />}
      {connected
        ? "Realtime"
        : "Offline"}
    </div>
  );
}


// ======================================================
// CHART CARD
// ======================================================

function ChartCard({
  title,
}) {
  return (
    <div className="
      rounded-3xl
      bg-slate-900/70
      border border-white/10
      p-8
      min-h-[320px]
      flex flex-col
      items-center
      justify-center
    ">
      <BarChart3
        size={48}
        className="
          text-emerald-400 mb-4
        "
      />

      <h3 className="
        text-xl font-semibold
      ">
        {title}
      </h3>

      <p className="
        text-slate-400 mt-3
      ">
        Live analytics visualization
      </p>
    </div>
  );
}