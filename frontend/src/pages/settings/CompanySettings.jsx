import DashboardLayout
from "../../components/common/DashboardLayout";

export default function CompanySettings() {

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

          Company Settings

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
            "Company Name",
            "Support Email",
            "Phone Number",
            "Address",
            "GST Number",
          ].map((item) => (

            <div key={item}>

              <label className="
                text-slate-300
                text-sm
              ">

                {item}

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
          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}