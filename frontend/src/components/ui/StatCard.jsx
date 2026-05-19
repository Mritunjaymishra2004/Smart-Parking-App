export default function StatCard({

  title,

  value,

  subtitle,

  icon,

  color = "text-white",

}) {

  return (

    <div className="
      bg-slate-900
      border
      border-slate-800
      rounded-2xl
      p-5
      shadow-lg
    ">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="
        flex
        items-center
        justify-between
        mb-4
      ">

        <p className="
          text-slate-400
          text-sm
          font-medium
        ">
          {title}
        </p>

        {icon && (

          <div className="
            text-slate-400
          ">
            {icon}
          </div>
        )}

      </div>


      {/* ====================================== */}
      {/* VALUE */}
      {/* ====================================== */}

      <h2 className={`
        text-3xl
        font-bold
        ${color}
      `}>

        {value}

      </h2>


      {/* ====================================== */}
      {/* SUBTITLE */}
      {/* ====================================== */}

      {subtitle && (

        <p className="
          text-slate-500
          text-sm
          mt-2
        ">
          {subtitle}
        </p>
      )}

    </div>
  );
}