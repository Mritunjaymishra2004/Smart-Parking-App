export default function Table({

  columns = [],

  data = [],

}) {

  return (

    <div className="
      overflow-x-auto
    ">

      <table className="
        w-full
      ">

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
                "
              >

                {column}

              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {data.map((row, index) => (

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
          ))}

        </tbody>

      </table>

    </div>
  );
}