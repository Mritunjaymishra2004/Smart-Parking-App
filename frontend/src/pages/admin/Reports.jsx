import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout
from "../../components/common/DashboardLayout";

import Loader
from "../../components/ui/Loader";

import Button
from "../../components/ui/Button";

import SearchBar
from "../../components/ui/SearchBar";

import EmptyState
from "../../components/ui/EmptyState";

import StatCard
from "../../components/ui/StatCard";

import {

  getBookings,

  getPayments,

  getSlots,

} from "../../services/parkingService";

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

  FileText,

  DollarSign,

  Car,

  ParkingCircle,

} from "lucide-react";


// ======================================================
// REPORTS PAGE
// ======================================================

export default function Reports() {

  // ====================================================
  // STATE
  // ====================================================

  const [bookings,
    setBookings] =
    useState([]);

  const [payments,
    setPayments] =
    useState([]);

  const [slots,
    setSlots] =
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
    useState("monthly");


  // ====================================================
  // NOTIFICATIONS
  // ====================================================

  const {

    success,

    error: showError,

  } = useNotification();


  // ====================================================
  // FETCH REPORTS DATA
  // ====================================================

  const fetchReports =
    async () => {

      try {

        setPageError("");

        setLoading(true);

        const [

          bookingsData,

          paymentsData,

          slotsData,

        ] = await Promise.all([

          getBookings(),

          getPayments(),

          getSlots(),
        ]);

        setBookings(
          bookingsData
        );

        setPayments(
          paymentsData
        );

        setSlots(
          slotsData
        );

      } catch (err) {

        console.error(
          "Reports error:",
          err
        );

        setPageError(
          "Failed to load reports"
        );

        showError(
          "Reports loading failed"
        );

      } finally {

        setLoading(false);
      }
    };


  // ====================================================
  // LOAD
  // ====================================================

  useEffect(() => {

    fetchReports();

  }, [range]);


  // ====================================================
  // FILTER BOOKINGS
  // ====================================================

  const filteredBookings =
    useMemo(() => {

      return bookings.filter(
        (booking) =>

          booking.user
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [

      bookings,

      search,
    ]);


  // ====================================================
  // REPORT STATS
  // ====================================================

  const totalRevenue =
    payments.reduce(

      (sum, payment) =>

        payment.status ===
        "success"

          ? sum +
            Number(
              payment.amount || 0
            )

          : sum,

      0
    );

  const activeBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "active"
    ).length;

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "completed"
    ).length;

  const occupiedSlots =
    slots.filter(
      (slot) =>
        slot.status ===
        "occupied"
    ).length;


  // ====================================================
  // EXPORT CSV
  // ====================================================

  const handleExportCSV =
    () => {

      exportCSV(

        filteredBookings,

        "reports.csv"
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

        "Parking Reports",

        [

          "User",

          "Slot",

          "Vehicle",

          "Status",
        ],

        filteredBookings.map(
          (booking) => [

            booking.user,

            booking.slot,

            booking.vehicle,

            booking.status,
          ]
        ),

        "reports.pdf"
      );

      success(
        "PDF exported successfully"
      );
    };


  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate =
    (date) => {

      if (!date)
        return "-";

      return new Date(date)
        .toLocaleString();
    };


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
        gap-4
        mb-8
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-white
          ">
            Reports Center
          </h1>

          <p className="
            text-slate-400
            mt-1
          ">
            Generate and export
            parking system reports
          </p>

        </div>


        {/* ====================================== */}
        {/* EXPORT BUTTONS */}
        {/* ====================================== */}

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


      {/* ========================================== */}
      {/* FILTERS */}
      {/* ========================================== */}

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
          placeholder="
            Search reports...
          "
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


      {/* ========================================== */}
      {/* ERROR */}
      {/* ========================================== */}

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


      {/* ========================================== */}
      {/* LOADING */}
      {/* ========================================== */}

      {loading ? (

        <Loader />

      ) : (

        <>

          {/* ====================================== */}
          {/* STATS */}
          {/* ====================================== */}

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
              value={`₹ ${totalRevenue}`}
              color="text-emerald-400"
              icon={
                <DollarSign size={20} />
              }
            />

            <StatCard
              title="Active Bookings"
              value={activeBookings}
              color="text-blue-400"
              icon={
                <Car size={20} />
              }
            />

            <StatCard
              title="Completed"
              value={completedBookings}
              color="text-yellow-400"
              icon={
                <FileText size={20} />
              }
            />

            <StatCard
              title="Occupied Slots"
              value={occupiedSlots}
              color="text-red-400"
              icon={
                <ParkingCircle size={20} />
              }
            />

          </div>


          {/* ====================================== */}
          {/* TABLE */}
          {/* ====================================== */}

          {filteredBookings.length === 0 ? (

            <EmptyState

              title="No Reports Available"

              description="
                No booking reports found
              "

            />

          ) : (

            <div className="
              overflow-x-auto
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
            ">

              <table className="
                w-full
                text-left
                text-sm
              ">

                <thead className="
                  bg-slate-800
                  text-slate-300
                ">

                  <tr>

                    <th className="p-4">
                      User
                    </th>

                    <th className="p-4">
                      Slot
                    </th>

                    <th className="p-4">
                      Vehicle
                    </th>

                    <th className="p-4">
                      Start Time
                    </th>

                    <th className="p-4">
                      End Time
                    </th>

                    <th className="p-4">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredBookings.map(
                    (booking) => (

                      <tr
                        key={booking.id}
                        className="
                          border-t
                          border-slate-800
                          hover:bg-slate-800/40
                        "
                      >

                        <td className="
                          p-4
                          text-white
                        ">
                          {booking.user}
                        </td>

                        <td className="
                          p-4
                          text-slate-300
                        ">
                          {booking.slot}
                        </td>

                        <td className="
                          p-4
                          text-slate-300
                        ">
                          {booking.vehicle}
                        </td>

                        <td className="
                          p-4
                          text-slate-300
                        ">
                          {formatDate(
                            booking.start_time
                          )}
                        </td>

                        <td className="
                          p-4
                          text-slate-300
                        ">
                          {formatDate(
                            booking.end_time
                          )}
                        </td>

                        <td className="
                          p-4
                          capitalize
                          text-emerald-400
                        ">
                          {booking.status}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </>
      )}

    </DashboardLayout>
  );
}