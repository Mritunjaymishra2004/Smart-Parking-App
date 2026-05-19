import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout
from "../../components/common/DashboardLayout";

import Card
from "../../components/ui/Card";

import Loader
from "../../components/ui/Loader";

import Button
from "../../components/ui/Button";

import SearchBar
from "../../components/ui/SearchBar";

import EmptyState
from "../../components/ui/EmptyState";

import ConfirmModal
from "../../components/ui/ConfirmModal";

import TableSkeleton
from "../../components/ui/TableSkeleton";

import {

  getSlots,

} from "../../services/parkingService";

import api
from "../../api/axios";

import {
  useNotification,
} from "../../context/NotificationContext";

import {
  useWebSocket,
} from "../../websocket/WebSocketContext";

import {

  Wifi,

  WifiOff,

} from "lucide-react";


// ======================================================
// SLOT MANAGER
// ======================================================

export default function SlotManager() {

  // ====================================================
  // REALTIME
  // ====================================================

  const {

    slots: realtimeSlots,

    connected,

  } = useWebSocket();


  // ====================================================
  // STATE
  // ====================================================

  const [slots,
    setSlots] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [updatingId,
    setUpdatingId] =
    useState(null);

  const [pageError,
    setPageError] =
    useState("");

  const [search,
    setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("all");

  const [showConfirmModal,
    setShowConfirmModal] =
    useState(false);

  const [selectedSlot,
    setSelectedSlot] =
    useState(null);

  const [selectedStatus,
    setSelectedStatus] =
    useState("");


  // ====================================================
  // NOTIFICATIONS
  // ====================================================

  const {

    success,

    error: showError,

  } = useNotification();


  // ====================================================
  // FETCH SLOTS
  // ====================================================

  const fetchSlots =
    async () => {

      try {

        setPageError("");

        const data =
          await getSlots();

        setSlots(data);

      } catch (err) {

        console.error(
          "Slot fetch error:",
          err
        );

        setPageError(
          "Failed to load slots"
        );

        showError(
          "Failed to load slots"
        );

      } finally {

        setLoading(false);
      }
    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchSlots();

  }, []);


  // ====================================================
  // REALTIME SYNC
  // ====================================================

  useEffect(() => {

    if (

      realtimeSlots &&

      realtimeSlots.length > 0

    ) {

      setSlots(
        realtimeSlots
      );
    }

  }, [realtimeSlots]);


  // ====================================================
  // FILTERED SLOTS
  // ====================================================

  const filteredSlots =
    useMemo(() => {

      return slots.filter(
        (slot) => {

          const matchesSearch =

            slot.slot_number
              ?.toString()
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =

            statusFilter ===
            "all"

              ? true

              : slot.status ===
                statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [

      slots,

      search,

      statusFilter,
    ]);


  // ====================================================
  // OPEN MODAL
  // ====================================================

  const openStatusModal =
    (
      slot,
      status
    ) => {

      setSelectedSlot(slot);

      setSelectedStatus(status);

      setShowConfirmModal(true);
    };


  // ====================================================
  // UPDATE SLOT
  // ====================================================

  const updateSlotStatus =
    async () => {

      if (!selectedSlot)
        return;

      try {

        setUpdatingId(
          selectedSlot.id
        );

        // ==========================================
        // API UPDATE
        // ==========================================

        await api.patch(

          `/slots/${selectedSlot.id}/`,

          {
            status:
              selectedStatus,
          }
        );

        // ==========================================
        // OPTIMISTIC UPDATE
        // ==========================================

        setSlots((prev) =>

          prev.map((slot) =>

            slot.id ===
            selectedSlot.id

              ? {
                  ...slot,
                  status:
                    selectedStatus,
                }

              : slot
          )
        );

        success(
          `Slot ${selectedSlot.slot_number} updated`
        );

        setShowConfirmModal(false);

      } catch (err) {

        console.error(
          "Slot update error:",
          err
        );

        showError(
          "Failed to update slot"
        );

      } finally {

        setUpdatingId(null);
      }
    };


  // ====================================================
  // STATUS COLOR
  // ====================================================

  const getStatusColor =
    (status) => {

      switch (status) {

        case "available":
          return "bg-emerald-500";

        case "occupied":
          return "bg-red-500";

        case "reserved":
          return "bg-yellow-500";

        case "blocked":
          return "bg-slate-500";

        default:
          return "bg-slate-700";
      }
    };


  // ====================================================
  // STATS
  // ====================================================

  const totalSlots =
    slots.length;

  const availableSlots =
    slots.filter(
      (slot) =>
        slot.status ===
        "available"
    ).length;

  const occupiedSlots =
    slots.filter(
      (slot) =>
        slot.status ===
        "occupied"
    ).length;

  const blockedSlots =
    slots.filter(
      (slot) =>
        slot.status ===
        "blocked"
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
              Slot Manager
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
            Live parking slot management system
          </p>

        </div>


        {/* ====================================== */}
        {/* FILTERS */}
        {/* ====================================== */}

        <div className="
          flex
          flex-col
          md:flex-row
          gap-3
        ">

          <SearchBar

            value={search}

            onChange={setSearch}

            placeholder="
              Search slots...
            "

            className="w-full md:w-64"
          />

          <select

            value={statusFilter}

            onChange={(e) =>
              setStatusFilter(
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

            <option value="available">
              Available
            </option>

            <option value="occupied">
              Occupied
            </option>

            <option value="reserved">
              Reserved
            </option>

            <option value="blocked">
              Blocked
            </option>

          </select>

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
            Total Slots
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-white
          ">
            {totalSlots}
          </h2>

        </Card>


        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Available
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-emerald-400
          ">
            {availableSlots}
          </h2>

        </Card>


        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Occupied
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-red-400
          ">
            {occupiedSlots}
          </h2>

        </Card>


        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Blocked
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-slate-300
          ">
            {blockedSlots}
          </h2>

        </Card>

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

        <TableSkeleton />

      ) : filteredSlots.length === 0 ? (

        <EmptyState

          title="No Slots Found"

          description="
            No parking slots match the current filters.
          "

        />

      ) : (

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          2xl:grid-cols-5
          gap-5
        ">

          {filteredSlots.map((slot) => (

            <Card
              key={slot.id}
              className="
                shadow-lg
                hover:scale-[1.02]
                transition-all
              "
            >

              {/* ============================== */}
              {/* HEADER */}
              {/* ============================== */}

              <div className="
                flex
                items-center
                justify-between
                mb-5
              ">

                <div>

                  <h2 className="
                    text-xl
                    font-bold
                    text-white
                  ">
                    Slot
                    {" "}
                    {slot.slot_number}
                  </h2>

                  <p className="
                    text-xs
                    text-slate-400
                    mt-1
                  ">
                    Realtime monitored
                  </p>

                </div>

                <div className={`
                  w-4
                  h-4

                  rounded-full

                  animate-pulse

                  ${getStatusColor(
                    slot.status
                  )}
                `} />

              </div>


              {/* ============================== */}
              {/* STATUS */}
              {/* ============================== */}

              <div className="
                mb-5
              ">

                <p className="
                  text-slate-400
                  text-sm
                  mb-2
                ">
                  Current Status
                </p>

                <div className={`
                  inline-flex
                  items-center

                  px-3
                  py-1

                  rounded-full

                  text-xs
                  font-semibold
                  capitalize

                  ${
                    slot.status ===
                    "available"

                      ? `
                        bg-emerald-500/10
                        text-emerald-400
                      `

                      : slot.status ===
                        "occupied"

                      ? `
                        bg-red-500/10
                        text-red-400
                      `

                      : slot.status ===
                        "reserved"

                      ? `
                        bg-yellow-500/10
                        text-yellow-400
                      `

                      : `
                        bg-slate-500/10
                        text-slate-300
                      `
                  }
                `}>

                  {slot.status}

                </div>

              </div>


              {/* ============================== */}
              {/* ACTIONS */}
              {/* ============================== */}

              <div className="
                flex
                flex-wrap
                gap-2
              ">

                <Button

                  onClick={() =>
                    openStatusModal(
                      slot,
                      "available"
                    )
                  }

                  disabled={
                    updatingId ===
                    slot.id
                  }

                  className="
                    bg-emerald-600
                    hover:bg-emerald-700

                    text-xs

                    px-3
                    py-2
                  "
                >
                  Free
                </Button>


                <Button

                  onClick={() =>
                    openStatusModal(
                      slot,
                      "blocked"
                    )
                  }

                  disabled={
                    updatingId ===
                    slot.id
                  }

                  className="
                    bg-slate-600
                    hover:bg-slate-700

                    text-xs

                    px-3
                    py-2
                  "
                >
                  Block
                </Button>

              </div>

            </Card>
          ))}

        </div>
      )}


      {/* ========================================== */}
      {/* CONFIRM MODAL */}
      {/* ========================================== */}

      <ConfirmModal

        open={showConfirmModal}

        onClose={() =>
          setShowConfirmModal(false)
        }

        onConfirm={
          updateSlotStatus
        }

        title="Update Slot Status"

        message={`
          Are you sure you want
          to change slot
          ${selectedSlot?.slot_number}
          status to
          ${selectedStatus}?
        `}

        confirmText="Update"

        loading={
          updatingId ===
          selectedSlot?.id
        }

        danger={
          selectedStatus ===
          "blocked"
        }
      />

    </DashboardLayout>
  );
}