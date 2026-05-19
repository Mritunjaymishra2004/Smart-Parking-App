import Button from "./Button";


// ======================================================
// CONFIRM MODAL
// ======================================================

export default function ConfirmModal({

  open,

  onClose,

  onConfirm,

  title = "Confirm Action",

  message = "Are you sure?",

  confirmText = "Confirm",

  cancelText = "Cancel",

  loading = false,

  danger = false,

}) {

  // ====================================================
  // CLOSE IF NOT OPEN
  // ====================================================

  if (!open)
    return null;


  // ====================================================
  // BUTTON COLOR
  // ====================================================

  const confirmButtonStyle =

    danger

      ? `
        bg-red-600
        hover:bg-red-700
      `

      : `
        bg-emerald-600
        hover:bg-emerald-700
      `;


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      bg-black/60
      backdrop-blur-sm
      px-4
    ">

      {/* ========================================== */}
      {/* MODAL */}
      {/* ========================================== */}

      <div className="
        w-full
        max-w-md
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        shadow-2xl
        overflow-hidden
        animate-fadeIn
      ">

        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="
          px-6
          py-5
          border-b
          border-slate-800
        ">

          <h2 className="
            text-2xl
            font-bold
            text-white
          ">
            {title}
          </h2>

        </div>


        {/* ====================================== */}
        {/* CONTENT */}
        {/* ====================================== */}

        <div className="
          px-6
          py-6
        ">

          <p className="
            text-slate-300
            leading-relaxed
          ">
            {message}
          </p>

        </div>


        {/* ====================================== */}
        {/* ACTIONS */}
        {/* ====================================== */}

        <div className="
          px-6
          py-5
          border-t
          border-slate-800
          flex
          items-center
          justify-end
          gap-3
        ">

          {/* CANCEL */}

          <Button
            onClick={onClose}
            disabled={loading}
            className="
              bg-slate-700
              hover:bg-slate-600
              px-5
              py-2
            "
          >
            {cancelText}
          </Button>


          {/* CONFIRM */}

          <Button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-5
              py-2
              ${confirmButtonStyle}
            `}
          >

            {loading

              ? "Please wait..."

              : confirmText}

          </Button>

        </div>

      </div>

    </div>
  );
}