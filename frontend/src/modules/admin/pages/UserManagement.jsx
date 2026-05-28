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
  Users,
  Activity,
  CheckCircle,
  UserCog,
} from "lucide-react";


// ======================================================
// DEMO USERS
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
    status: "blocked",
    vehicles: 3,
    lastLogin: "1 day ago",
  },
];


// ======================================================
// USER MANAGEMENT
// ======================================================

export default function UserManagement() {
  const [search,
    setSearch] =
    useState("");

  const filteredUsers =
    useMemo(() => {
      return USERS.filter(
        (u) =>
          u.username
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          u.email
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [search]);


  return (
    <div className="
      min-h-screen
      space-y-8
      pb-10
    ">

      {/* HERO */}
      <div className="
        rounded-3xl
        p-8
        bg-gradient-to-r
        from-purple-500/10
        via-blue-500/10
        to-emerald-500/10
        border border-white/10
      ">
        <h1 className="
          text-5xl font-bold
        ">
          User
          <span className="
            block text-emerald-400
          ">
            Management Center
          </span>
        </h1>

        <p className="
          mt-4 text-slate-300
        ">
          Manage roles, activity and access
        </p>
      </div>


      {/* STATS */}
      <div className="
        grid md:grid-cols-4 gap-6
      ">
        <StatCard
          title="Total Users"
          value={USERS.length}
          icon={<Users />}
          color="text-blue-400"
        />

        <StatCard
          title="Active"
          value={
            USERS.filter(
              u =>
                u.status === "active"
            ).length
          }
          icon={<CheckCircle />}
          color="text-emerald-400"
        />

        <StatCard
          title="Blocked"
          value={
            USERS.filter(
              u =>
                u.status === "blocked"
            ).length
          }
          icon={<Ban />}
          color="text-red-400"
        />

        <StatCard
          title="Admins"
          value={
            USERS.filter(
              u =>
                u.role === "admin"
            ).length
          }
          icon={<Shield />}
          color="text-purple-400"
        />
      </div>


      {/* SEARCH */}
      <div className="
        relative max-w-md
      ">
        <Search
          size={18}
          className="
            absolute left-4 top-1/2
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
          placeholder="Search users..."
          className="
            w-full
            bg-slate-900
            border border-white/10
            rounded-2xl
            pl-12 pr-4 py-4
          "
        />
      </div>


      {/* TABLE */}
      <div className="
        rounded-3xl
        bg-slate-900/70
        border border-white/10
        overflow-hidden
      ">
        {filteredUsers.map(
          (user) => (
            <div
              key={user.id}
              className="
                grid xl:grid-cols-7
                gap-4
                px-6 py-5
                border-b border-white/5
                hover:bg-white/5
              "
            >

              {/* USER */}
              <div className="
                flex items-center gap-3
              ">
                <div className="
                  w-12 h-12 rounded-full
                  bg-emerald-500/10
                  flex items-center justify-center
                ">
                  <User />
                </div>

                <span className="
                  font-medium
                ">
                  {user.username}
                </span>
              </div>

              <div>{user.email}</div>

              <RoleBadge
                role={user.role}
              />

              <div className="
                flex items-center gap-2
              ">
                <Car size={16} />
                {user.vehicles}
              </div>

              <StatusBadge
                status={user.status}
              />

              <div className="
                flex items-center gap-2
              ">
                <Clock size={16} />
                {user.lastLogin}
              </div>

              <div className="
                flex gap-2
              ">
                <ActionButton
                  icon={<Eye />}
                />

                <ActionButton
                  icon={<Activity />}
                />

                <ActionButton
                  icon={<UserCog />}
                />

                <ActionButton
                  icon={<Ban />}
                  danger
                />
              </div>

            </div>
          )
        )}
      </div>

    </div>
  );
}


// ======================================================
// COMPONENTS
// ======================================================

function StatusBadge({
  status,
}) {
  return (
    <span className={`
      px-3 py-1 rounded-full text-xs
      ${
        status === "active"
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }
    `}>
      {status}
    </span>
  );
}

function RoleBadge({
  role,
}) {
  return (
    <span className={`
      px-3 py-1 rounded-full text-xs
      ${
        role === "admin"
          ? "bg-purple-500/10 text-purple-400"
          : "bg-blue-500/10 text-blue-400"
      }
    `}>
      {role}
    </span>
  );
}

function ActionButton({
  icon,
  danger,
}) {
  return (
    <button className={`
      p-3 rounded-xl
      bg-slate-800
      hover:bg-slate-700
      ${danger ? "hover:text-red-400" : ""}
    `}>
      {icon}
    </button>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="
      rounded-3xl
      bg-slate-900/70
      border border-white/10
      p-6
    ">
      <div className={`${color} mb-4`}>
        {icon}
      </div>

      <h3 className="text-slate-400">
        {title}
      </h3>

      <p className="
        text-4xl font-bold mt-2
      ">
        {value}
      </p>
    </div>
  );
}