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
    <div
      className="
        w-full
        min-w-0
        h-[350px]
        min-h-[350px]
      "
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
          />

          <XAxis
            dataKey="day"
            stroke="#94a3b8"
            tick={{
              fill: "#94a3b8",
            }}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{
              fill: "#94a3b8",
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor:
                "#0f172a",
              border:
                "1px solid #334155",
              borderRadius:
                "12px",
              color: "#fff",
            }}
          />

          <Line
            type="monotone"
            dataKey="bookings"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#3b82f6",
            }}
            activeDot={{
              r: 7,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}