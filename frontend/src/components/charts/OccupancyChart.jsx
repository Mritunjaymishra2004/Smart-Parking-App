import {

  ResponsiveContainer,

  BarChart,

  Bar,

  XAxis,

  YAxis,

  CartesianGrid,

  Tooltip,

} from "recharts";


// ======================================================
// OCCUPANCY CHART
// ======================================================

export default function OccupancyChart({

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
          Occupancy Analytics
        </h2>

        <p className="
          text-slate-400
          text-sm
          mt-1
        ">
          Parking slot occupancy
        </p>

      </div>


      {/* ========================================== */}
      {/* CHART */}
      {/* ========================================== */}

      <div className="h-[350px]">

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <BarChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="name"
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
              }}
            />

            <Bar
              dataKey="occupied"
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="free"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}