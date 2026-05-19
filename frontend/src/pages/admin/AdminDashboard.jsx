import {
  useEffect,
  useState,
  useCallback,
  lazy,
  Suspense,
  useMemo,
} from "react";

import {
  RefreshCcw,
  Wifi,
  WifiOff,
  Activity,
  TrendingUp,
  ParkingCircle,
  Car,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useWebSocket,
} from "../../websocket/WebSocketContext";

import {
  useNotification,
} from "../../context/NotificationContext";

import DashboardLayout
from "../../components/common/DashboardLayout";

import StatCard
from "../../components/ui/StatCard";

import Button
from "../../components/ui/Button";

import EmptyState
from "../../components/ui/EmptyState";

import ChartSkeleton
from "../../components/ui/ChartSkeleton";


// ======================================================
// CHARTS
// ======================================================

const RevenueChart = lazy(() =>
  import("../../components/charts/RevenueChart")
);

const BookingTrendChart = lazy(() =>
  import("../../components/charts/BookingTrendChart")
);

const OccupancyChart = lazy(() =>
  import("../../components/charts/OccupancyChart")
);

const SlotStatusPieChart = lazy(() =>
  import("../../components/charts/SlotStatusPieChart")
);


// ======================================================
// SERVICES
// ======================================================

import {
  getAdminStats,
} from "../../services/analyticsService";


// ======================================================
// PANEL
// ======================================================

function Panel({

  title,

  children,

  className = "",

  action,

}) {

  return (

    <div className={`
      bg-slate-900

      border
      border-slate-800

      rounded-2xl

      p-5

      shadow-lg

      w-full
      min-w-0

      overflow-hidden

      ${className}
    `}>

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      {title && (

        <div className="
          flex
          items-center
          justify-between

          mb-5
        ">

          <h2 className="
            text-lg
            font-semibold
            text-white
          ">

            {title}

          </h2>

          {action}

        </div>
      )}

      {/* ========================================== */}
      {/* CONTENT */}
      {/* ========================================== */}

      <div className="
        w-full
        min-w-0
        overflow-hidden
      ">

        {children}

      </div>

    </div>
  );
}


// ======================================================
// LOADING PANEL
// ======================================================

function LoadingPanel() {

  return (

    <div className="
      grid
      grid-cols-1
      xl:grid-cols-2
      gap-6
    ">

      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />

    </div>
  );
}


// ======================================================
// SAFE ARRAY
// ======================================================

const safeArray = (
  value
) => {

  return Array.isArray(value)

    ? value

    : [];
};


// ======================================================
// ADMIN DASHBOARD
// ======================================================

