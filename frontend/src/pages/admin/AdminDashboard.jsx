import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/common/DashboardLayout";

import StatsCard from "../../components/dashboard/StatsCard";
import SlotsPanel from "../../components/dashboard/SlotsPanel";
import VehiclesPanel from "../../components/dashboard/VehiclesPanel";
import LiveParkingMap from "../../components/map/LiveParkingMap";

import SlotManager from "../../components/admin/SlotManager";
import BookingManager from "../../components/admin/BookingManager";
import RevenueChart from "../../components/admin/RevenueChart";
import SlotHeatmap from "../../components/admin/SlotHeatmap";
import OccupancyRadar from "../../components/admin/OccupancyRadar";
import DevicePanel from "../../components/admin/DevicePanel";
import ViolationsPanel from "../../components/admin/ViolationsPanel";
import AdminSessionsPanel from "../../components/admin/AdminSessionsPanel";
import RevenuePanel from "../../components/admin/RevenuePanel";

import { getAdminStats } from "../../services/admin";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total_slots: 0,
    occupied_slots: 0,
    free_slots: 0,
    active_sessions: 0,
    total_revenue: 0,
    today_revenue: 0,
  });

  // 🔐 Admin Guard
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">
        Access Denied
      </div>
    );
  }

  // 📡 Load KPI stats
  const loadStats = async () => {
    try {
      const res = await getAdminStats();
      setStats(res.data);
    } catch (err) {
      console.error("Admin stats error", err);
    }
  };

  useEffect(() => {
    loadStats();
    const timer = setInterval(loadStats, 5000);
    return () => clearInterval(timer);
  }, []);

  const revenueData = [
    { day: "Mon", revenue: 1200 },
    { day: "Tue", revenue: 1800 },
    { day: "Wed", revenue: 1500 },
    { day: "Thu", revenue: 2300 },
    { day: "Fri", revenue: 2800 },
    { day: "Sat", revenue: 3200 },
    { day: "Sun", revenue: 2900 },
  ];

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Admin Control Center
        </h1>
        <p className="text-slate-400 text-sm">
          Monitor, manage and optimize the Smart Parking platform
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
        <StatsCard title="Total Slots" value={stats.total_slots} />
        <StatsCard title="Occupied" value={stats.occupied_slots} />
        <StatsCard title="Free" value={stats.free_slots} />
        <StatsCard title="Active Vehicles" value={stats.active_sessions} />
        <StatsCard title="Today Revenue" value={`₹${stats.today_revenue}`} />
        <StatsCard title="Total Revenue" value={`₹${stats.total_revenue}`} />
      </div>

      {/* MAIN PANELS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Slot Management</h2>
          <SlotManager />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Live Vehicles</h2>
          <VehiclesPanel />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 xl:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Bookings</h2>
          <BookingManager />
        </div>

        <div className="xl:col-span-2">
          <RevenueChart data={revenueData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:col-span-2">
          <SlotHeatmap />
          <OccupancyRadar />
        </div>

        {/* 🚀 LIVE MAP — FIXED */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl xl:col-span-2 flex flex-col overflow-hidden">
  
          <div className="px-4 py-3 border-b border-slate-800">
            <h2 className="text-lg font-semibold">Live Parking Map</h2>
          </div>

          <div className="flex-1 relative">
            <LiveParkingMap />
          </div>

        </div>

        {/* <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 xl:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Live Parking Map</h2>
          <LiveParkingMap />
        </div> */}

        <div className="xl:col-span-2">
          <DevicePanel />
        </div>

        <div className="xl:col-span-2">
          <ViolationsPanel />
        </div>

        <div className="xl:col-span-2">
          <AdminSessionsPanel />
        </div>

        <div className="xl:col-span-2">
          <RevenuePanel />
        </div>

      </div>
    </DashboardLayout>
  );
}
