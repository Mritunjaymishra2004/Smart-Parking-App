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
  useLocation,
} from "react-router-dom";


// ======================================================
// SEARCH DATA
// ======================================================

const defaultData = [
  {
    id: 1,
    name: "User Dashboard",
    route: "/user/dashboard",
    type: "User",
  },
  {
    id: 2,
    name: "Parking Slots",
    route: "/user/slots",
    type: "User",
  },
  {
    id: 3,
    name: "Bookings",
    route: "/user/bookings",
    type: "User",
  },
  {
    id: 4,
    name: "Vehicles",
    route: "/user/vehicles",
    type: "User",
  },
  {
    id: 5,
    name: "Admin Dashboard",
    route: "/admin/dashboard",
    type: "Admin",
  },
  {
    id: 6,
    name: "Analytics",
    route: "/admin/analytics",
    type: "Admin",
  },
  {
    id: 7,
    name: "Users",
    route: "/admin/users",
    type: "Admin",
  },
  {
    id: 8,
    name: "Reports",
    route: "/admin/reports",
    type: "Admin",
  },
];


// ======================================================
// COMPONENT
// ======================================================

export default function GlobalSearch({
  data = defaultData,
  placeholder = "Search pages...",
}) {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const searchRef =
    useRef(null);

  const inputRef =
    useRef(null);

  const [query, setQuery] =
    useState("");

  const [open, setOpen] =
    useState(false);

  const [selectedIndex, setSelectedIndex] =
    useState(0);


  // ====================================================
  // FILTER RESULTS
  // ====================================================

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lower =
      query.toLowerCase();

    return data.filter((item) =>
      `${item.name} ${item.type} ${item.route}`
        .toLowerCase()
        .includes(lower)
    );
  }, [query, data]);


  // ====================================================
  // CLEAR SEARCH
  // ====================================================

  const clearSearch = () => {
    setQuery("");
    setOpen(false);
    setSelectedIndex(0);
  };


  // ====================================================
  // NAVIGATION
  // ====================================================

  const goToResult = (item) => {
    if (!item?.route) return;

    navigate(item.route);
    clearSearch();
  };


  // ====================================================
  // AUTO CLOSE ON ROUTE CHANGE
  // ====================================================

  useEffect(() => {
    clearSearch();
  }, [location.pathname]);


  // ====================================================
  // AUTO FOCUS
  // ====================================================

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);


  // ====================================================
  // KEYBOARD NAVIGATION
  // ====================================================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;

      if (
        e.key === "ArrowDown"
      ) {
        e.preventDefault();

        setSelectedIndex((prev) =>
          Math.min(
            prev + 1,
            results.length - 1
          )
        );
      }

      if (
        e.key === "ArrowUp"
      ) {
        e.preventDefault();

        setSelectedIndex((prev) =>
          Math.max(prev - 1, 0)
        );
      }

      if (
        e.key === "Enter" &&
        results[selectedIndex]
      ) {
        goToResult(
          results[selectedIndex]
        );
      }

      if (
        e.key === "Escape"
      ) {
        setOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    open,
    results,
    selectedIndex,
  ]);


  // ====================================================
  // CLOSE OUTSIDE
  // ====================================================

  useEffect(() => {
    const handleOutside =
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
      handleOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
  }, []);


  return (
    <div
      ref={searchRef}
      className="relative w-full max-w-md"
    >
      {/* SEARCH INPUT */}
      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            const value =
              e.target.value;

            setQuery(value);
            setOpen(
              value.trim().length > 0
            );
            setSelectedIndex(0);
          }}
          className="w-full bg-slate-900 border border-slate-700 text-white pl-11 pr-12 py-3 rounded-2xl outline-none focus:border-emerald-500"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}

      </div>


      {/* RESULTS */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">

          {results.length === 0 ? (
            <div className="px-5 py-6 text-center text-slate-400">
              No results found
            </div>
          ) : (
            results.map(
              (
                item,
                index
              ) => (
                <button
                  key={item.id}
                  onClick={() =>
                    goToResult(item)
                  }
                  className={`w-full text-left px-5 py-4 border-b border-slate-800 ${
                    selectedIndex === index
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div className="font-medium">
                    {item.name}
                  </div>

                  <div className="text-xs text-slate-500">
                    {item.type}
                  </div>
                </button>
              )
            )
          )}

        </div>
      )}
    </div>
  );
}