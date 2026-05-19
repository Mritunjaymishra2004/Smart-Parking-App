import Button from "./Button";


// ======================================================
// EMPTY STATE
// ======================================================

export default function EmptyState({

  title = "No Data Found",

  description =
    "There is nothing to display right now.",

  buttonText,

  onButtonClick,

}) {

  return (

    <div className="
      w-full
      flex
      flex-col
      items-center
      justify-center
      text-center
      py-16
      px-6
      bg-slate-900
      border
      border-slate-800
      rounded-2xl
    ">

      {/* ====================================== */}
      {/* ICON */}
      {/* ====================================== */}

      <div className="
        w-20
        h-20
        rounded-full
        bg-slate-800
        flex
        items-center
        justify-center
        text-4xl
        mb-6
      ">

        📭

      </div>


      {/* ====================================== */}
      {/* TITLE */}
      {/* ====================================== */}

      <h2 className="
        text-2xl
        font-bold
        text-white
        mb-2
      ">

        {title}

      </h2>


      {/* ====================================== */}
      {/* DESCRIPTION */}
      {/* ====================================== */}

      <p className="
        text-slate-400
        max-w-md
        mb-6
      ">

        {description}

      </p>


      {/* ====================================== */}
      {/* ACTION BUTTON */}
      {/* ====================================== */}

      {buttonText && (

        <Button
          onClick={onButtonClick}
          className="
            bg-emerald-600
            hover:bg-emerald-700
          "
        >

          {buttonText}

        </Button>
      )}

    </div>
  );
}