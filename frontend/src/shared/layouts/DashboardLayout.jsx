import {
  useState,
  useEffect,
  useCallback,
  memo,
} from "react";

import {
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import {
  useLocation,
} from "react-router-dom";

import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../ui/Loader";


// ======================================================
// STORAGE
// ======================================================

const getSidebarState = (key) => {
  try {
    return JSON.parse(
      localStorage.getItem(key) || "false"
    );
  } catch {
    return false;
  }
};


// ======================================================
// DASHBOARD LAYOUT
// ======================================================

function DashboardLayout({
  children,
}) {
  const location =
    useLocation();

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  const storageKey =
    isAdminRoute
      ? "admin-sidebar"
      : "user-sidebar";

  const [sidebarOpen,
    setSidebarOpen] =
    useState(false);

  const [collapsed,
    setCollapsed] =
    useState(false);

  const [mounted,
    setMounted] =
    useState(false);


  // INIT
  useEffect(() => {
    setCollapsed(
      getSidebarState(storageKey)
    );
    setMounted(true);
  }, [storageKey]);


  // SAVE
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      storageKey,
      JSON.stringify(collapsed)
    );
  }, [
    collapsed,
    mounted,
    storageKey,
  ]);


  // CLOSE MOBILE
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);


  const toggleCollapse =
    useCallback(() => {
      setCollapsed(
        (prev) => !prev
      );
    }, []);

  const openSidebar =
    useCallback(() => {
      setSidebarOpen(true);
    }, []);

  const closeSidebar =
    useCallback(() => {
      setSidebarOpen(false);
    }, []);


  const sidebarWidth =
    collapsed
      ? "lg:w-24"
      : "lg:w-72";

  const contentMargin =
    collapsed
      ? "lg:ml-24"
      : "lg:ml-72";


  if (!mounted) {
    return <Loader />;
  }


  return (
    <div className="
      min-h-screen
      w-full
      bg-slate-950
      text-white
      overflow-x-hidden
      flex
    ">

      {/* SIDEBAR */}
      <aside className={`
        fixed
        top-0
        left-0
        h-screen
        z-50
        ${sidebarWidth}
        bg-slate-900
        border-r border-white/10
        transition-all duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}>

        {/* MOBILE CLOSE */}
        <button
          onClick={closeSidebar}
          className="
            lg:hidden
            absolute top-4 right-4
          "
        >
          <X />
        </button>

        <Sidebar
          collapsed={collapsed}
          isAdmin={isAdminRoute}
          closeSidebar={closeSidebar}
        />

      </aside>


      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="
            fixed inset-0
            bg-black/60
            z-40 lg:hidden
          "
        />
      )}


      {/* MAIN */}
      <div className={`
        flex-1
        w-full
        transition-all duration-300
        ${contentMargin}
      `}>

        {/* HEADER */}
        <header className="
          sticky top-0
          z-30
          h-16
          bg-slate-900/95
          backdrop-blur-xl
          border-b border-white/10
          flex items-center
        ">

          {/* DESKTOP COLLAPSE */}
          <button
            onClick={toggleCollapse}
            className="
              hidden lg:flex
              w-16 h-full
              items-center
              justify-center
              border-r border-white/10
              hover:bg-white/5
            "
          >
            {collapsed
              ? <PanelLeftOpen />
              : <PanelLeftClose />}
          </button>

          <div className="flex-1">
            <Navbar
              toggleSidebar={openSidebar}
            />
          </div>

        </header>


        {/* PAGE CONTENT */}
        <main className="
          w-full
          min-h-[calc(100vh-64px)]
          px-6
          lg:px-10
          py-8
        ">
          {children}
        </main>

      </div>

    </div>
  );
}

export default memo(
  DashboardLayout
);