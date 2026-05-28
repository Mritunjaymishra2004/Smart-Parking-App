import {
  useEffect,
  useState,
  useCallback,
  lazy,
  Suspense,
  useMemo,
} from "react";

import {
  Wifi,
  WifiOff,
  TrendingUp,
  ParkingCircle,
  Car,
  IndianRupee,
  ShieldCheck,
  Activity,
  RefreshCw,
  Users,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useWebSocket } from "../../../context/WebSocketContext";
import { useNotification } from "../../../context/NotificationContext";

import StatCard from "../../../shared/ui/StatCard";
import EmptyState from "../../../shared/ui/EmptyState";
import Loader from "../../../shared/ui/Loader";
import ChartSkeleton from "../../../shared/ui/ChartSkeleton";

import api from "../../../api/axios";

const RevenueChart = lazy(() =>
  import("../../../modules/analytics/components/RevenueChart")
);

const BookingTrendChart = lazy(() =>
  import("../../../modules/analytics/components/BookingTrendChart")
);

const OccupancyChart = lazy(() =>
  import("../../../modules/analytics/components/OccupancyChart")
);

const SlotStatusPieChart = lazy(() =>
  import("../../../modules/analytics/components/SlotStatusPieChart")
);


// ======================================================
// DEMO DATA
// ======================================================

const revenueData = [
  { day: "Mon", revenue: 3000 },
  { day: "Tue", revenue: 4200 },
  { day: "Wed", revenue: 3800 },
  { day: "Thu", revenue: 5000 },
  { day: "Fri", revenue: 6200 },
];

const bookingData = [
  { day: "Mon", bookings: 45 },
  { day: "Tue", bookings: 62 },
  { day: "Wed", bookings: 50 },
  { day: "Thu", bookings: 72 },
  { day: "Fri", bookings: 90 },
];

const occupancyData = [
  { name: "Zone A", occupied: 22, free: 8 },
  { name: "Zone B", occupied: 18, free: 12 },
  { name: "Zone C", occupied: 28, free: 5 },
];

const slotStatusData = [
  { name: "Occupied", value: 68 },
  { name: "Free", value: 42 },
  { name: "Reserved", value: 8 },
  { name: "Maintenance", value: 2 },
];


// ======================================================
// PANEL
// ======================================================

function Panel({
  title,
  children,
}) {
  return (
    <div
      className="
        rounded-3xl
        bg-slate-900/70
        backdrop-blur-xl
        border
        border-white/10
        p-6
        shadow-xl
        min-h-[460px]
      "
    >
      <h2 className="text-xl font-semibold text-white mb-6">
        {title}
      </h2>

      <div className="h-[350px] w-full min-w-0">
        {children}
      </div>
    </div>
  );
}


// ======================================================
// STATUS CARD
// ======================================================

function StatusCard({
  icon,
  label,
  active,
}) {
  return (
    <div
      className={`px-5 py-4 rounded-2xl flex items-center gap-3 border ${
        active
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          : "bg-red-500/10 border-red-500/20 text-red-400"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}


// ======================================================
// MAIN
// ======================================================

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { connected } = useWebSocket();
  const notification = useNotification();

  const [stats, setStats] = useState({
    total_slots: 120,
    occupied_slots: 68,
    free_slots: 52,
    total_revenue: 24500,
    today_revenue: 4200,
    users: 95,
  });

  const [pageLoading, setPageLoading] =
    useState(true);

  const loadStats = useCallback(async () => {
    try {
      setPageLoading(true);

      const res = await api.get("/admin/stats/");

      if (res?.data) {
        setStats(res.data);
      }
    } catch {
      notification?.error?.(
        "Using demo analytics data"
      );
    } finally {
      setPageLoading(false);
    }
  }, [notification]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const occupancyPercent = useMemo(() => {
    return Math.round(
      (stats.occupied_slots /
        stats.total_slots) *
        100
    );
  }, [stats]);

  if (loading || pageLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <EmptyState
        title="Authentication Required"
      />
    );
  }

  return (
    <div className="min-h-screen space-y-8 pb-10">

      {/* HERO */}
      <div className="rounded-3xl p-8 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-cyan-500/10 border border-white/10">

        <div className="flex flex-col xl:flex-row justify-between gap-6">

          <div>
            <h1 className="text-5xl font-bold text-white">
              Smart Parking
            </h1>

            <p className="text-emerald-400 text-2xl mt-2">
              Admin Control Center
            </p>
          </div>

          <div className="flex flex-wrap gap-4">

            <StatusCard
              icon={<Activity />}
              label="System Active"
              active
            />

            <StatusCard
              icon={
                connected
                  ? <Wifi />
                  : <WifiOff />
              }
              label={
                connected
                  ? "Live Connected"
                  : "Offline"
              }
              active={connected}
            />

            <button
              onClick={loadStats}
              className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

          </div>
        </div>
      </div>


      {/* STATS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-6 gap-6">

        <StatCard
          title="Total Slots"
          value={stats.total_slots}
          icon={<ParkingCircle />}
          color="blue"
        />

        <StatCard
          title="Occupied"
          value={stats.occupied_slots}
          icon={<Car />}
          color="emerald"
        />

        <StatCard
          title="Revenue"
          value={`₹${stats.total_revenue}`}
          icon={<IndianRupee />}
          color="amber"
        />

        <StatCard
          title="Occupancy"
          value={`${occupancyPercent}%`}
          icon={<TrendingUp />}
          color="emerald"
        />

        <StatCard
          title="Users"
          value={stats.users}
          icon={<Users />}
          color="blue"
        />

        <StatCard
          title="Security"
          value="Secure"
          icon={<ShieldCheck />}
          color="red"
        />

      </div>


      {/* CHARTS */}
      <Suspense fallback={<ChartSkeleton />}>

        <div className="grid xl:grid-cols-2 gap-6">

          <Panel title="Revenue Analytics">
            <RevenueChart data={revenueData} />
          </Panel>

          <Panel title="Booking Trends">
            <BookingTrendChart data={bookingData} />
          </Panel>

          <Panel title="Occupancy Analysis">
            <OccupancyChart data={occupancyData} />
          </Panel>

          <Panel title="Slot Distribution">
            <SlotStatusPieChart data={slotStatusData} />
          </Panel>

        </div>

      </Suspense>

    </div>
  );
}