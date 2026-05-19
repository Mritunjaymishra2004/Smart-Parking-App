import {
  useState,
  useEffect,
} from "react";

import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import Navbar from "./Navbar";

import Sidebar from "./Sidebar";


// ======================================================
// LOADER
// ======================================================

function Loader() {

  return (

    <div className="
      flex
      items-center
      justify-center

      min-h-[300px]
    ">

      <div className="
        w-12
        h-12

        border-4
        border-emerald-500
        border-t-transparent

        rounded-full

        animate-spin
      " />

    </div>
  );
}


// ======================================================
// DASHBOARD LAYOUT
// ======================================================

export default function DashboardLayout({

  children,

}) {

  // ====================================================
  // SIDEBAR STATE
  // ====================================================

  const [sidebarOpen,
    setSidebarOpen] =
    useState(false);

  const [collapsed,
    setCollapsed] =
    useState(false);

  const [mounted,
    setMounted] =
    useState(false);


  // ====================================================
  // INITIALIZE COLLAPSE
  // ====================================================

  useEffect(() => {

    try {

      const savedState =
        localStorage.getItem(
          "sidebar-collapsed"
        );

      setCollapsed(
        savedState === "true"
      );

    } catch (error) {

      console.error(
        "Sidebar localStorage error:",
        error
      );
    }

    setMounted(true);

  }, []);


  // ====================================================
  // SAVE COLLAPSE
  // ====================================================

  useEffect(() => {

    if (!mounted) {

      return;
    }

    try {

      localStorage.setItem(

        "sidebar-collapsed",

        collapsed
      );

    } catch (error) {

      console.error(
        "Sidebar save error:",
        error
      );
    }

  }, [

    collapsed,

    mounted,
  ]);


  // ====================================================
  // AUTO CLOSE MOBILE
  // ====================================================

  useEffect(() => {

    const handleResize =
      () => {

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
  // TOGGLE SIDEBAR
  // ====================================================

  const toggleCollapse =
    () => {

      setCollapsed(
        (prev) => !prev
      );
    };


  // ====================================================
  // LOADING
  // ====================================================

  if (!mounted) {

    return <Loader />;
  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      min-h-screen

      bg-gradient-to-br
      from-slate-950
      via-slate-900
      to-slate-950

      text-white
    ">

      {/* ========================================== */}
      {/* TOP NAVBAR */}
      {/* ========================================== */}

      <header className="
        sticky
        top-0
        z-40

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
          {/* LEFT ACTIONS */}
          {/* ==================================== */}

          <div className="
            flex
            items-center
          ">

            {/* MOBILE MENU */}

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


            {/* DESKTOP COLLAPSE */}

            <button

              onClick={
                toggleCollapse
              }

              className="
                hidden
                lg:flex

                items-center
                justify-center

                w-14
                h-14

                border-r
                border-slate-800

                text-slate-400
                hover:text-white

                transition
              "
            >

              {
                collapsed

                  ? (
                    <PanelLeftOpen
                      size={20}
                    />
                  )

                  : (
                    <PanelLeftClose
                      size={20}
                    />
                  )
              }

            </button>

          </div>


          {/* ==================================== */}
          {/* NAVBAR */}
          {/* ==================================== */}

          <div className="
            flex-1
            min-w-0
          ">

            <Navbar />

          </div>

        </div>

      </header>


      {/* ========================================== */}
      {/* MAIN BODY */}
      {/* ========================================== */}

      <div className="
        flex
        relative
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

              z-40

              bg-black/60
              backdrop-blur-sm

              lg:hidden
            "
          />
        )}


        {/* ====================================== */}
        {/* SIDEBAR */}
        {/* ====================================== */}

        <aside className={`

          fixed
          lg:sticky

          top-0
          left-0

          z-50

          h-screen

          transition-all
          duration-300
          ease-in-out

          ${
            collapsed

              ? "lg:w-24"

              : "lg:w-72"
          }

          ${
            sidebarOpen

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

            absolute
            top-0
            right-0
            z-50
          ">

            <button

              onClick={() =>
                setSidebarOpen(false)
              }

              className="
                text-slate-400
                hover:text-white

                transition
              "
            >

              <X size={24} />

            </button>

          </div>


          {/* ==================================== */}
          {/* SIDEBAR */}
          {/* ==================================== */}

          <Sidebar

            collapsed={collapsed}

            closeSidebar={() =>
              setSidebarOpen(false)
            }

          />

        </aside>


        {/* ====================================== */}
        {/* MAIN CONTENT */}
        {/* ====================================== */}

        <main className="
          flex-1
          min-w-0

          overflow-x-hidden
          overflow-y-auto
        ">

          {/* ==================================== */}
          {/* CONTENT */}
          {/* ==================================== */}

          <div className="
            p-4
            sm:p-6
            lg:p-8
          ">

            <div className="
              max-w-[1800px]
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