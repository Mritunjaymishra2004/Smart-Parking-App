import DashboardLayout
from "../../components/common/DashboardLayout";

export default function ThemeSettings() {

  return (

    <DashboardLayout>

      <div className="
        max-w-5xl
        mx-auto
        space-y-6
      ">

        <h1 className="
          text-3xl
          font-bold
          text-white
        ">

          Theme Settings

        </h1>


        <div className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-5
        ">

          {[
            "Dark",
            "Light",
            "Emerald",
            "Blue",
          ].map((theme) => (

            <div

              key={theme}

              className="
                bg-slate-900

                border
                border-slate-800

                rounded-3xl

                p-6

                hover:border-emerald-500/30

                cursor-pointer
              "
            >

              <h2 className="
                text-white
                font-semibold
              ">

                {theme}

              </h2>

            </div>
          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}