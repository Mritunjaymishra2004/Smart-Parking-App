import {
  useState,
  useMemo,
} from "react";

import {
  Search,
  Shield,
  User,
  Car,
  Clock,
  Ban,
  Eye,
  ArrowRightLeft,
} from "lucide-react";

import DashboardLayout
from "../../components/common/DashboardLayout";


// ======================================================
// DUMMY USERS
// ======================================================

const USERS = [

  {
    id: 1,

    username: "mritunjay",

    email: "mrit@example.com",

    role: "admin",

    vehicles: 2,

    status: "active",

    lastLogin: "2 min ago",
  },

  {
    id: 2,

    username: "rahul",

    email: "rahul@example.com",

    role: "user",

    vehicles: 1,

    status: "active",

    lastLogin: "15 min ago",
  },

  {
    id: 3,

    username: "aman",

    email: "aman@example.com",

    role: "user",

    vehicles: 3,

    status: "blocked",

    lastLogin: "1 day ago",
  },
];


// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({

  status,

}) {

  return (

    <div className={`
      px-3
      py-1

      rounded-full

      text-xs
      font-medium

      inline-flex
      items-center

      ${
        status === "active"

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

      {status}

    </div>
  );
}


// ======================================================
// ROLE BADGE
// ======================================================

function RoleBadge({

  role,

}) {

  return (

    <div className={`
      px-3
      py-1

      rounded-full

      text-xs
      font-medium

      inline-flex
      items-center
      gap-1

      ${
        role === "admin"

          ? `
            bg-purple-500/10
            text-purple-400
          `

          : `
            bg-blue-500/10
            text-blue-400
          `
      }
    `}>

      <Shield size={12} />

      {role}

    </div>
  );
}


// ======================================================
// ACTION BUTTON
// ======================================================

function ActionButton({

  icon,

  label,

  color = "",

  onClick,

}) {

  return (

    <button

      onClick={onClick}

      className={`
        flex
        items-center
        gap-2

        px-3
        py-2

        rounded-xl

        bg-slate-800

        text-slate-300

        hover:bg-slate-700
        hover:text-white

        transition-all

        ${color}
      `}
    >

      {icon}

      <span className="
        text-sm
      ">

        {label}

      </span>

    </button>
  );
}


// ======================================================
// USER MANAGEMENT
// ======================================================

export default function UserManagement() {

  // ====================================================
  // STATE
  // ====================================================

  const [search,
    setSearch] =
    useState("");


  // ====================================================
  // FILTER USERS
  // ====================================================

  const filteredUsers =
    useMemo(() => {

      return USERS.filter((user) => {

        return (

          user.username
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          user.email
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );
      });

    }, [search]);


  // ====================================================
  // IMPERSONATE
  // ====================================================

  const handleAccessAccount =
    (user) => {

      alert(

        `Admin is now accessing ${user.username}'s account`

      );

      // ==============================================
      // FUTURE BACKEND API
      // ==============================================

      // POST /api/v1/admin/impersonate/

    };


  // ====================================================
  // BLOCK USER
  // ====================================================

  const handleBlockUser =
    (user) => {

      alert(
        `${user.username} blocked`
      );
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <DashboardLayout>

      <div className="
        space-y-8
      ">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="
          flex
          flex-col
          lg:flex-row

          lg:items-center
          lg:justify-between

          gap-5
        ">

          <div>

            <h1 className="
              text-3xl
              font-bold
              text-white
            ">

              User Management

            </h1>

            <p className="
              text-slate-400
              mt-2
            ">

              Manage users,
              monitor activity,
              and access accounts securely.

            </p>

          </div>


          {/* SEARCH */}

          <div className="
            relative

            w-full
            lg:w-[350px]
          ">

            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2

                text-slate-500
              "
            />

            <input

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              placeholder="
                Search users...
              "

              className="
                w-full

                bg-slate-900

                border
                border-slate-800

                rounded-2xl

                pl-11
                pr-4
                py-3

                text-white

                outline-none

                focus:border-emerald-500/40
              "
            />

          </div>

        </div>


        {/* ========================================== */}
        {/* TABLE */}
        {/* ========================================== */}

        <div className="
          bg-slate-900

          border
          border-slate-800

          rounded-3xl

          overflow-hidden
        ">

          {/* TABLE HEADER */}

          <div className="
            hidden
            xl:grid

            grid-cols-7

            gap-4

            px-6
            py-4

            border-b
            border-slate-800

            text-sm
            font-semibold

            text-slate-400
          ">

            <div>User</div>

            <div>Email</div>

            <div>Role</div>

            <div>Vehicles</div>

            <div>Status</div>

            <div>Last Login</div>

            <div>Actions</div>

          </div>


          {/* USERS */}

          <div className="
            divide-y
            divide-slate-800
          ">

            {filteredUsers.map((user) => (

              <div

                key={user.id}

                className="
                  grid
                  grid-cols-1
                  xl:grid-cols-7

                  gap-4

                  px-6
                  py-5

                  hover:bg-slate-800/40

                  transition-all
                "
              >

                {/* USER */}

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    w-12
                    h-12

                    rounded-full

                    bg-emerald-500/10

                    flex
                    items-center
                    justify-center

                    text-emerald-400
                  ">

                    <User size={20} />

                  </div>

                  <div>

                    <p className="
                      text-white
                      font-medium
                    ">

                      {user.username}

                    </p>

                  </div>

                </div>


                {/* EMAIL */}

                <div className="
                  flex
                  items-center

                  text-slate-300
                ">

                  {user.email}

                </div>


                {/* ROLE */}

                <div className="
                  flex
                  items-center
                ">

                  <RoleBadge
                    role={user.role}
                  />

                </div>


                {/* VEHICLES */}

                <div className="
                  flex
                  items-center
                  gap-2

                  text-slate-300
                ">

                  <Car size={16} />

                  {user.vehicles}

                </div>


                {/* STATUS */}

                <div className="
                  flex
                  items-center
                ">

                  <StatusBadge
                    status={user.status}
                  />

                </div>


                {/* LOGIN */}

                <div className="
                  flex
                  items-center
                  gap-2

                  text-slate-400
                ">

                  <Clock size={16} />

                  {user.lastLogin}

                </div>


                {/* ACTIONS */}

                <div className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                ">

                  {/* VIEW */}

                  <ActionButton

                    icon={
                      <Eye size={16} />
                    }

                    label="View"

                  />


                  {/* ACCESS */}

                  <ActionButton

                    icon={
                      <ArrowRightLeft
                        size={16}
                      />
                    }

                    label="Access"

                    color="
                      hover:bg-emerald-500/10
                      hover:text-emerald-400
                    "

                    onClick={() =>
                      handleAccessAccount(
                        user
                      )
                    }

                  />


                  {/* BLOCK */}

                  <ActionButton

                    icon={
                      <Ban size={16} />
                    }

                    label="Block"

                    color="
                      hover:bg-red-500/10
                      hover:text-red-400
                    "

                    onClick={() =>
                      handleBlockUser(
                        user
                      )
                    }

                  />

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}