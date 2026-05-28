import {
  memo,
  useMemo,
} from "react";

function StatCard({
  title,
  value,
  icon,
  trend = "+12%",
  color = "emerald",
}) {
  const colorStyles = useMemo(() => ({
    emerald: {
      glow: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      trend: "text-emerald-300",
      shadow: "hover:shadow-emerald-500/10",
    },

    blue: {
      glow: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      trend: "text-blue-300",
      shadow: "hover:shadow-blue-500/10",
    },

    amber: {
      glow: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      trend: "text-amber-300",
      shadow: "hover:shadow-amber-500/10",
    },

    red: {
      glow: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      trend: "text-red-300",
      shadow: "hover:shadow-red-500/10",
    },
  }), []);

  const style =
    colorStyles[color] ||
    colorStyles.emerald;

  const isNegative =
    trend.startsWith("-");

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        ${style.border}
        bg-slate-900/70
        backdrop-blur-xl
        p-5 sm:p-6
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-2xl
        ${style.shadow}
        group
      `}
    >

      {/* GLOW */}
      <div
        className={`
          absolute
          -top-10
          -right-10
          w-32 h-32
          rounded-full
          blur-3xl
          ${style.glow}
          opacity-60
        `}
      />


      {/* CONTENT */}
      <div className="
        relative z-10
        flex items-center
        justify-between
        gap-4
      ">

        {/* TEXT */}
        <div className="min-w-0">

          <p className="
            text-slate-400
            text-sm
            font-medium
            tracking-wide
            truncate
          ">
            {title}
          </p>

          <h2 className="
            text-2xl sm:text-4xl
            font-bold
            text-white
            mt-3
            break-words
          ">
            {value}
          </h2>

          <p className={`
            mt-3
            text-sm
            font-medium
            ${
              isNegative
                ? "text-red-300"
                : style.trend
            }
          `}>
            {trend} this week
          </p>

        </div>


        {/* ICON */}
        <div
          className={`
            w-14 h-14 sm:w-16 sm:h-16
            rounded-2xl
            flex items-center justify-center
            text-2xl sm:text-3xl
            ${style.text}
            bg-white/5
            border border-white/10
            group-hover:scale-110
            transition-all
            duration-300
            shrink-0
          `}
        >
          {icon}
        </div>

      </div>


      {/* ACCENT */}
      <div
        className={`
          absolute
          bottom-0 left-0 right-0
          h-1
          ${style.glow}
        `}
      />

    </div>
  );
}

export default memo(
  StatCard
);