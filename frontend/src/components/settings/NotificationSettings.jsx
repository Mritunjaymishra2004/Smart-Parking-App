import DashboardLayout
from "../../components/common/DashboardLayout";

export default function NotificationSettings() {

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

          Notification Settings

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
            "Email Alerts",
            "SMS Alerts",
            "Violation Alerts",
            "Realtime Notifications",
            "Booking Notifications",
            "Revenue Notifications",
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