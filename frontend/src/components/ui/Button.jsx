export default function Button({

  children,

  onClick,

  type = "button",

  className = "",

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
        font-medium
        transition-all
        bg-blue-600
        hover:bg-blue-700
        text-white
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >

      {children}

    </button>
  );
}