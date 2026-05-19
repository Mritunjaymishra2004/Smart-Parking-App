export default function SearchBar({

  value,

  onChange,

  placeholder = "Search...",

  className = "",

}) {

  return (

    <div className={`
      w-full
      ${className}
    `}>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="
          w-full
          bg-slate-900
          border
          border-slate-700
          text-white
          px-4
          py-3
          rounded-xl
          outline-none
          focus:border-emerald-500
          transition-all
        "
      />

    </div>
  );
}