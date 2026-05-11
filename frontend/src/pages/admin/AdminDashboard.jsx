import {
  useEffect,
  useState,
  useCallback,
  lazy,
  Suspense,
  useMemo,
} from "react";

import { useAuth } from "../../context/AuthContext";

import { useWebSocket } from "../../websocket/WebSocketContext";

import DashboardLayout from "../../components/common/DashboardLayout";

import StatsCard from "../../components/dashboard/StatsCard";

// ======================================================
// LAZY COMPONENTS
// ======================================================

const SlotsPanel = lazy(() =>
  import("../../components/dashboard/SlotsPanel")
);

const VehiclesPanel = lazy(() =>
  import("../../components/dashboard/VehiclesPanel")
);

const LiveParkingMap = lazy(() =>
  import("../../components/map/LiveParkingMap")
);

const SlotManager = lazy(() =>
  import("../../components/admin/SlotManager")
);

const BookingManager = lazy(() =>
  import("../../components/admin/BookingManager")
);

const RevenueChart = lazy(() =>
  import("../../components/admin/RevenueChart")
);

const SlotHeatmap = lazy(() =>
  import("../../components/admin/SlotHeatmap")
);

const OccupancyRadar = lazy(() =>
  import("../../components/admin/OccupancyRadar")
);

const DevicePanel = lazy(() =>
  import("../../components/admin/DevicePanel")
);

const ViolationsPanel = lazy(() =>
  import("../../components/admin/ViolationsPanel")
);

const AdminSessionsPanel = lazy(() =>
  import("../../components/admin/AdminSessionsPanel")
);

const RevenuePanel = lazy(() =>
  import("../../components/admin/RevenuePanel")
);

import {
  getAdminStats,
} from "../../services/admin";

// ======================================================
// PANEL WRAPPER
// ======================================================

function Panel({
  title,
  children,
  className = "",
}) {

  return (

    <div className={`
      bg-slate-900
      border
      border-slate-800
      rounded-2xl
      p-4
      shadow-lg
      ${className}
    `}>

      {title && (

        <div className="
          flex
          items-center
          justify-between
          mb-4
        ">

          <h2 className="
            text-lg
            font-semibold
            text-white
          ">
            {title}
          </h2>

        </div>
      )}

      {children}

    </div>
  );
}

// ======================================================
// LOADING FALLBACK
// ======================================================

function LoadingPanel() {

  return (

    <div className="
      h-48
      rounded-2xl
      bg-slate-900
      border
      border-slate-800
      animate-pulse
    " />
  );
}

// ======================================================
// ADMIN DASHBOARD
// ======================================================

