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
          Slot Status Distribution
        </h2>

        <p className="
          text-slate-400
          text-sm
          mt-1
        ">
          Parking slot usage overview
        </p>

      </div>


      {/* ========================================== */}
      {/* CHART */}
      {/* ========================================== */}

      <div className="w-full min-w-0">

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <PieChart>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >

              {data.map(
                (entry, index) => (

                  <Cell
                    key={`cell-${index}`}
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
              }}
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}