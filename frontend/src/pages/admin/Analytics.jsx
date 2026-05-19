import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout
  from "../../components/common/DashboardLayout";

import Button
  from "../../components/ui/Button";

import SearchBar
  from "../../components/ui/SearchBar";

import StatCard
  from "../../components/ui/StatCard";

import EmptyState
  from "../../components/ui/EmptyState";

import ChartSkeleton
  from "../../components/ui/ChartSkeleton";

import RevenueChart
  from "../../components/charts/RevenueChart";

import OccupancyChart
  from "../../components/charts/OccupancyChart";

import BookingTrendChart
  from "../../components/charts/BookingTrendChart";

import SlotStatusPieChart
  from "../../components/charts/SlotStatusPieChart";

import {

  getDashboardAnalytics,

  getRevenueAnalytics,

  getOccupancyAnalytics,

  getBookingTrends,

  getSlotStatusAnalytics,

} from "../../services/analyticsService";

import {
  exportCSV,
} from "../../utils/exportCSV";

import {
  exportPDF,
} from "../../utils/exportPDF";

import {
  useNotification,
} from "../../context/NotificationContext";

import {
  useWebSocket,
} from "../../websocket/WebSocketContext";

import {

  Activity,

  Car,

  DollarSign,

  ParkingCircle,

  Wifi,

  WifiOff,

} from "lucide-react";


// ======================================================
// SAFE ARRAY
// ======================================================

const safeArray = (
  value
) => {

  if (
    Array.isArray(value)
  ) {

    return value;
  }

  if (
    Array.isArray(
      value?.data
    )
  ) {

    return value.data;
  }

  if (
    Array.isArray(
      value?.results
    )
  ) {

    return value.results;
  }

  return [];
};


// ======================================================
// ANALYTICS
// ======================================================

