export default function ChartSkeleton({

  height = "350px",

}) {

  return (

    <div className="
      bg-slate-900
      border
      border-slate-800
      rounded-2xl
      p-5
      animate-pulse
    ">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="mb-6">

        <div className="
          h-6
          w-48
          bg-slate-800
          rounded
          mb-3
        " />

        <div className="
          h-4
          w-72
          bg-slate-800
          rounded
        " />

      </div>


      {/* ========================================== */}
      {/* CHART AREA */}
      {/* ========================================== */}

      <div
        style={{
          height,
        }}
        className="
          w-full
          bg-slate-800
          rounded-xl
        "
      />

    </div>
  );
}