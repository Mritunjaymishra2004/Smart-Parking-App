export default function Modal({

  open,

  onClose,

  title,

  children,

}) {

  if (!open) return null;

  return (

    <div className="
      fixed
      inset-0
      bg-black/60
      flex
      items-center
      justify-center
      z-50
    ">

      <div className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        w-full
        max-w-lg
        p-6
      ">

        <div className="
          flex
          items-center
          justify-between
          mb-4
        ">

          <h2 className="
            text-xl
            font-bold
            text-white
          ">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              text-slate-400
              hover:text-white
            "
          >
            ✕
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}