export default function AdminDashboard() {

  // ====================================================
  // AUTH
  // ====================================================

  const {

    user,

    loading: authLoading,

  } = useAuth();


  // ====================================================
  // WEBSOCKET
  // ====================================================

  const {

    connected,

    reconnecting,

    analytics = {},

    bookings = [],

    slots = [],

    notifications = [],

  } = useWebSocket();


  // ====================================================
  // NOTIFICATION
  // ====================================================

  const {

    error: showError,

  } = useNotification();


  // ====================================================
  // STATE
  // ====================================================

  const [stats,
    setStats] =
    useState({

      total_slots: 0,

      occupied_slots: 0,

      free_slots: 0,

      active_sessions: 0,

      total_revenue: 0,

      today_revenue: 0,
    });

  const [loadingStats,
    setLoadingStats] =
    useState(true);

  const [pageError,
    setPageError] =
    useState("");


  // ====================================================
  // LOAD STATS
  // ====================================================

  const loadStats =
    useCallback(async () => {

      try {

        setLoadingStats(true);

        setPageError("");

        const response =
          await getAdminStats();

        setStats({

          total_slots:
            response?.data?.total_slots || 0,

          occupied_slots:
            response?.data?.occupied_slots || 0,

          free_slots:
            response?.data?.free_slots || 0,

          active_sessions:
            response?.data?.active_sessions || 0,

          total_revenue:
            response?.data?.total_revenue || 0,

          today_revenue:
            response?.data?.today_revenue || 0,
        });

      } catch (error) {

        console.error(
          "Dashboard stats error:",
          error
        );

        setPageError(
          "Failed to load dashboard statistics"
        );

        showError(
          "Dashboard load failed"
        );

      } finally {

        setLoadingStats(false);
      }

    }, [showError]);


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    loadStats();

  }, [loadStats]);


  // ====================================================
  // REALTIME ANALYTICS
  // ====================================================

  useEffect(() => {

    if (
      analytics?.dashboard
    ) {

      setStats((prev) => ({

        ...prev,

        ...analytics.dashboard,
      }));
    }

  }, [analytics]);


  // ====================================================
  // OCCUPANCY %
  // ====================================================

  const occupancyPercent =
    useMemo(() => {

      if (!stats.total_slots) {

        return 0;
      }

      return Math.round(

        (
          stats.occupied_slots /

          stats.total_slots
        ) * 100
      );

    }, [

      stats.total_slots,

      stats.occupied_slots,
    ]);


  // ====================================================
  // SYSTEM HEALTH
  // ====================================================

  const systemHealth =
    useMemo(() => {

      if (reconnecting) {

        return "Reconnecting";
      }

      return connected

        ? "Healthy"

        : "Polling";

    }, [

      connected,

      reconnecting,
    ]);


  // ====================================================
  // REVENUE DATA
  // ====================================================

  const revenueData =
    useMemo(() => [

      {
        day: "Mon",
        revenue: 200,
      },

      {
        day: "Tue",
        revenue: 400,
      },

      {
        day: "Wed",
        revenue: 350,
      },

      {
        day: "Thu",
        revenue: 500,
      },

      {
        day: "Fri",
        revenue: 700,
      },

      {
        day: "Sat",
        revenue: 900,
      },

      {
        day: "Sun",
        revenue:
          stats.today_revenue || 0,
      },

    ], [

      stats.today_revenue,
    ]);


  // ====================================================
  // SLOT STATUS
  // ====================================================

  const slotStatusData =
    useMemo(() => [

      {
        name: "Occupied",
        value:
          stats.occupied_slots || 0,
      },

      {
        name: "Available",
        value:
          stats.free_slots || 0,
      },

    ], [

      stats.occupied_slots,

      stats.free_slots,
    ]);


  // ====================================================
  // BOOKING TREND
  // ====================================================

  const bookingTrendData =
    useMemo(() => {

      return safeArray(bookings);

    }, [bookings]);


  // ====================================================
  // OCCUPANCY DATA
  // ====================================================

  const occupancyData =
    useMemo(() => [

      {
        time: "Now",

        occupied:
          stats.occupied_slots,

        free:
          stats.free_slots,
      },

    ], [

      stats.occupied_slots,

      stats.free_slots,
    ]);


  // ====================================================
  // RECENT ACTIVITY
  // ====================================================

  const recentActivities =
    safeArray(
      notifications
    ).slice(0, 6);


  // ====================================================
  // AUTH LOADING
  // ====================================================

  if (authLoading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-950
        text-white
      ">

        Loading Dashboard...

      </div>
    );
  }


  // ====================================================
  // USER CHECK
  // ====================================================

  if (!user) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-950
        text-white
      ">

        Loading user...

      </div>
    );
  }


  // ====================================================
  // LOADING
  // ====================================================

  if (loadingStats) {

    return (

      <DashboardLayout>

        <LoadingPanel />

      </DashboardLayout>
    );
  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <DashboardLayout>

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="
        flex
        flex-col
        xl:flex-row

        xl:items-center
        xl:justify-between

        gap-5

        mb-8
      ">

        <div>

          <div className="
            flex
            items-center
            gap-3
          ">

            <h1 className="
              text-3xl
              font-bold
              text-white
            ">

              Admin Control Center

            </h1>

          </div>

        </div>

      </div>


      {/* ========================================== */}
      {/* STATS */}
      {/* ========================================== */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-6
        gap-5
        mb-8
      ">

        <StatCard
          title="Total Slots"
          value={stats.total_slots || 0}
          icon={<ParkingCircle size={20} />}
        />

      </div>


      {/* ========================================== */}
      {/* CHARTS */}
      {/* ========================================== */}

      <Suspense
        fallback={<LoadingPanel />}
      >

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mb-8

          w-full
          min-w-0
        ">

          <Panel title="Revenue Analytics">

            <RevenueChart
              data={revenueData}
            />

          </Panel>

          <Panel title="Booking Trends">

            <BookingTrendChart
              data={bookingTrendData}
            />

          </Panel>

          <Panel title="Occupancy">

            <OccupancyChart
              data={occupancyData}
            />

          </Panel>

          <Panel title="Slot Distribution">

            <SlotStatusPieChart
              data={slotStatusData}
            />

          </Panel>

        </div>

      </Suspense>

    </DashboardLayout>
  );
}