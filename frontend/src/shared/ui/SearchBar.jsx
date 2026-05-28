export default function SearchBar({

  value,

  onChange,

  placeholder = "Search...",

}) {

  return (

    <input

      type="text"

      value={value}

      onChange={onChange}

      placeholder={placeholder}

      className="
        w-full

        px-4
        py-3

        rounded-xl

        bg-slate-900

        border
        border-slate-700

        text-white

        outline-none

        focus:border-emerald-500
      "
    />
  );
}