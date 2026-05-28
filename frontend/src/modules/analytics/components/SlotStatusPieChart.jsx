import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// ======================================================
// COLORS
// ======================================================

const COLORS = [
  "#10b981",
  "#ef4444",
  "#f59e0b",
  "#64748b",
];

// ======================================================
// SLOT STATUS PIE CHART
// ======================================================

export default function SlotStatusPieChart({
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={50}
            dataKey="value"
            label
          >
            {data.map(
              (entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index %
                        COLORS.length
                    ]
                  }
                />
              )
            )}
          </Pie>

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

          <Legend
            wrapperStyle={{
              color: "#94a3b8",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}