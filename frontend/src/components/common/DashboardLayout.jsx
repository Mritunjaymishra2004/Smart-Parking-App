import {
  useState,
  useEffect,
} from "react";

import {
  Menu,
  X,
} from "lucide-react";

import Navbar from "./Navbar";

import Sidebar from "./Sidebar";

// ======================================================
// DASHBOARD LAYOUT
// ======================================================

export default function DashboardLayout({

  children,

}) {

  // ====================================================
  // STATE
  // ====================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // ====================================================
  // AUTO CLOSE ON RESIZE
  // ====================================================

  useEffect(() => {

    const handleResize = () => {

      if (
        window.innerWidth >= 1024
      ) {

        setSidebarOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );
    };

  }, []);

  // ====================================================
  // BODY SCROLL LOCK
  // ====================================================

  useEffect(() => {

    if (sidebarOpen) {

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "auto";
    }

    return () => {

      document.body.style.overflow =
        "auto";
    };

  }, [sidebarOpen]);

  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      min-h-screen
      flex
      flex-col
      bg-gradient-to-br
      from-slate-950
      via-slate-900
      to-slate-950
      text-white
    ">

      {/* ========================================== */}
      {/* NAVBAR */}
      {/* ========================================== */}

      <header className="
        sticky
        top-0
        z-50
        backdrop-blur-xl
        bg-slate-900/70
        border-b
        border-slate-800
      ">

        <div className="
          flex
          items-center
          justify-between
        ">

          {/* ==================================== */}
          {/* MOBILE MENU BUTTON */}
          {/* ==================================== */}

          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="
              lg:hidden
              p-4
              text-slate-300
              hover:text-white
              transition
            "
          >

            <Menu size={24} />

          </button>

          {/* ==================================== */}
          {/* NAVBAR */}
          {/* ==================================== */}

          <div className="flex-1">

            <Navbar />

          </div>

        </div>

      </header>

      {/* ========================================== */}
      {/* BODY */}
      {/* ========================================== */}

      <div className="
        flex
        flex-1
        relative
        overflow-visible
      ">

        {/* ====================================== */}
        {/* MOBILE OVERLAY */}
        {/* ====================================== */}

        {sidebarOpen && (

          <div
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              fixed
              inset-0
              bg-black/60
              backdrop-blur-sm
              z-40
              lg:hidden
            "
          />
        )}

        {/* ====================================== */}
        {/* SIDEBAR */}
        {/* ====================================== */}

        <aside className={`
          fixed
          lg:static
          top-0
          left-0
          z-50
          h-full
          w-72
          bg-slate-900/95
          backdrop-blur-xl
          border-r
          border-slate-800
          transform
          transition-transform
          duration-300
          ease-in-out

          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
        `}>

          {/* ==================================== */}
          {/* MOBILE CLOSE */}
          {/* ==================================== */}

          <div className="
            flex
            justify-end
            lg:hidden
            p-4
          ">

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="
                text-slate-400
                hover:text-white
              "
            >

              <X size={24} />

            </button>

          </div>

          {/* ==================================== */}
          {/* SIDEBAR */}
          {/* ==================================== */}

          <Sidebar
            closeSidebar={() =>
              setSidebarOpen(false)
            }
          />

        </aside>

        {/* ====================================== */}
        {/* MAIN */}
        {/* ====================================== */}

        <main className="
          flex-1
          overflow-y-auto
          scrollbar-thin
          scrollbar-thumb-slate-700
          scrollbar-track-transparent
        ">

          {/* ==================================== */}
          {/* CONTENT WRAPPER */}
          {/* ==================================== */}

          <div className="
            p-4
            sm:p-6
            lg:p-8
          ">

            <div className="
              max-w-[1600px]
              mx-auto
              space-y-6
              animate-fadeIn
            ">

              {children}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}












// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";

// export default function DashboardLayout({ children }) {
//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

//       {/* Sticky Navbar */}
//       <div className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/70 border-b border-slate-800">
//         <Navbar />
//       </div>

//       {/* Body */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* Sidebar with border */}
//         <div className="border-r border-slate-800 bg-slate-900/80 backdrop-blur-md">
//           <Sidebar />
//         </div>

//         {/* Main Content */}
//         <main className="flex-1 overflow-y-auto p-6">

//           {/* Container */}
//           <div className="max-w-7xl mx-auto space-y-6">
//             {children}
//           </div>

//         </main>

//       </div>
//     </div>
//   );
// }