import DashboardLayout
from "../../components/common/DashboardLayout";

export default function SecuritySettings() {

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

          Security Settings

        </h1>


        <div className="
          bg-slate-900

          border
          border-slate-800

          rounded-3xl

          p-6

          space-y-5
        ">

          {[
            "Enable Two Factor Authentication",
            "Enable Device Tracking",
            "Session Timeout",
            "Login Attempt Limits",
            "IP Restriction",
            "Realtime Audit Logs",
          ].map((item) => (

            <div

              key={item}

              className="
                flex
                items-center
                justify-between

                border-b
                border-slate-800

                pb-4
              "
            >

              <p className="
                text-white
              ">

                {item}

              </p>

              <input
                type="checkbox"
                className="
                  w-5
                  h-5
                "
              />

            </div>
          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}