export default function AdminDashboard() {

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    lastMessage,
    connected,
  } = useWebSocket();

  // ====================================================
  // STATE
  // ====================================================

  const [stats, setStats] =
    useState({

      total_slots: 0,

      occupied_slots: 0,

      free_slots: 0,

      active_sessions: 0,

      total_revenue: 0,

      today_revenue: 0,
    });

  const [loadingStats, setLoadingStats] =
    useState(true);

  // ====================================================
  // AUTH GUARD
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
        Loading dashboard...
      </div>
    );
  }

  if (
    !user ||

    user.role !== "admin"
  ) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-950
        text-red-400
        text-xl
      ">
        Access Denied
      </div>
    );
  }

  // ====================================================
  // LOAD STATS
  // ====================================================

  const loadStats =
    useCallback(async () => {

      try {

        const response =
          await getAdminStats();

        setStats(
          response.data
        );

      } catch (error) {

        console.error(
          "Admin stats error",
          error
        );

      } finally {

        setLoadingStats(false);
      }

    }, []);

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    loadStats();

  }, [loadStats]);

  // ====================================================
  // LIVE WEBSOCKET UPDATES
  // ====================================================

  useEffect(() => {

    if (!lastMessage) return;

    // ================================================
    // ADMIN LIVE STATS
    // ================================================

    if (
      lastMessage.type ===
      "admin_stats_update"
    ) {

      setStats(
        lastMessage.stats
      );
    }

  }, [lastMessage]);

  // ====================================================
  // REVENUE DATA
  // ====================================================

  const revenueData =
    useMemo(() => [

      {
        day: "Mon",
        revenue:
          stats.today_revenue || 0,
      },

      {
        day: "Tue",
        revenue: 0,
      },

      {
        day: "Wed",
        revenue: 0,
      },

      {
        day: "Thu",
        revenue: 0,
      },

      {
        day: "Fri",
        revenue: 0,
      },

      {
        day: "Sat",
        revenue: 0,
      },

      {
        day: "Sun",
        revenue: 0,
      },

    ], [stats.today_revenue]);

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
        md:flex-row
        md:items-center
        md:justify-between
        mb-8
        gap-4
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-white
          ">
            Admin Control Center
          </h1>

          <p className="
            text-slate-400
            mt-1
          ">
            Monitor and optimize
            the Smart Parking platform
          </p>

        </div>

        {/* ====================================== */}
        {/* SYSTEM STATUS */}
        {/* ====================================== */}

        <div className="
          flex
          items-center
          gap-2
          bg-slate-900
          border
          border-slate-800
          px-4
          py-2
          rounded-xl
        ">

          <div className={`
            w-3
            h-3
            rounded-full
            ${connected
              ? "bg-emerald-500"
              : "bg-red-500"
            }
          `} />

          <span className="
            text-sm
            text-slate-300
          ">
            {connected
              ? "Live Connected"
              : "Disconnected"
            }
          </span>

        </div>

      </div>

      {/* ========================================== */}
      {/* KPI CARDS */}
      {/* ========================================== */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-6
        gap-4
        mb-8
      ">

        <StatsCard
          title="Total Slots"
          value={stats.total_slots}
          loading={loadingStats}
        />

        <StatsCard
          title="Occupied"
          value={stats.occupied_slots}
          loading={loadingStats}
        />

        <StatsCard
          title="Free"
          value={stats.free_slots}
          loading={loadingStats}
        />

        <StatsCard
          title="Active Vehicles"
          value={stats.active_sessions}
          loading={loadingStats}
        />

        <StatsCard
          title="Today Revenue"
          value={`₹${stats.today_revenue}`}
          loading={loadingStats}
        />

        <StatsCard
          title="Total Revenue"
          value={`₹${stats.total_revenue}`}
          loading={loadingStats}
        />

      </div>

      {/* ========================================== */}
      {/* MAIN GRID */}
      {/* ========================================== */}

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
      ">

        <Suspense fallback={<LoadingPanel />}>

          <Panel title="Slot Management">
            <SlotManager />
          </Panel>

        </Suspense>

        <Suspense fallback={<LoadingPanel />}>

          <Panel title="Live Vehicles">
            <VehiclesPanel />
          </Panel>

        </Suspense>

        <Suspense fallback={<LoadingPanel />}>

          <Panel
            title="Bookings"
            className="xl:col-span-2"
          >
            <BookingManager />
          </Panel>

        </Suspense>

        <Suspense fallback={<LoadingPanel />}>

          <div className="xl:col-span-2">

            <RevenueChart
              data={revenueData}
            />

          </div>

        </Suspense>

        <Suspense fallback={<LoadingPanel />}>

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-6
            xl:col-span-2
          ">

            <SlotHeatmap />

            <OccupancyRadar />

          </div>

        </Suspense>

        <Suspense fallback={<LoadingPanel />}>

          <Panel
            title="Live Parking Map"
            className="
              xl:col-span-2
              overflow-hidden
              min-h-[600px]
            "
          >

            <LiveParkingMap />

          </Panel>

        </Suspense>

        <Suspense fallback={<LoadingPanel />}>

          <div className="xl:col-span-2">
            <DevicePanel />
          </div>

        </Suspense>

        <Suspense fallback={<LoadingPanel />}>

          <div className="xl:col-span-2">
            <ViolationsPanel />
          </div>

        </Suspense>

        <Suspense fallback={<LoadingPanel />}>

          <div className="xl:col-span-2">
            <AdminSessionsPanel />
          </div>

        </Suspense>

        <Suspense fallback={<LoadingPanel />}>

          <div className="xl:col-span-2">
            <RevenuePanel />
          </div>

        </Suspense>

      </div>

    </DashboardLayout>
  );
}


















// import { useWebSocket } from "../../websocket/WebSocketContext";
// import { useEffect, useState, useCallback } from "react";
// import { useAuth } from "../../context/AuthContext";
// import DashboardLayout from "../../components/common/DashboardLayout";

// import StatsCard from "../../components/dashboard/StatsCard";
// import SlotsPanel from "../../components/dashboard/SlotsPanel";
// import VehiclesPanel from "../../components/dashboard/VehiclesPanel";
// import LiveParkingMap from "../../components/map/LiveParkingMap";

// import SlotManager from "../../components/admin/SlotManager";
// import BookingManager from "../../components/admin/BookingManager";
// import RevenueChart from "../../components/admin/RevenueChart";
// import SlotHeatmap from "../../components/admin/SlotHeatmap";
// import OccupancyRadar from "../../components/admin/OccupancyRadar";
// import DevicePanel from "../../components/admin/DevicePanel";
// import ViolationsPanel from "../../components/admin/ViolationsPanel";
// import AdminSessionsPanel from "../../components/admin/AdminSessionsPanel";
// import RevenuePanel from "../../components/admin/RevenuePanel";

