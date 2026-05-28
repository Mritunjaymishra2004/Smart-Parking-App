export default function Modal({

  open,

  onClose,

  children,

}) {

  if (!open) {

    return null;
  }

  return (

    <div className="
      fixed
      inset-0

      z-50

      flex
      items-center
      justify-center

      bg-black/60
    ">

      <div className="
        bg-slate-900

        border
        border-slate-800

        rounded-2xl

        p-6

        w-full
        max-w-lg
      ">

        {children}

        <button

          onClick={onClose}

          className="
            mt-6

            px-4
            py-2

            rounded-xl

            bg-red-500/20

            text-red-400
          "
        >

          Close

        </button>

      </div>

    </div>
  );
}