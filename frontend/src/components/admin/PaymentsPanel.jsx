import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout
from "../../components/common/DashboardLayout";

import SearchBar
from "../../components/ui/SearchBar";

import EmptyState
from "../../components/ui/EmptyState";

import StatusBadge
from "../../components/ui/StatusBadge";

import StatCard
from "../../components/ui/StatCard";

import Button
from "../../components/ui/Button";

import TableSkeleton
from "../../components/ui/TableSkeleton";

import {

  getPayments,

} from "../../services/parkingService";

import {
  useNotification,
} from "../../context/NotificationContext";

import {
  exportCSV,
} from "../../utils/exportCSV";

import {
  exportPDF,
} from "../../utils/exportPDF";

import {
  useWebSocket,
} from "../../context/WebSocketContext";

import {

  DollarSign,

  CheckCircle,

  Clock3,

  XCircle,

  Wifi,

  WifiOff,

  CreditCard,

} from "lucide-react";


// ======================================================
// PAYMENTS PANEL
// ======================================================

export default function PaymentsPanel() {

  // ====================================================
  // REALTIME
  // ====================================================

  const {

    payments: realtimePayments,

    connected,

  } = useWebSocket();


  // ====================================================
  // STATE
  // ====================================================

  const [payments,
    setPayments] =
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

  const [statusFilter,
    setStatusFilter] =
    useState("all");

  const [methodFilter,
    setMethodFilter] =
    useState("all");


  // ====================================================
  // NOTIFICATIONS
  // ====================================================

  const {

    success,

    error: showError,

  } = useNotification();


  // ====================================================
  // FETCH PAYMENTS
  // ====================================================

  const fetchPayments =
    async () => {

      try {

        setPageError("");

        const data =
          await getPayments();

        setPayments(data);

      } catch (err) {

        console.error(
          "Payments fetch error:",
          err
        );

        setPageError(
          "Failed to load payments"
        );

        showError(
          "Failed to load payments"
        );

      } finally {

        setLoading(false);
      }
    };


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {

    fetchPayments();

  }, []);


  // ====================================================
  // REALTIME SYNC
  // ====================================================

  useEffect(() => {

    if (

      realtimePayments &&

      realtimePayments.length > 0

    ) {

      setPayments(
        realtimePayments
      );
    }

  }, [realtimePayments]);


  // ====================================================
  // FILTERED PAYMENTS
  // ====================================================

  const filteredPayments =
    useMemo(() => {

      return payments.filter(
        (payment) => {

          const query =
            search.toLowerCase();

          const matchesSearch =

            payment.user
              ?.toLowerCase()
              .includes(query)

            ||

            payment.transaction_id
              ?.toLowerCase()
              .includes(query);

          const matchesStatus =

            statusFilter ===
            "all"

              ? true

              : payment.status ===
                statusFilter;

          const matchesMethod =

            methodFilter ===
            "all"

              ? true

              : payment.method ===
                methodFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesMethod
          );
        }
      );

    }, [

      payments,

      search,

      statusFilter,

      methodFilter,
    ]);


  // ====================================================
  // STATS
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

  const successfulPayments =
    payments.filter(
      (payment) =>
        payment.status ===
        "success"
    ).length;

  const pendingPayments =
    payments.filter(
      (payment) =>
        payment.status ===
        "pending"
    ).length;

  const failedPayments =
    payments.filter(
      (payment) =>
        payment.status ===
        "failed"
    ).length;


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
  // EXPORT CSV
  // ====================================================

  const handleExportCSV =
    () => {

      exportCSV(

        filteredPayments,

        "payments-report.csv"
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

        "Payments Report",

        [

          "User",

          "Amount",

          "Method",

          "Transaction ID",

          "Status",
        ],

        filteredPayments.map(
          (payment) => [

            payment.user,

            payment.amount,

            payment.method,

            payment.transaction_id,

            payment.status,
          ]
        ),

        "payments-report.pdf"
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
              Payments Panel
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
            Live payment monitoring and revenue analytics
          </p>

        </div>


        {/* ====================================== */}
        {/* EXPORT */}
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
      {/* STATS */}
      {/* ========================================== */}

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
          title="Successful"
          value={successfulPayments}
          color="text-emerald-400"
          icon={
            <CheckCircle size={20} />
          }
        />

        <StatCard
          title="Pending"
          value={pendingPayments}
          color="text-yellow-400"
          icon={
            <Clock3 size={20} />
          }
        />

        <StatCard
          title="Failed"
          value={failedPayments}
          color="text-red-400"
          icon={
            <XCircle size={20} />
          }
        />

      </div>


      {/* ========================================== */}
      {/* FILTERS */}
      {/* ========================================== */}

      <div className="
        flex
        flex-col
        lg:flex-row
        gap-4
        mb-6
      ">

        <SearchBar

          value={search}

          onChange={setSearch}

          placeholder="
            Search user or transaction...
          "

          className="lg:w-96"

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

          <option value="success">
            Success
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="failed">
            Failed
          </option>

        </select>


        <select

          value={methodFilter}

          onChange={(e) =>
            setMethodFilter(
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
            All Methods
          </option>

          <option value="upi">
            UPI
          </option>

          <option value="card">
            Card
          </option>

          <option value="cash">
            Cash
          </option>

          <option value="wallet">
            Wallet
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
          columns={6}
        />

      ) : filteredPayments.length === 0 ? (

        <EmptyState

          title="No Payments Found"

          description="
            No payment transactions found
            for current filters
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
                  Amount
                </th>

                <th className="p-4">
                  Method
                </th>

                <th className="p-4">
                  Transaction ID
                </th>

                <th className="p-4">
                  Date
                </th>

                <th className="p-4">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredPayments.map(
                (payment) => (

                  <tr

                    key={payment.id}

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
                      {payment.user}
                    </td>

                    <td className="
                      p-4
                      text-emerald-400
                      font-semibold
                    ">
                      ₹ {payment.amount}
                    </td>

                    <td className="
                      p-4
                      text-slate-300
                      capitalize
                    ">

                      <div className="
                        flex
                        items-center
                        gap-2
                      ">

                        <CreditCard
                          size={15}
                        />

                        {payment.method}

                      </div>

                    </td>

                    <td className="
                      p-4
                      text-slate-300
                    ">
                      {payment.transaction_id}
                    </td>

                    <td className="
                      p-4
                      text-slate-300
                    ">
                      {formatDate(
                        payment.created_at
                      )}
                    </td>

                    <td className="
                      p-4
                    ">

                      <StatusBadge
                        status={
                          payment.status
                        }
                      />

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </DashboardLayout>
  );
}