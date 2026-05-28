import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DashboardLayout from "../../components/common/DashboardLayout";

import Card from "../../components/ui/Card";

import Loader from "../../components/ui/Loader";

import Button from "../../components/ui/Button";

import ConfirmModal from "../../components/ui/ConfirmModal";

import api from "../../api/axios";

import {
  useNotification,
} from "../../context/NotificationContext";


// ======================================================
// USERS PANEL
// ======================================================

export default function UsersPanel() {

  // ====================================================
  // STATE
  // ====================================================

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filterStatus,
    setFilterStatus] =
    useState("all");

  const [updatingId,
    setUpdatingId] =
    useState(null);

  const [showConfirmModal,
    setShowConfirmModal] =
    useState(false);

  const [selectedUser,
    setSelectedUser] =
    useState(null);


  // ====================================================
  // NOTIFICATIONS
  // ====================================================

  const {

    success,

    error: showError,

    warning,

    info,

  } = useNotification();


  // ====================================================
  // FETCH USERS
  // ====================================================

  const fetchUsers =
    async () => {

      try {

        setPageError("");

        const response =
          await api.get(
            "/admin/wallet-users/"
          );

        setUsers(
          response.data
        );

      } catch (err) {

        console.error(
          "Users fetch error:",
          err
        );

        setPageError(
          "Failed to load users"
        );

        showError(
          "Failed to load users"
        );

      } finally {

        setLoading(false);
      }
    };


  // ====================================================
  // LOAD
  // ====================================================

  useEffect(() => {

    fetchUsers();

  }, []);


  // ====================================================
  // OPEN STATUS MODAL
  // ====================================================

  const openStatusModal =
    (user) => {

      setSelectedUser(user);

      setShowConfirmModal(true);
    };


  // ====================================================
  // TOGGLE USER STATUS
  // ====================================================

  const toggleUserStatus =
    async () => {

      if (!selectedUser)
        return;

      try {

        setUpdatingId(
          selectedUser.id
        );

        const updatedStatus =

          !selectedUser.is_active;

        await api.patch(

          `/admin/users/${selectedUser.id}/`,

          {
            is_active:
              updatedStatus,
          }
        );

        // ==========================================
        // LOCAL UPDATE
        // ==========================================

        setUsers((prev) =>

          prev.map((u) =>

            u.id ===
            selectedUser.id

              ? {
                  ...u,
                  is_active:
                    updatedStatus,
                }

              : u
          )
        );

        success(

          updatedStatus

            ? "User activated"

            : "User deactivated"
        );

        setShowConfirmModal(false);

      } catch (err) {

        console.error(
          "User update error:",
          err
        );

        showError(
          "Failed to update user"
        );

      } finally {

        setUpdatingId(null);
      }
    };


  // ====================================================
  // FILTER USERS
  // ====================================================

  const filteredUsers =
    useMemo(() => {

      return users.filter(
        (user) => {

          const matchesSearch =

            user.username
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            user.email
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =

            filterStatus ===
              "all"

              ? true

              : filterStatus ===
                "active"

                ? user.is_active

                : !user.is_active;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );

    }, [

      users,

      search,

      filterStatus,
    ]);


  // ====================================================
  // STATS
  // ====================================================

  const totalUsers =
    users.length;

  const activeUsers =
    users.filter(
      (user) =>
        user.is_active
    ).length;

  const inactiveUsers =
    users.filter(
      (user) =>
        !user.is_active
    ).length;

  const totalWalletBalance =
    users.reduce(

      (sum, user) =>

        sum +
        Number(
          user.wallet_balance || 0
        ),

      0
    );


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
        gap-4
        mb-8
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-white
          ">
            Users Panel
          </h1>

          <p className="
            text-slate-400
            mt-1
          ">
            Manage platform users
            and wallet balances
          </p>

        </div>

      </div>


      {/* ========================================== */}
      {/* STATS */}
      {/* ========================================== */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-5
        mb-8
      ">

        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Total Users
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-white
          ">
            {totalUsers}
          </h2>

        </Card>


        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Active Users
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-emerald-400
          ">
            {activeUsers}
          </h2>

        </Card>


        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Inactive Users
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-red-400
          ">
            {inactiveUsers}
          </h2>

        </Card>


        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Wallet Revenue
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-blue-400
          ">
            ₹ {totalWalletBalance}
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

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            md:w-96
            bg-slate-900
            border
            border-slate-700
            text-white
            px-4
            py-3
            rounded-xl
            outline-none
          "
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
            All Users
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
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
      {/* LOADER */}
      {/* ========================================== */}

      {loading ? (

        <Loader />

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
                  Email
                </th>

                <th className="p-4">
                  Wallet Balance
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

              {filteredUsers.map(
                (user) => (

                  <tr
                    key={user.id}
                    className="
                      border-t
                      border-slate-800
                      hover:bg-slate-800/40
                    "
                  >

                    <td className="
                      p-4
                      text-white
                      font-medium
                    ">
                      {user.username}
                    </td>

                    <td className="
                      p-4
                      text-slate-300
                    ">
                      {user.email}
                    </td>

                    <td className="
                      p-4
                      text-emerald-400
                      font-semibold
                    ">
                      ₹ {user.wallet_balance}
                    </td>

                    <td className="p-4">

                      <span className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-medium

                        ${user.is_active

                          ? `
                            bg-emerald-500/20
                            text-emerald-400
                          `

                          : `
                            bg-red-500/20
                            text-red-400
                          `
                        }
                      `}>

                        {user.is_active

                          ? "Active"

                          : "Inactive"}

                      </span>

                    </td>

                    <td className="p-4">

                      <Button
                        onClick={() =>
                          openStatusModal(
                            user
                          )
                        }
                        disabled={
                          updatingId ===
                          user.id
                        }
                        className={`

                          text-xs
                          px-3
                          py-2

                          ${user.is_active

                            ? `
                              bg-red-600
                              hover:bg-red-700
                            `

                            : `
                              bg-emerald-600
                              hover:bg-emerald-700
                            `
                          }
                        `}
                      >

                        {updatingId ===
                        user.id

                          ? "Updating..."

                          : user.is_active

                            ? "Deactivate"

                            : "Activate"}

                      </Button>

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

        open={showConfirmModal}

        onClose={() =>
          setShowConfirmModal(false)
        }

        onConfirm={
          toggleUserStatus
        }

        title={
          selectedUser?.is_active

            ? "Deactivate User"

            : "Activate User"
        }

        message={
          selectedUser?.is_active

            ? `
              Are you sure you want
              to deactivate this user?
            `

            : `
              Are you sure you want
              to activate this user?
            `
        }

        confirmText={
          selectedUser?.is_active

            ? "Deactivate"

            : "Activate"
        }

        loading={
          updatingId ===
          selectedUser?.id
        }

        danger={
          selectedUser?.is_active
        }
      />

    </DashboardLayout>
  );
}