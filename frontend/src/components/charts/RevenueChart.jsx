import {

  ResponsiveContainer,

  AreaChart,

  Area,

  CartesianGrid,

  XAxis,

  YAxis,

  Tooltip,

} from "recharts";


// ======================================================
// REVENUE CHART
// ======================================================

export default function RevenueChart({

  data = [],

}) {

  return (

    <div className="
      bg-slate-900
      border
      border-slate-800
      rounded-2xl
      p-5
      shadow-lg
    ">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="mb-6">

        <h2 className="
          text-xl
          font-bold
          text-white
        ">
          Revenue Analytics
        </h2>

        <p className="
          text-slate-400
          text-sm
          mt-1
        ">
          Weekly revenue overview
        </p>

      </div>


      {/* ========================================== */}
      {/* CHART */}
      {/* ========================================== */}

      <div className="h-[350px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>

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

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="day"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
            />

            <Tooltip
              contentStyle={{
                backgroundColor:
                  "#0f172a",

                border:
                  "1px solid #334155",

                borderRadius:
                  "12px",

                color:
                  "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#revenueGradient)"
              strokeWidth={3}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}