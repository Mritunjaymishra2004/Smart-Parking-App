import {

  ResponsiveContainer,

  LineChart,

  Line,

  XAxis,

  YAxis,

  Tooltip,

  CartesianGrid,

} from "recharts";


// ======================================================
// BOOKING TREND CHART
// ======================================================

export default function BookingTrendChart({

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
          Booking Trends
        </h2>

        <p className="
          text-slate-400
          text-sm
          mt-1
        ">
          Daily booking activity
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

          <LineChart data={data}>

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
              }}
            />

            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{
                r: 5,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}