// import { getAdminStats } from "../../services/admin";

// export default function AdminDashboard() {
//   const { user, loading: authLoading } = useAuth();

//   const [stats, setStats] = useState({
//     total_slots: 0,
//     occupied_slots: 0,
//     free_slots: 0,
//     active_sessions: 0,
//     total_revenue: 0,
//     today_revenue: 0,
//   });
  
//   const { lastMessage } = useWebSocket();

//   const [loadingStats, setLoadingStats] = useState(true);

//   // ===============================
//   // 🔐 ADMIN GUARD (IMPROVED)
//   // ===============================
//   if (authLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white">
//         Loading dashboard...
//       </div>
//     );
//   }

//   if (!user || user.role !== "admin") {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">
//         Access Denied
//       </div>
//     );
//   }

//   // ===============================
//   // 📊 LOAD STATS (OPTIMIZED)
//   // ===============================
//   const loadStats = useCallback(async () => {
//     try {
//       const res = await getAdminStats();
//       setStats(res.data);
//     } catch (err) {
//       console.error("Admin stats error", err);
//     } finally {
//       setLoadingStats(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadStats();

//     const timer = setInterval(loadStats, 10000); // ✅ reduced load
//     return () => clearInterval(timer);
//   }, [loadStats]);

//   // ===============================
//   // 📊 MOCK DATA (can replace later)
//   // ===============================
//   const revenueData = [
//     { day: "Mon", revenue: stats.today_revenue || 0 },
//     { day: "Tue", revenue: 0 },
//     { day: "Wed", revenue: 0 },
//     { day: "Thu", revenue: 0 },
//     { day: "Fri", revenue: 0 },
//     { day: "Sat", revenue: 0 },
//     { day: "Sun", revenue: 0 },
//   ];

//   return (
//     <DashboardLayout>
//       {/* HEADER */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-white">
//           Admin Control Center
//         </h1>
//         <p className="text-slate-400 text-sm">
//           Monitor, manage and optimize the Smart Parking platform
//         </p>
//       </div>

//       {/* KPI CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
//         <StatsCard title="Total Slots" value={stats.total_slots} loading={loadingStats} />
//         <StatsCard title="Occupied" value={stats.occupied_slots} loading={loadingStats} />
//         <StatsCard title="Free" value={stats.free_slots} loading={loadingStats} />
//         <StatsCard title="Active Vehicles" value={stats.active_sessions} loading={loadingStats} />
//         <StatsCard title="Today Revenue" value={`₹${stats.today_revenue}`} loading={loadingStats} />
//         <StatsCard title="Total Revenue" value={`₹${stats.total_revenue}`} loading={loadingStats} />
//       </div>

//       {/* MAIN PANELS */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//         {/* SLOT MANAGER */}
//         <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
//           <h2 className="text-lg font-semibold mb-3">Slot Management</h2>
//           <SlotManager />
//         </div>

//         {/* LIVE VEHICLES */}
//         <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
//           <h2 className="text-lg font-semibold mb-3">Live Vehicles</h2>
//           <VehiclesPanel />
//         </div>

//         {/* BOOKINGS */}
//         <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 xl:col-span-2">
//           <h2 className="text-lg font-semibold mb-3">Bookings</h2>
//           <BookingManager />
//         </div>

//         {/* REVENUE CHART */}
//         <div className="xl:col-span-2">
//           <RevenueChart data={revenueData} />
//         </div>

//         {/* ANALYTICS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:col-span-2">
//           <SlotHeatmap />
//           <OccupancyRadar />
//         </div>

//         {/* LIVE MAP */}
//         <div className="bg-slate-900 border border-slate-800 rounded-xl xl:col-span-2 flex flex-col overflow-hidden">
//           <div className="px-4 py-3 border-b border-slate-800">
//             <h2 className="text-lg font-semibold">Live Parking Map</h2>
//           </div>

//           <div className="flex-1 relative">
//             <LiveParkingMap />
//           </div>
//         </div>

//         {/* DEVICES */}
//         <div className="xl:col-span-2">
//           <DevicePanel />
//         </div>

//         {/* VIOLATIONS */}
//         <div className="xl:col-span-2">
//           <ViolationsPanel />
//         </div>

//         {/* SESSIONS */}
//         <div className="xl:col-span-2">
//           <AdminSessionsPanel />
//         </div>

//         {/* REVENUE PANEL */}
//         <div className="xl:col-span-2">
//           <RevenuePanel />
//         </div>

//       </div>
//     </DashboardLayout>
//   );
// }