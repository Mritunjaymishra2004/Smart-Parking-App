export default function CardSkeleton({

  count = 4,

}) {

  return (

    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-5
    ">

      {Array.from({
        length: count,
      }).map((_, index) => (

        <div
          key={index}
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-5
            animate-pulse
          "
        >

          {/* TITLE */}

          <div className="
            h-4
            w-28
            bg-slate-800
            rounded
            mb-4
          " />


          {/* VALUE */}

          <div className="
            h-10
            w-20
            bg-slate-800
            rounded
            mb-3
          " />


          {/* SUBTITLE */}

          <div className="
            h-3
            w-40
            bg-slate-800
            rounded
          " />

        </div>
      ))}

    </div>
  );
}