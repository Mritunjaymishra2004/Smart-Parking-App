import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCarSide,
  FaParking,
  FaClipboardList,
  FaMoneyBillWave,
  FaQrcode,
  FaHistory,
} from "react-icons/fa";

export default function Sidebar() {
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
     ${
       isActive
         ? "bg-emerald-500/20 text-emerald-400"
         : "text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
     }`;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-full p-4 space-y-4">
      
      <NavLink to="/admin" className={navClass}>
        <FaTachometerAlt />
        Dashboard
      </NavLink>

      <NavLink to="/user" className={navClass}>
        <FaParking />
        Book Slot
      </NavLink>

      <NavLink to="/history" className={navClass}>
        <FaHistory />
        My Bookings
      </NavLink>

      <NavLink to="/gate" className={navClass}>
        <FaQrcode />
        Gate Scanner
      </NavLink>

      <NavLink to="/vehicles" className={navClass}>
        <FaCarSide />
        Vehicles
      </NavLink>

      <NavLink to="/payments" className={navClass}>
        <FaMoneyBillWave />
        Payments
      </NavLink>

    </aside>
  );
}

