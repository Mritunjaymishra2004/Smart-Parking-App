export default function DataTable({

  columns = [],

  data = [],

}) {

  return (

    <div className="
      overflow-x-auto

      rounded-2xl

      border
      border-slate-800

      bg-slate-900
    ">

      <table className="
        w-full
      ">

        {/* ====================================== */}
        {/* HEAD */}
        {/* ====================================== */}

        <thead className="
          bg-slate-800
        ">

          <tr>

            {columns.map((column) => (

              <th

                key={column}

                className="
                  px-6
                  py-4

                  text-left

                  text-slate-300
                  font-semibold
                "
              >

                {column}

              </th>

            ))}

          </tr>

        </thead>


        {/* ====================================== */}
        {/* BODY */}
        {/* ====================================== */}

        <tbody>

          {data.length > 0 ? (

            data.map(

              (row, index) => (

                <tr

                  key={index}

                  className="
                    border-t
                    border-slate-800

                    hover:bg-slate-800/40
                  "
                >

                  {Object.values(row).map(

                    (

                      value,

                      i

                    ) => (

                      <td

                        key={i}

                        className="
                          px-6
                          py-4

                          text-white
                        "
                      >

                        {value}

                      </td>
                    )
                  )}

                </tr>
              )
            )

          ) : (

            <tr>

              <td

                colSpan={
                  columns.length
                }

                className="
                  px-6
                  py-10

                  text-center

                  text-slate-400
                "
              >

                No data available

              </td>

            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}