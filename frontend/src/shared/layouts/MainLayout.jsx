import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Car,
  Menu,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

export default function MainLayout({
  children,
}) {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const navLinks = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Login",
      path: "/login",
    },
    {
      label: "Signup",
      path: "/signup",
    },
  ];

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-slate-950
      via-slate-900
      to-slate-950
      text-white
      overflow-x-hidden
    ">

      {/* BACKGROUND EFFECT */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[180px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[180px] rounded-full" />


      {/* NAVBAR */}
      <header className="
        sticky
        top-0
        z-50
        backdrop-blur-xl
        bg-slate-900/80
        border-b border-white/10
      ">
        <div className="
          max-w-7xl
          mx-auto
          px-6
          h-20
          flex
          items-center
          justify-between
        ">

          {/* LOGO */}
          <button
            onClick={() =>
              navigate("/")
            }
            className="
              flex
              items-center
              gap-3
              font-bold
              text-xl
            "
          >
            <div className="
              w-12 h-12
              rounded-2xl
              bg-gradient-to-br
              from-emerald-500
              to-blue-500
              flex items-center justify-center
            ">
              <Car size={24} />
            </div>

            Smart Parking
          </button>


          {/* DESKTOP NAV */}
          <nav className="
            hidden lg:flex
            items-center
            gap-8
          ">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() =>
                  navigate(link.path)
                }
                className={`
                  transition
                  ${
                    location.pathname ===
                    link.path
                      ? "text-emerald-400"
                      : "text-slate-300 hover:text-white"
                  }
                `}
              >
                {link.label}
              </button>
            ))}
          </nav>


          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden"
            onClick={() =>
              setMenuOpen(
                !menuOpen
              )
            }
          >
            {menuOpen
              ? <X />
              : <Menu />}
          </button>

        </div>


        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="
            lg:hidden
            px-6
            pb-6
            space-y-4
          ">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-slate-300 hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}

      </header>


      {/* CONTENT */}
      <main className="
        relative
        min-h-[calc(100vh-80px)]
      ">
        {children}
      </main>


      {/* FOOTER */}
      <footer className="
        border-t border-white/10
        py-8
        text-center
        text-slate-400
      ">
        Smart Parking System © 2026
      </footer>

    </div>
  );
}