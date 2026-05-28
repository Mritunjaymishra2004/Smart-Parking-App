import {
  useState,
  useMemo,
} from "react";

import {
  AlertTriangle,
  Search,
  ShieldAlert,
  Clock,
  Car,
  Ban,
  CheckCircle2,
  Siren,
  Activity,
} from "lucide-react";


// ======================================================
// VIOLATIONS DATA
// ======================================================

const VIOLATIONS = [
  {
    id: 1,
    vehicle: "UP14 AB 2345",
    slot: "A12",
    type: "Unauthorized Parking",
    status: "Pending",
    severity: "High",
    time: "10 mins ago",
  },
  {
    id: 2,
    vehicle: "DL08 XY 9987",
    slot: "B05",
    type: "Overstay Limit",
    status: "Resolved",
    severity: "Medium",
    time: "35 mins ago",
  },
  {
    id: 3,
    vehicle: "HR26 MN 7865",
    slot: "C18",
    type: "Blocked Entry",
    status: "Pending",
    severity: "Critical",
    time: "1 hour ago",
  },
];


// ======================================================
// BADGES
// ======================================================

function StatusBadge({
  status,
}) {
  return (
    <span className={`
      px-3 py-1 rounded-full text-xs font-medium
      ${
        status === "Resolved"
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }
    `}>
      {status}
    </span>
  );
}

function SeverityBadge({
  severity,
}) {
  const styles = {
    Critical:
      "bg-red-500/10 text-red-400",
    High:
      "bg-orange-500/10 text-orange-400",
    Medium:
      "bg-amber-500/10 text-amber-400",
  };

  return (
    <span className={`
      px-3 py-1 rounded-full text-xs
      ${styles[severity]}
    `}>
      {severity}
    </span>
  );
}


// ======================================================
// STAT CARD
// ======================================================

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
      backdrop-blur-xl
    ">
      <div className={`${color} mb-4`}>
        {icon}
      </div>

      <h3 className="text-slate-400">
        {title}
      </h3>

      <p className="
        text-4xl font-bold
        text-white mt-2
      ">
        {value}
      </p>
    </div>
  );
}


// ======================================================
// PAGE
// ======================================================

export default function Violations() {
  const [search,
    setSearch] =
    useState("");

  const [violations,
    setViolations] =
    useState(VIOLATIONS);


  const filteredViolations =
    useMemo(() => {
      return violations.filter(
        (v) =>
          v.vehicle
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          v.type
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [violations, search]);


  const resolveViolation =
    (id) => {
      setViolations((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status:
                  "Resolved",
              }
            : v
        )
      );
    };


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
        from-red-500/10
        via-orange-500/10
        to-yellow-500/10
        border border-white/10
      ">
        <h1 className="
          text-5xl font-bold text-white
        ">
          Violation
          <span className="
            block text-red-400
          ">
            Surveillance Center
          </span>
        </h1>

        <p className="
          mt-4 text-slate-300 text-lg
        ">
          Real-time smart parking violation detection
        </p>
      </div>


      {/* STATS */}
      <div className="
        grid md:grid-cols-4 gap-6
      ">
        <StatCard
          title="Total Cases"
          value={violations.length}
          icon={<AlertTriangle />}
          color="text-red-400"
        />

        <StatCard
          title="Pending"
          value={
            violations.filter(
              v =>
                v.status ===
                "Pending"
            ).length
          }
          icon={<ShieldAlert />}
          color="text-orange-400"
        />

        <StatCard
          title="Resolved"
          value={
            violations.filter(
              v =>
                v.status ===
                "Resolved"
            ).length
          }
          icon={<CheckCircle2 />}
          color="text-emerald-400"
        />

        <StatCard
          title="Critical"
          value={
            violations.filter(
              v =>
                v.severity ===
                "Critical"
            ).length
          }
          icon={<Siren />}
          color="text-red-500"
        />
      </div>


      {/* SEARCH */}
      <div className="
        relative max-w-md
      ">
        <Search
          size={18}
          className="
            absolute
            left-4 top-1/2
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
          placeholder="Search violations..."
          className="
            w-full
            bg-slate-900
            border border-white/10
            rounded-2xl
            pl-11 pr-4 py-3
            text-white
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
        <table className="
          w-full text-left
        ">
          <thead className="
            bg-slate-800
          ">
            <tr>
              <th className="p-5">Vehicle</th>
              <th className="p-5">Slot</th>
              <th className="p-5">Violation</th>
              <th className="p-5">Severity</th>
              <th className="p-5">Time</th>
              <th className="p-5">Status</th>
              <th className="p-5">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredViolations.map(
              (violation) => (
                <tr
                  key={violation.id}
                  className="
                    border-t border-white/10
                    hover:bg-white/5
                  "
                >
                  <td className="p-5 flex items-center gap-2">
                    <Car size={16} />
                    {violation.vehicle}
                  </td>

                  <td className="p-5">
                    {violation.slot}
                  </td>

                  <td className="p-5 text-red-400">
                    {violation.type}
                  </td>

                  <td className="p-5">
                    <SeverityBadge
                      severity={
                        violation.severity
                      }
                    />
                  </td>

                  <td className="p-5 flex items-center gap-2">
                    <Clock size={15} />
                    {violation.time}
                  </td>

                  <td className="p-5">
                    <StatusBadge
                      status={
                        violation.status
                      }
                    />
                  </td>

                  <td className="p-5">
                    {violation.status ===
                    "Pending" ? (
                      <button
                        onClick={() =>
                          resolveViolation(
                            violation.id
                          )
                        }
                        className="
                          px-4 py-2
                          rounded-xl
                          bg-emerald-500
                          text-black
                          font-semibold
                        "
                      >
                        Resolve
                      </button>
                    ) : (
                      <Activity className="text-emerald-400" />
                    )}
                  </td>

                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}