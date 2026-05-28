import { useNavigate } from "react-router-dom";

import {
  Car,
  MapPinned,
  ShieldCheck,
  Wifi,
  BarChart3,
  ArrowRight,
  ParkingCircle,
  Users,
  Clock3,
} from "lucide-react";

export default function Landing() {
  const navigate =
    useNavigate();

  const features = [
    {
      icon: <MapPinned />,
      title:
        "Real-Time Slot Tracking",
      desc:
        "Monitor parking slot availability instantly.",
    },
    {
      icon: <Wifi />,
      title:
        "IoT Monitoring",
      desc:
        "Live sensor-based parking detection.",
    },
    {
      icon: <ShieldCheck />,
      title:
        "Secure Access",
      desc:
        "Role-based protected authentication.",
    },
    {
      icon: <BarChart3 />,
      title:
        "Analytics Dashboard",
      desc:
        "Smart insights for optimization.",
    },
  ];

  const stats = [
    {
      icon: <ParkingCircle />,
      value: "120+",
      label: "Parking Slots",
    },
    {
      icon: <Users />,
      value: "500+",
      label: "Active Users",
    },
    {
      icon: <Clock3 />,
      value: "24/7",
      label: "Monitoring",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10">

        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
              <Car />
            </div>

            <h1 className="text-2xl font-bold">
              Smart Parking
            </h1>

          </div>

          <div className="flex gap-4">

            <button
              onClick={() =>
                navigate("/login")
              }
              className="px-6 py-3 rounded-xl hover:bg-white/5"
            >
              Login
            </button>

            <button
              onClick={() =>
                navigate("/signup")
              }
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600"
            >
              Sign Up
            </button>

          </div>

        </div>
      </nav>


      {/* HERO */}
      <section className="relative px-8 py-28">

        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-[180px]" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
              Smart Parking
              <span className="block text-emerald-400">
                Management
              </span>
            </h1>

            <p className="text-slate-300 mt-8 text-xl leading-relaxed">
              IoT-powered intelligent parking
              system with real-time slot
              detection, live monitoring,
              analytics dashboard, and secure
              access management.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <button
                onClick={() =>
                  navigate("/login")
                }
                className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-semibold flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() =>
                  navigate("/signup")
                }
                className="px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5"
              >
                Register Now
              </button>

            </div>

          </div>


          {/* HERO VISUAL */}
          <div className="flex justify-center">

            <div className="relative">

              <div className="w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-2xl">
                <Car size={140} />
              </div>

              <div className="absolute -top-6 -right-6 px-5 py-3 rounded-2xl bg-slate-900 border border-white/10">
                Live IoT
              </div>

              <div className="absolute -bottom-6 -left-6 px-5 py-3 rounded-2xl bg-slate-900 border border-white/10">
                Real-Time Analytics
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* STATS */}
      <section className="px-8 py-14">

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-3xl bg-slate-900/70 border border-white/10 p-8 text-center"
            >
              <div className="text-emerald-400 flex justify-center mb-4">
                {stat.icon}
              </div>

              <h3 className="text-4xl font-bold">
                {stat.value}
              </h3>

              <p className="text-slate-400 mt-2">
                {stat.label}
              </p>

            </div>
          ))}

        </div>
      </section>


      {/* FEATURES */}
      <section className="py-20 px-8">

        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-bold text-center mb-16">
            Key Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {features.map(
              (
                feature,
                i
              ) => (
                <div
                  key={i}
                  className="rounded-3xl bg-slate-900/70 border border-white/10 p-8 hover:-translate-y-3 transition-all"
                >
                  <div className="text-emerald-400 mb-5">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-semibold mb-3">
                    {
                      feature.title
                    }
                  </h3>

                  <p className="text-slate-400">
                    {
                      feature.desc
                    }
                  </p>

                </div>
              )
            )}

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="py-24 px-8">

        <div className="max-w-5xl mx-auto text-center rounded-3xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-white/10 p-16">

          <h2 className="text-5xl font-bold">
            Ready to Experience Smart Parking?
          </h2>

          <p className="text-slate-300 mt-5 text-xl">
            Start using intelligent IoT parking today.
          </p>

          <button
            onClick={() =>
              navigate("/signup")
            }
            className="mt-8 px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-semibold"
          >
            Create Account
          </button>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="py-10 border-t border-white/10 text-center text-slate-400">
        Smart Parking System © 2026 | Final Year Project
      </footer>

    </div>
  );
}