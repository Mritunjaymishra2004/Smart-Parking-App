export default function Button({

  children,

  onClick,

  className = "",

  type = "button",

  disabled = false,

}) {

  return (

    <button

      type={type}

      onClick={onClick}

      disabled={disabled}

      className={`
        px-5
        py-3

        rounded-xl

        bg-emerald-500

        text-black
        font-semibold

        hover:bg-emerald-400

        transition-all

        disabled:opacity-50
        disabled:cursor-not-allowed

        ${className}
      `}
    >

      {children}

    </button>
  );
}