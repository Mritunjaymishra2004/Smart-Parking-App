import {
  Database,
} from "lucide-react";

export default function EmptyState({
  title = "No Data Found",
  description = "Nothing available right now.",
  icon = <Database size={40} />,
  action = null,
}) {
  return (
    <div className="
      flex
      items-center
      justify-center
      py-20
      px-6
    ">

      <div className="
        w-full
        max-w-xl
        rounded-3xl
        bg-slate-900/70
        border border-white/10
        backdrop-blur-xl
        p-10
        text-center
        shadow-2xl
        relative
        overflow-hidden
      ">

        {/* BACKGROUND GLOW */}
        <div className="
          absolute
          -top-10
          -right-10
          w-40 h-40
          rounded-full
          bg-emerald-500/10
          blur-3xl
        " />


        {/* ICON */}
        <div className="
          relative z-10
          w-20 h-20
          mx-auto
          rounded-3xl
          bg-gradient-to-br
          from-emerald-500/10
          to-blue-500/10
          border border-white/10
          flex items-center justify-center
          text-emerald-400
          mb-6
        ">
          {icon}
        </div>


        {/* TITLE */}
        <h2 className="
          text-3xl
          font-bold
          text-white
          relative z-10
        ">
          {title}
        </h2>


        {/* DESCRIPTION */}
        <p className="
          text-slate-400
          mt-4
          text-base
          relative z-10
          max-w-md
          mx-auto
        ">
          {description}
        </p>


        {/* ACTION */}
        {action && (
          <div className="
            mt-8
            relative z-10
          ">
            {action}
          </div>
        )}

      </div>

    </div>
  );
}