export default function Analytics() {

  // ====================================================
  // REALTIME
  // ====================================================

  const {

    analytics = {},

    connected,

  } = useWebSocket();


  // ====================================================
  // STATE
  // ====================================================

  const [dashboardData,
    setDashboardData] =
    useState({});

  const [revenueData,
    setRevenueData] =
    useState([]);

  const [occupancyData,
    setOccupancyData] =
    useState([]);

  const [bookingData,
    setBookingData] =
    useState([]);

  const [slotStatusData,
    setSlotStatusData] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [pageError,
    setPageError] =
    useState("");

  const [search,
    setSearch] =
    useState("");

  const [range,
    setRange] =
    useState("weekly");


  // ====================================================
  // NOTIFICATIONS
  // ====================================================

  const {

    success,

    error: showError,

  } = useNotification();


  // ====================================================
  // FETCH
  // ====================================================

  const fetchAnalytics =
    async () => {

      try {

        setLoading(true);

        setPageError("");

        const [

          dashboard,

          revenue,

          occupancy,

          bookings,

          slotStatus,

        ] = await Promise.all([

          getDashboardAnalytics({
            range,
          }),

          getRevenueAnalytics({
            range,
          }),

          getOccupancyAnalytics({
            range,
          }),

          getBookingTrends({
            range,
          }),

          getSlotStatusAnalytics({
            range,
          }),
        ]);


        // ==========================================
        // DASHBOARD
        // ==========================================

        setDashboardData(

          dashboard?.data ||

          {}
        );


        // ==========================================
        // SAFE ARRAYS
        // ==========================================

        setRevenueData(
          safeArray(
            revenue?.data
          )
        );

        setOccupancyData(
          safeArray(
            occupancy?.data
          )
        );

        setBookingData(
          safeArray(
            bookings?.data
          )
        );

        setSlotStatusData(
          safeArray(
            slotStatus?.data
          )
        );

      } catch (error) {

        console.error(
          "Analytics error:",
          error
        );

        setPageError(
          "Failed to load analytics"
        );

        showError(
          "Analytics load failed"
        );

      } finally {

        setLoading(false);
      }
    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchAnalytics();

  }, [range]);


  // ====================================================
  // REALTIME SYNC
  // ====================================================

  useEffect(() => {

    if (!analytics) {

      return;
    }

    if (
      analytics.dashboard
    ) {

      setDashboardData(
        analytics.dashboard
      );
    }

    if (
      analytics.revenue
    ) {

      setRevenueData(
        safeArray(
          analytics.revenue
        )
      );
    }

    if (
      analytics.occupancy
    ) {

      setOccupancyData(
        safeArray(
          analytics.occupancy
        )
      );
    }

    if (
      analytics.bookings
    ) {

      setBookingData(
        safeArray(
          analytics.bookings
        )
      );
    }

    if (
      analytics.slotStatus
    ) {

      setSlotStatusData(
        safeArray(
          analytics.slotStatus
        )
      );
    }

  }, [analytics]);


  // ====================================================
  // FILTERED REVENUE
  // ====================================================

  const filteredRevenue =
    useMemo(() => {

      return safeArray(
        revenueData
      ).filter((item) =>

        item?.day
          ?.toLowerCase()
          ?.includes(
            search.toLowerCase()
          )
      );

    }, [

      revenueData,

      search,
    ]);


  // ====================================================
  // EXPORT CSV
  // ====================================================

  const handleExportCSV =
    () => {

      exportCSV(

        filteredRevenue,

        "analytics-report.csv"
      );

      success(
        "CSV exported successfully"
      );
    };


  // ====================================================
  // EXPORT PDF
  // ====================================================

  const handleExportPDF =
    () => {

      exportPDF(

        "Analytics Report",

        [
          "Day",
          "Revenue",
        ],

        filteredRevenue.map(
          (item) => [

            item?.day ||

            "N/A",

            item?.revenue ||

            0,
          ]
        ),

        "analytics-report.pdf"
      );

      success(
        "PDF exported successfully"
      );
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <DashboardLayout>

      {/* HEADER */}

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

              Analytics Center

            </h1>

            <div className={`
              flex
              items-center
              gap-2
              px-3
              py-1
              rounded-full
              text-xs
              font-medium

              ${
                connected

                  ? `
                    bg-emerald-500/10
                    text-emerald-400
                  `

                  : `
                    bg-red-500/10
                    text-red-400
                  `
              }
            `}>

              {
                connected

                  ? <Wifi size={14} />

                  : <WifiOff size={14} />
              }

              {
                connected

                  ? "Realtime"

                  : "Offline"
              }

            </div>

          </div>

          <p className="
            text-slate-400
            mt-2
          ">

            Live analytics and realtime parking insights

          </p>

        </div>

        <div className="
          flex
          flex-wrap
          gap-3
        ">

          <Button
            onClick={
              handleExportCSV
            }
            className="
              bg-blue-600
              hover:bg-blue-700
            "
          >

            Export CSV

          </Button>

          <Button
            onClick={
              handleExportPDF
            }
            className="
              bg-red-600
              hover:bg-red-700
            "
          >

            Export PDF

          </Button>

        </div>

      </div>


      {/* FILTERS */}

      <div className="
        flex
        flex-col
        md:flex-row
        gap-4
        mb-8
      ">

        <SearchBar

          value={search}

          onChange={setSearch}

          placeholder="Search analytics..."

          className="md:w-96"

        />

        <select

          value={range}

          onChange={(e) =>
            setRange(
              e.target.value
            )
          }

          className="
            bg-slate-900
            border
            border-slate-700
            text-white
            px-4
            py-3
            rounded-xl
            outline-none
          "
        >

          <option value="today">
            Today
          </option>

          <option value="weekly">
            Weekly
          </option>

          <option value="monthly">
            Monthly
          </option>

          <option value="yearly">
            Yearly
          </option>

        </select>

      </div>


      {/* ERROR */}

      {pageError && (

        <div className="
          bg-red-500/10
          border
          border-red-500/20
          text-red-400
          px-4
          py-3
          rounded-xl
          mb-6
        ">

          {pageError}

        </div>
      )}


      {/* STATS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-5
        mb-8
      ">

        <StatCard

          title="Total Revenue"

          value={`₹ ${dashboardData?.total_revenue || 0}`}

          color="text-emerald-400"

          icon={
            <DollarSign size={20} />
          }

        />

        <StatCard

          title="Total Bookings"

          value={
            dashboardData?.total_bookings || 0
          }

          color="text-blue-400"

          icon={
            <Activity size={20} />
          }

        />

        <StatCard

          title="Occupied Slots"

          value={
            dashboardData?.occupied_slots || 0
          }

          color="text-red-400"

          icon={
            <ParkingCircle size={20} />
          }

        />

        <StatCard

          title="Active Vehicles"

          value={
            dashboardData?.active_vehicles || 0
          }

          color="text-yellow-400"

          icon={
            <Car size={20} />
          }

        />

      </div>


      {/* CHARTS */}

      {loading ? (

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

      ) : filteredRevenue.length === 0 ? (

        <EmptyState

          title="No Analytics Data"

          description="
            Analytics data not available
          "

        />

      ) : (

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        ">

          <RevenueChart
            data={filteredRevenue}
          />

          <OccupancyChart
            data={occupancyData}
          />

          <BookingTrendChart
            data={bookingData}
          />

          <SlotStatusPieChart
            data={slotStatusData}
          />

        </div>
      )}

    </DashboardLayout>
  );
}