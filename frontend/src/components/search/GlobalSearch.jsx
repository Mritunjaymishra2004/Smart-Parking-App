import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


// ======================================================
// GLOBAL SEARCH
// ======================================================

export default function GlobalSearch({

  data = [],

  placeholder =
    "Search users, bookings, slots...",

}) {

  // ====================================================
  // HOOKS
  // ====================================================

  const navigate =
    useNavigate();

  const searchRef =
    useRef(null);


  // ====================================================
  // STATE
  // ====================================================

  const [query, setQuery] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [selectedIndex,
    setSelectedIndex] =
    useState(0);


  // ====================================================
  // FILTER RESULTS
  // ====================================================

  const results =
    useMemo(() => {

      if (!query.trim())
        return [];

      return data.filter(
        (item) => {

          const searchable =
            `
              ${item.name || ""}
              ${item.user || ""}
              ${item.email || ""}
              ${item.slot || ""}
              ${item.vehicle || ""}
              ${item.status || ""}
            `
              .toLowerCase();

          return searchable.includes(
            query.toLowerCase()
          );
        }
      );

    }, [query, data]);


  // ====================================================
  // KEYBOARD NAVIGATION
  // ====================================================

  useEffect(() => {

    const handleKeyDown =
      (e) => {

        if (!open)
          return;

        // DOWN
        if (e.key === "ArrowDown") {

          e.preventDefault();

          setSelectedIndex(
            (prev) =>

              prev <
              results.length - 1

                ? prev + 1

                : prev
          );
        }

        // UP
        if (e.key === "ArrowUp") {

          e.preventDefault();

          setSelectedIndex(
            (prev) =>

              prev > 0

                ? prev - 1

                : 0
          );
        }

        // ENTER
        if (e.key === "Enter") {

          const selected =
            results[selectedIndex];

          if (selected?.route) {

            navigate(
              selected.route
            );

            setOpen(false);

            setQuery("");
          }
        }

        // ESC
        if (e.key === "Escape") {

          setOpen(false);
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [

    open,

    results,

    selectedIndex,

    navigate,
  ]);


  // ====================================================
  // CLOSE ON OUTSIDE CLICK
  // ====================================================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (

          searchRef.current &&

          !searchRef.current.contains(
            event.target
          )

        ) {

          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  // ====================================================
  // CLEAR
  // ====================================================

  const clearSearch =
    () => {

      setQuery("");

      setOpen(false);

      setSelectedIndex(0);
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      ref={searchRef}
      className="
        relative
        w-full
        max-w-xl
      "
    >

      {/* ========================================== */}
      {/* SEARCH INPUT */}
      {/* ========================================== */}

      <div className="
        relative
      ">

        {/* SEARCH ICON */}

        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />


        {/* INPUT */}

        <input

          type="text"

          value={query}

          onChange={(e) => {

            setQuery(
              e.target.value
            );

            setOpen(true);

            setSelectedIndex(0);
          }}

          onFocus={() =>
            setOpen(true)
          }

          placeholder={placeholder}

          className="
            w-full

            bg-slate-900
            border
            border-slate-700

            text-white

            pl-11
            pr-12
            py-3

            rounded-2xl

            outline-none

            focus:border-emerald-500

            transition-all
          "
        />


        {/* CLEAR BUTTON */}

        {query && (

          <button

            onClick={clearSearch}

            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2

              text-slate-400
              hover:text-white

              transition
            "
          >

            <X size={18} />

          </button>
        )}

      </div>


      {/* ========================================== */}
      {/* RESULTS */}
      {/* ========================================== */}

      {open && query && (

        <div className="
          absolute
          top-full
          left-0
          right-0
          mt-2

          bg-slate-900/95
          backdrop-blur-xl

          border
          border-slate-800

          rounded-2xl

          shadow-2xl

          overflow-hidden

          z-50
        ">

          {/* ====================================== */}
          {/* NO RESULTS */}
          {/* ====================================== */}

          {results.length === 0 ? (

            <div className="
              px-5
              py-6
              text-center
              text-slate-400
            ">

              No results found

            </div>

          ) : (

            <div className="
              max-h-[400px]
              overflow-y-auto

              scrollbar-thin
              scrollbar-thumb-slate-700
            ">

              {results.map(
                (item, index) => (

                  <button

                    key={
                      item.id || index
                    }

                    onClick={() => {

                      if (item.route) {

                        navigate(
                          item.route
                        );

                        clearSearch();
                      }
                    }}

                    className={`
                      w-full

                      text-left

                      px-5
                      py-4

                      border-b
                      border-slate-800

                      transition-all

                      ${
                        selectedIndex ===
                        index

                          ? `
                            bg-emerald-500/10
                            text-emerald-400
                          `

                          : `
                            text-slate-300
                            hover:bg-slate-800/60
                          `
                      }
                    `}
                  >

                    {/* TITLE */}

                    <div className="
                      font-medium
                    ">

                      {item.name ||

                        item.user ||

                        item.slot ||

                        "Result"}

                    </div>


                    {/* META */}

                    <div className="
                      text-xs
                      text-slate-500
                      mt-1
                    ">

                      {item.email ||
                        item.vehicle ||
                        item.status ||
                        item.type}

                    </div>

                  </button>
                )
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
