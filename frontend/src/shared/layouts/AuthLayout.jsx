import {
  ShieldCheck,
  Car,
  Wifi,
  MapPinned,
} from "lucide-react";

export default function AuthLayout({
  children,
}) {
  return (
    <div className="
      min-h-screen
      overflow-hidden
      bg-[#020617]
      text-white
      relative
    ">

      {/* BACKGROUND */}
      <div className="
        absolute inset-0
        bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),transparent_35%)]
      " />

      {/* GRID */}
      <div className="
        relative z-10
        min-h-screen
        grid
        lg:grid-cols-2
      ">

        {/* LEFT */}
        <div className="
          hidden lg:flex
          flex-col
          justify-center
          px-20
          xl:px-28
        ">

          <div className="
            max-w-2xl
          ">

            {/* LOGO */}
            <div className="
              w-28 h-28
              rounded-[32px]
              bg-gradient-to-br
              from-emerald-400
              to-blue-500
              flex items-center justify-center
              shadow-[0_20px_80px_rgba(16,185,129,0.35)]
              mb-10
            ">
              <Car size={48} />
            </div>

            {/* TITLE */}
            <h1 className="
              text-6xl
              xl:text-7xl
              font-black
              leading-[1.05]
              tracking-tight
            ">
              Smart Parking
              <span className="
                block
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-emerald-400
                to-cyan-400
              ">
                Control System
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="
              mt-8
              text-xl
              text-slate-300
              leading-relaxed
              max-w-xl
            ">
              Intelligent IoT-powered parking
              management platform with
              real-time monitoring,
              live analytics and secure
              automated vehicle tracking.
            </p>

            {/* FEATURES */}
            <div className="
              mt-14
              grid
              gap-5
            ">

              <div className="
                flex items-center gap-4
                text-emerald-300
              ">
                <div className="
                  w-12 h-12
                  rounded-2xl
                  bg-emerald-500/10
                  border border-emerald-500/20
                  flex items-center justify-center
                ">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Secure Authentication
                  </h3>

                  <p className="text-sm text-slate-400">
                    JWT protected access control
                  </p>
                </div>
              </div>


              <div className="
                flex items-center gap-4
                text-cyan-300
              ">
                <div className="
                  w-12 h-12
                  rounded-2xl
                  bg-cyan-500/10
                  border border-cyan-500/20
                  flex items-center justify-center
                ">
                  <Wifi size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Live Monitoring
                  </h3>

                  <p className="text-sm text-slate-400">
                    Real-time parking updates
                  </p>
                </div>
              </div>


              <div className="
                flex items-center gap-4
                text-amber-300
              ">
                <div className="
                  w-12 h-12
                  rounded-2xl
                  bg-amber-500/10
                  border border-amber-500/20
                  flex items-center justify-center
                ">
                  <MapPinned size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Smart Slot Detection
                  </h3>

                  <p className="text-sm text-slate-400">
                    Intelligent occupancy tracking
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>


        {/* RIGHT */}
        <div className="
          flex
          items-center
          justify-center
          px-6
          lg:px-16
          py-10
        ">

          <div className="
            w-full
            max-w-md
            relative
          ">

            {/* GLOW */}
            <div className="
              absolute
              -inset-2
              rounded-[36px]
              bg-gradient-to-r
              from-emerald-500/20
              to-blue-500/20
              blur-2xl
            " />

            {/* CARD */}
            <div className="
              relative
              rounded-[32px]
              border border-white/10
              bg-slate-900/80
              backdrop-blur-2xl
              shadow-2xl
              p-8
            ">
              {children}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}