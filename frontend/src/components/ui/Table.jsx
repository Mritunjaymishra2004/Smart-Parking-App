export default function Table({

  columns = [],

  data = [],

}) {

  return (

    <div className="
      overflow-x-auto
      bg-slate-900
      border
      border-slate-800
      rounded-2xl
    ">

      <table className="
        w-full
        text-left
        text-sm
      ">

        <thead className="
          bg-slate-800
          text-slate-300
        ">

          <tr>

            {columns.map(
              (column) => (

                <th
                  key={column}
                  className="p-4"
                >
                  {column}
                </th>
              )
            )}

          </tr>

        </thead>

        <tbody>

          {data.length === 0 ? (

            <tr>

              <td
                colSpan={columns.length}
                className="
                  text-center
                  p-6
                  text-slate-400
                "
              >
                No data found
              </td>

            </tr>

          ) : (

            data.map(
              (row, index) => (

                <tr
                  key={index}
                  className="
                    border-t
                    border-slate-800
                  "
                >

                  {Object.values(row).map(
                    (value, i) => (

                      <td
                        key={i}
                        className="
                          p-4
                          text-slate-300
                        "
                      >
                        {value}
                      </td>
                    )
                  )}

                </tr>
              )
            )
          )}

        </tbody>

      </table>

    </div>
  );
}