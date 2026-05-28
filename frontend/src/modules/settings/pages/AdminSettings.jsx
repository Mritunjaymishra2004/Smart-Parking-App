import {
  Settings,
  Shield,
  Bell,
  Palette,
  Building2,
  ParkingCircle,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import DashboardLayout
from "../../components/common/DashboardLayout";


const cards = [

  {
    title: "Security Settings",
    icon: <Shield size={28} />,
    route: "/admin/settings/security",
  },

  {
    title: "Notification Settings",
    icon: <Bell size={28} />,
    route: "/admin/settings/notifications",
  },

  {
    title: "Theme Settings",
    icon: <Palette size={28} />,
    route: "/admin/settings/theme",
  },

  {
    title: "Company Settings",
    icon: <Building2 size={28} />,
    route: "/admin/settings/company",
  },

  {
    title: "Parking Settings",
    icon: <ParkingCircle size={28} />,
    route: "/admin/settings/parking",
  },
];


export default function AdminSettings() {

  return (

    <DashboardLayout>

      <div className="space-y-8">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-white
          ">

            Admin Settings

          </h1>

          <p className="
            text-slate-400
            mt-2
          ">

            Manage application controls,
            company settings,
            security,
            parking system,
            and more.

          </p>

        </div>


        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">

          {cards.map((card) => (

            <Link

              key={card.title}

              to={card.route}

              className="
                bg-slate-900

                border
                border-slate-800

                rounded-3xl

                p-6

                hover:border-emerald-500/30
                hover:bg-slate-800/60

                transition-all
              "
            >

              <div className="
                w-14
                h-14

                rounded-2xl

                bg-emerald-500/10

                flex
                items-center
                justify-center

                text-emerald-400

                mb-5
              ">

                {card.icon}

              </div>

              <h2 className="
                text-xl
                font-semibold
                text-white
              ">

                {card.title}

              </h2>

            </Link>
          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}