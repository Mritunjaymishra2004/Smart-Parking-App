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
        <BarChart
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
            dataKey="name"
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
  );
}