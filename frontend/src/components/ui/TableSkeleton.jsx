export default function TableSkeleton({

  rows = 6,

  columns = 5,

}) {

  return (

    <div className="
      overflow-x-auto
      bg-slate-900
      border
      border-slate-800
      rounded-2xl
      p-4
    ">

      <table className="
        w-full
      ">

        <thead>

          <tr>

            {Array.from({
              length: columns,
            }).map((_, index) => (

              <th
                key={index}
                className="
                  p-4
                "
              >

                <div className="
                  h-4
                  w-24
                  bg-slate-800
                  rounded
                  animate-pulse
                " />

              </th>
            ))}

          </tr>

        </thead>


        <tbody>

          {Array.from({
            length: rows,
          }).map((_, rowIndex) => (

            <tr
              key={rowIndex}
              className="
                border-t
                border-slate-800
              "
            >

              {Array.from({
                length: columns,
              }).map((_, colIndex) => (

                <td
                  key={colIndex}
                  className="
                    p-4
                  "
                >

                  <div className="
                    h-4
                    w-full
                    max-w-[120px]
                    bg-slate-800
                    rounded
                    animate-pulse
                  " />

                </td>
              ))}

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}