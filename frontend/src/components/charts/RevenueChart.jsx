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
// EMPTY STATE
// ======================================================

function EmptyState() {

  return (

    <div className="
      h-full

      flex
      items-center
      justify-center

      text-slate-400
      text-sm
    ">

      No revenue data available

    </div>
  );
}


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

  return (

    <div className="
      bg-slate-900
      border
      border-slate-700

      rounded-xl

      px-4
      py-3

      shadow-2xl
    ">

      <p className="
        text-slate-300
        text-xs
        mb-2
      ">

        {label}

      </p>

      <p className="
        text-emerald-400
        font-semibold
      ">

        ₹ {payload[0].value}

      </p>

    </div>
  );
}


// ======================================================
// REVENUE CHART
// ======================================================

export default function RevenueChart({

  data = [],

}) {

  // ====================================================
  // VALIDATION
  // ====================================================

  const hasData =
    Array.isArray(data)

    &&

    data.length > 0;


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      bg-slate-900

      border
      border-slate-800

      rounded-2xl

      p-5

      shadow-lg

      w-full
      min-w-0

      overflow-hidden
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

      <div className="
        h-[350px]

        w-full
        min-w-0
      ">

        {hasData ? (

          <ResponsiveContainer

            width="100%"

            height={320}

          >

            <AreaChart

              data={data}

              margin={{

                top: 10,

                right: 10,

                left: -20,

                bottom: 0,
              }}
            >

              {/* ================================== */}
              {/* GRADIENT */}
              {/* ================================== */}

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
                    stopOpacity={0.45}
                  />

                  <stop
                    offset="95%"
                    stopColor="#10b981"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>


              {/* ================================== */}
              {/* GRID */}
              {/* ================================== */}

              <CartesianGrid

                strokeDasharray="3 3"

                stroke="#1e293b"

                vertical={false}

              />


              {/* ================================== */}
              {/* X AXIS */}
              {/* ================================== */}

              <XAxis

                dataKey="day"

                stroke="#94a3b8"

                tickLine={false}

                axisLine={false}

                fontSize={12}

              />


              {/* ================================== */}
              {/* Y AXIS */}
              {/* ================================== */}

              <YAxis

                stroke="#94a3b8"

                tickLine={false}

                axisLine={false}

                fontSize={12}

              />


              {/* ================================== */}
              {/* TOOLTIP */}
              {/* ================================== */}

              <Tooltip

                content={
                  <CustomTooltip />
                }

                cursor={{
                  stroke:
                    "#10b981",

                  strokeWidth: 1,

                  strokeDasharray:
                    "4 4",
                }}

              />


              {/* ================================== */}
              {/* AREA */}
              {/* ================================== */}

              <Area

                type="monotone"

                dataKey="revenue"

                stroke="#10b981"

                fillOpacity={1}

                fill="url(#revenueGradient)"

                strokeWidth={3}

                activeDot={{

                  r: 6,

                  stroke:
                    "#10b981",

                  strokeWidth: 2,

                  fill:
                    "#0f172a",
                }}

              />

            </AreaChart>

          </ResponsiveContainer>

        ) : (

          <EmptyState />

        )}

      </div>

    </div>
  );
}