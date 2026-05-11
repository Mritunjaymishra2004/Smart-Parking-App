import {
  useEffect,
  useState,
} from "react";

import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// ======================================================
// ANIMATED COUNTER
// ======================================================

function AnimatedValue({

  value,

}) {

  const [displayValue, setDisplayValue] =
    useState(0);

  useEffect(() => {

    let start = 0;

    const end =
      Number(
        String(value)
          .replace(/[₹,]/g, "")
      ) || 0;

    if (end === 0) {

      setDisplayValue(0);

      return;
    }

    const duration = 1000;

    const increment =
      end / (duration / 16);

    const counter =
      setInterval(() => {

        start += increment;

        if (start >= end) {

          clearInterval(counter);

          setDisplayValue(end);

        } else {

          setDisplayValue(
            Math.floor(start)
          );
        }

      }, 16);

    return () =>
      clearInterval(counter);

  }, [value]);

  // ====================================================
  // CURRENCY SUPPORT
  // ====================================================

  if (
    String(value).includes("₹")
  ) {

    return (
      <>
        ₹
        {displayValue.toLocaleString(
          "en-IN"
        )}
      </>
    );
  }

  return (
    displayValue.toLocaleString(
      "en-IN"
    )
  );
}

// ======================================================
// LOADING SKELETON
// ======================================================

function LoadingCard() {

  return (

    <div className="
      rounded-2xl
      border
      border-slate-800
      bg-slate-900/70
      p-6
      animate-pulse
      min-h-[140px]
    ">

      <div className="
        h-4
        w-24
        bg-slate-700
        rounded
        mb-5
      " />

      <div className="
        h-10
        w-32
        bg-slate-700
        rounded
      " />

    </div>
  );
}

// ======================================================
// STATS CARD
// ======================================================

export default function StatsCard({

  title,

  value = 0,

  color = "text-white",

  icon = null,

  trend = null,

  loading = false,

}) {

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return <LoadingCard />;
  }

  // ====================================================
  // TREND
  // ====================================================

  const positiveTrend =
    trend >= 0;

  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      relative
      overflow-hidden

      rounded-2xl

      border
      border-slate-800

      bg-slate-900/80
      backdrop-blur-xl

      p-5

      shadow-lg
      hover:shadow-emerald-500/10

      transition-all
      duration-300

      hover:-translate-y-1
      hover:border-emerald-500/20
    ">

      {/* ========================================== */}
      {/* BACKGROUND GLOW */}
      {/* ========================================== */}

      <div className="
        absolute
        inset-0
        bg-gradient-to-br
        from-emerald-500/5
        to-transparent
        pointer-events-none
      " />

      {/* ========================================== */}
      {/* TOP */}
      {/* ========================================== */}

      <div className="
        flex
        items-start
        justify-between
        mb-5
      ">

        {/* ====================================== */}
        {/* TITLE */}
        {/* ====================================== */}

        <div>

          <p className="
            text-slate-400
            text-xs
            uppercase
            tracking-wider
            font-medium
          ">

            {title}

          </p>

        </div>

        {/* ====================================== */}
        {/* ICON */}
        {/* ====================================== */}

        {icon && (

          <div className="
            w-11
            h-11
            rounded-xl
            bg-emerald-500/10
            text-emerald-400
            flex
            items-center
            justify-center
            border
            border-emerald-500/10
          ">

            {icon}

          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* VALUE */}
      {/* ========================================== */}

      <h2 className={`
        text-3xl
        md:text-4xl
        font-bold
        tracking-tight

        ${color}
      `}>

        <AnimatedValue
          value={value}
        />

      </h2>

      {/* ========================================== */}
      {/* TREND */}
      {/* ========================================== */}

      {trend !== null && (

        <div className="
          mt-4
          flex
          items-center
          gap-2
        ">

          <div className={`
            flex
            items-center
            gap-1

            px-2
            py-1

            rounded-lg

            text-xs
            font-medium

            ${
              positiveTrend

                ? `
                  bg-emerald-500/10
                  text-emerald-400
                `

                : `
                  bg-red-500/10
                  text-red-400
                `
            }
          `}>

            {positiveTrend ? (

              <TrendingUp
                size={14}
              />

            ) : (

              <TrendingDown
                size={14}
              />
            )}

            {Math.abs(trend)}%

          </div>

          <span className="
            text-xs
            text-slate-500
          ">
            vs last week
          </span>

        </div>
      )}

    </div>
  );
}








// export default function StatsCard({ title, value, color }) {
//   return (
//     <div className="glass p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
      
//       <p className="text-slate-400 text-sm uppercase tracking-wide">
//         {title}
//       </p>

//       <h2 className={`text-3xl font-bold mt-2 ${color}`}>
//         {value}
//       </h2>

//     </div>
//   );
// }