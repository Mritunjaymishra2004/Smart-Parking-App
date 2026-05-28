import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout
from "../../components/common/DashboardLayout";

import Card
from "../../components/ui/Card";

import Button
from "../../components/ui/Button";

import ConfirmModal
from "../../components/ui/ConfirmModal";

import EmptyState
from "../../components/ui/EmptyState";

import SearchBar
from "../../components/ui/SearchBar";

import TableSkeleton
from "../../components/ui/TableSkeleton";

import {

  getBookings,

  cancelReservation,

} from "../../services/parkingService";

import {
  useNotification,
} from "../../context/NotificationContext";

import {
  useWebSocket,
} from "../../context/WebSocketContext";

import {

  Wifi,

  WifiOff,

} from "lucide-react";


// ======================================================
// BOOKINGS PANEL
// ======================================================

export default function BookingsPanel() {

  // ====================================================
  // REALTIME
  // ====================================================

  const {

    bookings: realtimeBookings,

    connected,

  } = useWebSocket();


  // ====================================================
  // STATE
  // ====================================================

  const [bookings,
    setBookings] =
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

  const [filterStatus,
    setFilterStatus] =
    useState("all");

  const [updatingId,
    setUpdatingId] =
    useState(null);

  const [showCancelModal,
    setShowCancelModal] =
    useState(false);

  const [selectedBooking,
    setSelectedBooking] =
    useState(null);


  // ====================================================
  // NOTIFICATIONS
  // ====================================================

  const {

    success,

    error: showError,

  } = useNotification();


  // ====================================================
  // FETCH BOOKINGS
  // ====================================================

  const fetchBookings =
    async () => {

      try {

        setPageError("");

        const data =
          await getBookings();

        setBookings(data);

      } catch (err) {

        console.error(
          "Bookings error:",
          err
        );

        setPageError(
          "Failed to load bookings"
        );

        showError(
          "Failed to load bookings"
        );

      } finally {

        setLoading(false);
      }
    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchBookings();

  }, []);


  // ====================================================
  // REALTIME SYNC
  // ====================================================

  useEffect(() => {

    if (

      realtimeBookings &&

      realtimeBookings.length > 0

    ) {

      setBookings(
        realtimeBookings
      );
    }

  }, [realtimeBookings]);


  // ====================================================
  // OPEN CANCEL MODAL
  // ====================================================

  const openCancelModal =
    (booking) => {

      setSelectedBooking(
        booking
      );

      setShowCancelModal(true);
    };


  // ====================================================
  // CANCEL BOOKING
  // ====================================================

  const handleCancelBooking =
    async () => {

      if (!selectedBooking)
        return;

      try {

        setUpdatingId(
          selectedBooking.id
        );

        await cancelReservation({

          booking_id:
            selectedBooking.id,
        });

        // ==========================================
        // OPTIMISTIC UPDATE
        // ==========================================

        setBookings((prev) =>

          prev.map((booking) =>

            booking.id ===
            selectedBooking.id

              ? {
                  ...booking,
                  status:
                    "cancelled",
                }

              : booking
          )
        );

        success(
          "Booking cancelled successfully"
        );

        setShowCancelModal(false);

      } catch (err) {

        console.error(
          "Cancel error:",
          err
        );

        showError(
          "Failed to cancel booking"
        );

      } finally {

        setUpdatingId(null);
      }
    };


  // ====================================================
  // FILTER BOOKINGS
  // ====================================================

  const filteredBookings =
    useMemo(() => {

      return bookings.filter(
        (booking) => {

          const query =
            search.toLowerCase();

          const matchesSearch =

            booking.user
              ?.toLowerCase()
              .includes(query)

            ||

            booking.vehicle
              ?.toLowerCase()
              .includes(query)

            ||

            booking.slot
              ?.toString()
              .toLowerCase()
              .includes(query);

          const matchesStatus =

            filterStatus ===
            "all"

              ? true

              : booking.status ===
                filterStatus;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [

      bookings,

      search,

      filterStatus,
    ]);


  // ====================================================
  // STATUS COLOR
  // ====================================================

  const getStatusColor =
    (status) => {

      switch (status) {

        case "active":

          return `
            bg-emerald-500/10
            text-emerald-400
          `;

        case "cancelled":

          return `
            bg-red-500/10
            text-red-400
          `;

        case "completed":

          return `
            bg-blue-500/10
            text-blue-400
          `;

        default:

          return `
            bg-slate-500/10
            text-slate-300
          `;
      }
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
  // STATS
  // ====================================================

  const totalBookings =
    bookings.length;

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

  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "cancelled"
    ).length;


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
              Bookings Panel
            </h1>


            {/* CONNECTION */}

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

              {connected

                ? <Wifi size={14} />

                : <WifiOff size={14} />
              }

              {connected

                ? "Realtime"

                : "Offline"
              }

            </div>

          </div>

          <p className="
            text-slate-400
            mt-2
          ">
            Live booking and reservation management
          </p>

        </div>

      </div>


      {/* ========================================== */}
      {/* STATS */}
      {/* ========================================== */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-5
        mb-8
      ">

        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Total Bookings
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-white
          ">
            {totalBookings}
          </h2>

        </Card>


        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Active
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-emerald-400
          ">
            {activeBookings}
          </h2>

        </Card>


        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Completed
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-blue-400
          ">
            {completedBookings}
          </h2>

        </Card>


        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Cancelled
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-red-400
          ">
            {cancelledBookings}
          </h2>

        </Card>

      </div>


      {/* ========================================== */}
      {/* FILTERS */}
      {/* ========================================== */}

      <div className="
        flex
        flex-col
        md:flex-row
        gap-4
        mb-6
      ">

        <SearchBar

          value={search}

          onChange={setSearch}

          placeholder="
            Search bookings...
          "

          className="md:w-96"

        />

        <select

          value={filterStatus}

          onChange={(e) =>
            setFilterStatus(
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

          <option value="all">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="cancelled">
            Cancelled
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
      {/* TABLE */}
      {/* ========================================== */}

      {loading ? (

        <TableSkeleton
          rows={6}
          columns={7}
        />

      ) : filteredBookings.length === 0 ? (

        <EmptyState

          title="No Bookings Found"

          description="
            No bookings match the current filters.
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
                  Start
                </th>

                <th className="p-4">
                  End
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Actions
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

                      transition-all
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
                    ">

                      <span className={`
                        px-3
                        py-1

                        rounded-full

                        text-xs
                        font-medium
                        capitalize

                        ${getStatusColor(
                          booking.status
                        )}
                      `}>

                        {booking.status}

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td className="
                      p-4
                    ">

                      {booking.status ===
                        "active" && (

                        <Button

                          onClick={() =>
                            openCancelModal(
                              booking
                            )
                          }

                          disabled={
                            updatingId ===
                            booking.id
                          }

                          className="
                            bg-red-600
                            hover:bg-red-700

                            text-xs

                            px-3
                            py-2
                          "
                        >

                          {updatingId ===
                          booking.id

                            ? "Cancelling..."

                            : "Cancel"
                          }

                        </Button>
                      )}

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}


      {/* ========================================== */}
      {/* CONFIRM MODAL */}
      {/* ========================================== */}

      <ConfirmModal

        open={showCancelModal}

        onClose={() =>
          setShowCancelModal(false)
        }

        onConfirm={
          handleCancelBooking
        }

        title="Cancel Booking"

        message={`
          Are you sure you want
          to cancel booking
          for ${selectedBooking?.user}?
        `}

        confirmText="Cancel Booking"

        loading={
          updatingId ===
          selectedBooking?.id
        }

        danger
      />

    </DashboardLayout>
  );
}