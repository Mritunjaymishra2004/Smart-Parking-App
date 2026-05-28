import {
  Car,
} from "lucide-react";

export default function Loader({
  text = "Loading Smart Parking...",
  fullscreen = true,
}) {
  const wrapperClass =
    fullscreen
      ? "min-h-screen"
      : "min-h-[300px]";

  return (
    <div className={`
      ${wrapperClass}
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-950
      via-slate-900
      to-slate-950
      text-white
      relative
      overflow-hidden
    `}>

      {/* BACKGROUND GLOW */}
      <div className="
        absolute
        top-0 left-0
        w-72 h-72
        bg-emerald-500/10
        blur-[120px]
        rounded-full
      " />

      <div className="
        absolute
        bottom-0 right-0
        w-72 h-72
        bg-blue-500/10
        blur-[120px]
        rounded-full
      " />


      {/* LOADER CARD */}
      <div className="
        relative z-10
        flex flex-col
        items-center
        gap-6
        px-10 py-8
        rounded-3xl
        bg-slate-900/70
        backdrop-blur-xl
        border border-white/10
        shadow-2xl
      ">

        {/* ICON */}
        <div className="
          relative
          w-20 h-20
          flex items-center justify-center
        ">

          <div className="
            absolute inset-0
            rounded-full
            border-4
            border-emerald-500
            border-t-transparent
            animate-spin
          " />

          <div className="
            w-12 h-12
            rounded-2xl
            bg-gradient-to-br
            from-emerald-500
            to-blue-500
            flex items-center justify-center
            shadow-lg
          ">
            <Car size={22} />
          </div>

        </div>


        {/* TEXT */}
        <div className="text-center">

          <p className="
            text-lg
            font-semibold
          ">
            {text}
          </p>

          <p className="
            text-sm
            text-slate-400
            mt-2
          ">
            Initializing system...
          </p>

        </div>

      </div>

    </div>
  );
}