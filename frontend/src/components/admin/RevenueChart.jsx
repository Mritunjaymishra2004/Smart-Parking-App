import {
  useMemo,
} from "react";

import {
  ResponsiveContainer,

  AreaChart,

  Area,

  Line,

  XAxis,

  YAxis,

  CartesianGrid,

  Tooltip,

} from "recharts";

// ======================================================
// CURRENCY FORMATTER
// ======================================================

const formatCurrency = (
  value
) => {

  return `₹${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
};

// ======================================================
// CUSTOM TOOLTIP
// ======================================================

function CustomTooltip({
  active,
  payload,
  label,
}) {

  if (
    !active ||

    !payload ||

    !payload.length
  ) {

    return null;
  }

  const revenue =
    payload?.[0]?.value || 0;

  return (

    <div className="
      bg-slate-900/95
      backdrop-blur-md
      border
      border-emerald-500/30
      px-4
      py-3
      rounded-xl
      shadow-2xl
    ">

      <p className="
        text-slate-400
        text-xs
        mb-1
      ">
        {label}
      </p>

      <p className="
        text-emerald-400
        font-bold
        text-lg
      ">
        {formatCurrency(
          revenue
        )}
      </p>

    </div>
  );
}

// ======================================================
// LOADING PLACEHOLDER
// ======================================================

function LoadingChart() {

  return (

    <div className="
      h-[300px]
      animate-pulse
      rounded-xl
      bg-slate-800/50
    " />
  );
}

// ======================================================
// REVENUE CHART
// ======================================================

export default function RevenueChart({

  data = [],

  loading = false,

}) {

  // ====================================================
  // SAFE DATA
  // ====================================================

  const safeData =
    useMemo(() => {

      if (
        Array.isArray(data) &&
        data.length
      ) {

        return data;
      }

      return [
        {
          day: "No Data",
          revenue: 0,
        },
      ];

    }, [data]);

  // ====================================================
  // TOTAL REVENUE
  // ====================================================

  const totalRevenue =
    useMemo(() => {

      return safeData.reduce(

        (acc, item) =>

          acc +
          Number(
            item.revenue || 0
          ),

        0
      );

    }, [safeData]);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return <LoadingChart />;
  }

  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      bg-slate-900/80
      backdrop-blur-xl
      border
      border-emerald-500/20
      rounded-2xl
      p-5
      shadow-[0_0_30px_rgba(16,185,129,0.12)]
    ">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-3
        mb-6
      ">

        <div>

          <h2 className="
            text-xl
            font-bold
            text-emerald-400
          ">
            Revenue Analytics
          </h2>

          <p className="
            text-slate-400
            text-sm
            mt-1
          ">
            Weekly parking revenue insights
          </p>

        </div>

        {/* ====================================== */}
        {/* TOTAL */}
        {/* ====================================== */}

        <div className="
          bg-slate-800/70
          border
          border-slate-700
          rounded-xl
          px-4
          py-2
        ">

          <p className="
            text-xs
            text-slate-400
          ">
            Total Revenue
          </p>

          <p className="
            text-lg
            font-bold
            text-white
          ">
            {formatCurrency(
              totalRevenue
            )}
          </p>

        </div>

      </div>

      {/* ========================================== */}
      {/* CHART */}
      {/* ========================================== */}

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <AreaChart
          data={safeData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >

          {/* ====================================== */}
          {/* GRADIENT */}
          {/* ====================================== */}

          <defs>

            <linearGradient
              id="revenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="#10b981"
                stopOpacity={0.5}
              />

              <stop
                offset="95%"
                stopColor="#10b981"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          {/* ====================================== */}
          {/* GRID */}
          {/* ====================================== */}

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />

          {/* ====================================== */}
          {/* X AXIS */}
          {/* ====================================== */}

          <XAxis
            dataKey="day"
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            tick={{
              fontSize: 12,
            }}
          />

          {/* ====================================== */}
          {/* Y AXIS */}
          {/* ====================================== */}

          <YAxis
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            width={80}
            tickFormatter={
              formatCurrency
            }
            tick={{
              fontSize: 12,
            }}
          />

          {/* ====================================== */}
          {/* TOOLTIP */}
          {/* ====================================== */}

          <Tooltip
            content={
              <CustomTooltip />
            }
          />

          {/* ====================================== */}
          {/* AREA */}
          {/* ====================================== */}

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#revenueGradient)"
            fillOpacity={1}
            animationDuration={1200}
          />

          {/* ====================================== */}
          {/* LINE */}
          {/* ====================================== */}

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            dot={{
              r: 4,
            }}
            activeDot={{
              r: 7,
            }}
            animationDuration={1200}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}













// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Area,
//   AreaChart,
// } from "recharts";

// // ===============================
// // 🔥 CUSTOM TOOLTIP
// // ===============================
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-lg">
//         <p className="text-slate-300 text-sm">{label}</p>
//         <p className="text-emerald-400 font-semibold">
//           ₹{payload[0].value}
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// export default function RevenueChart({ data = [] }) {

//   // ===============================
//   // 🔒 SAFE DATA
//   // ===============================
//   const safeData = data.length
//     ? data
//     : [{ day: "No Data", revenue: 0 }];

//   return (
//     <div className="bg-slate-900/70 backdrop-blur-md border border-emerald-400/30 rounded-xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.2)]">

//       <h2 className="text-lg font-semibold text-emerald-400 mb-4">
//         Revenue Analytics
//       </h2>

//       <ResponsiveContainer width="100%" height={300}>
//         <AreaChart data={safeData}>

//           <defs>
//             {/* 🔥 GRADIENT */}
//             <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
//               <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
//             </linearGradient>
//           </defs>

//           <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

//           <XAxis
//             dataKey="day"
//             stroke="#94a3b8"
//           />

//           <YAxis
//             stroke="#94a3b8"
//             tickFormatter={(value) => `₹${value}`}
//           />

//           <Tooltip content={<CustomTooltip />} />

//           {/* 🔥 AREA (GLOW EFFECT) */}
//           <Area
//             type="monotone"
//             dataKey="revenue"
//             stroke="#10b981"
//             fillOpacity={1}
//             fill="url(#colorRevenue)"
//           />

//           {/* 🔥 LINE ON TOP */}
//           <Line
//             type="monotone"
//             dataKey="revenue"
//             stroke="#10b981"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//           />

//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }