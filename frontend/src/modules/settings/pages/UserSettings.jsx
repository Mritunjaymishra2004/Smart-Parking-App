import DashboardLayout
from "../../components/common/DashboardLayout";

export default function UserSettings() {

  return (

    <DashboardLayout>

      <div className="
        max-w-4xl
        mx-auto
        space-y-6
      ">

        <h1 className="
          text-3xl
          font-bold
          text-white
        ">

          User Settings

        </h1>


        <div className="
          bg-slate-900

          border
          border-slate-800

          rounded-3xl

          p-6

          space-y-6
        ">

          <div>

            <label className="
              text-slate-300
              text-sm
            ">

              Full Name

            </label>

            <input
              className="
                w-full
                mt-2

                bg-slate-800

                border
                border-slate-700

                rounded-2xl

                px-4
                py-3

                text-white
              "
            />

          </div>


          <div>

            <label className="
              text-slate-300
              text-sm
            ">

              Email

            </label>

            <input
              className="
                w-full
                mt-2

                bg-slate-800

                border
                border-slate-700

                rounded-2xl

                px-4
                py-3

                text-white
              "
            />

          </div>


          <button className="
            px-6
            py-3

            rounded-2xl

            bg-emerald-500

            text-black
            font-semibold
          ">

            Save Changes

          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}