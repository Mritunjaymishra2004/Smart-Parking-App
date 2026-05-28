import {
  useState,
} from "react";

import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Wifi,
  Save,
  Activity,
  Server,
  CheckCircle2,
} from "lucide-react";


// ======================================================
// TOGGLE CARD
// ======================================================

function SettingCard({
  icon,
  title,
  description,
  value,
  onChange,
}) {
  return (
    <div className="
      rounded-3xl
      bg-slate-900/70
      border border-white/10
      backdrop-blur-xl
      p-6
      flex items-center justify-between
      hover:border-emerald-500/20
      transition-all
    ">

      <div className="
        flex items-center gap-5
      ">

        <div className="
          w-14 h-14
          rounded-2xl
          bg-emerald-500/10
          text-emerald-400
          flex items-center justify-center
        ">
          {icon}
        </div>

        <div>
          <h3 className="
            text-lg
            font-semibold
            text-white
          ">
            {title}
          </h3>

          <p className="
            text-slate-400
            text-sm
            mt-1
          ">
            {description}
          </p>
        </div>

      </div>


      {/* TOGGLE */}
      <button
        onClick={onChange}
        className={`
          relative
          w-16 h-9
          rounded-full
          transition-all
          ${
            value
              ? "bg-emerald-500"
              : "bg-slate-700"
          }
        `}
      >
        <div
          className={`
            absolute
            top-1.5
            w-6 h-6
            bg-white
            rounded-full
            transition-all
            ${
              value
                ? "translate-x-8"
                : "translate-x-1"
            }
          `}
        />
      </button>

    </div>
  );
}


// ======================================================
// STATUS CARD
// ======================================================

function StatusCard({
  icon,
  title,
  status,
}) {
  return (
    <div className="
      rounded-3xl
      bg-slate-900/70
      border border-white/10
      p-6
      backdrop-blur-xl
    ">
      <div className="
        text-emerald-400
        mb-4
      ">
        {icon}
      </div>

      <h3 className="
        text-slate-400
      ">
        {title}
      </h3>

      <p className="
        text-xl
        font-semibold
        text-white
        mt-2
      ">
        {status}
      </p>
    </div>
  );
}


// ======================================================
// SETTINGS PAGE
// ======================================================

export default function Settings() {
  const [settings, setSettings] =
    useState({
      notifications: true,
      websocket: true,
      autoRefresh: true,
      maintenanceMode: false,
      logsEnabled: true,
    });

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveSettings = () => {
    alert(
      "System settings saved successfully"
    );
  };


  return (
    <div className="
      space-y-8
      pb-10
    ">

      {/* HERO */}
      <div className="
        rounded-3xl
        p-8
        bg-gradient-to-r
        from-emerald-500/10
        via-blue-500/10
        to-cyan-500/10
        border border-white/10
      ">
        <h1 className="
          text-5xl
          font-bold
          text-white
        ">
          System
          <span className="
            block
            text-emerald-400
          ">
            Configuration Center
          </span>
        </h1>

        <p className="
          mt-4
          text-slate-300
          text-lg
        ">
          Control and configure smart parking infrastructure
        </p>
      </div>


      {/* STATUS */}
      <div className="
        grid md:grid-cols-4 gap-6
      ">

        <StatusCard
          icon={<Server />}
          title="Server"
          status="Online"
        />

        <StatusCard
          icon={<Wifi />}
          title="Realtime Sync"
          status="Connected"
        />

        <StatusCard
          icon={<Database />}
          title="Database"
          status="Healthy"
        />

        <StatusCard
          icon={<CheckCircle2 />}
          title="System"
          status="Operational"
        />

      </div>


      {/* SETTINGS */}
      <div className="
        grid gap-5
      ">

        <SettingCard
          icon={<Bell />}
          title="Notifications"
          description="Enable admin system alerts"
          value={settings.notifications}
          onChange={() =>
            handleToggle(
              "notifications"
            )
          }
        />

        <SettingCard
          icon={<Wifi />}
          title="Realtime WebSocket"
          description="Enable live slot updates"
          value={settings.websocket}
          onChange={() =>
            handleToggle(
              "websocket"
            )
          }
        />

        <SettingCard
          icon={<Activity />}
          title="Auto Refresh"
          description="Refresh dashboard automatically"
          value={settings.autoRefresh}
          onChange={() =>
            handleToggle(
              "autoRefresh"
            )
          }
        />

        <SettingCard
          icon={<Shield />}
          title="Maintenance Mode"
          description="Temporarily restrict access"
          value={settings.maintenanceMode}
          onChange={() =>
            handleToggle(
              "maintenanceMode"
            )
          }
        />

        <SettingCard
          icon={<Database />}
          title="System Logs"
          description="Store activity logs"
          value={settings.logsEnabled}
          onChange={() =>
            handleToggle(
              "logsEnabled"
            )
          }
        />

      </div>


      {/* SAVE */}
      <div>
        <button
          onClick={saveSettings}
          className="
            px-8 py-4
            rounded-2xl
            bg-emerald-500
            hover:bg-emerald-400
            text-black
            font-semibold
            flex items-center gap-3
            transition-all
          "
        >
          <Save size={18} />
          Save Configuration
        </button>
      </div>

    </div>
  );
}