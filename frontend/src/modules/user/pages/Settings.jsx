import React from "react";
import {
  Settings as SettingsIcon,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-emerald-500/10">
            <SettingsIcon
              size={32}
              className="text-emerald-400"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              User Settings
            </h1>

            <p className="text-slate-400">
              Manage your Smart Parking preferences
            </p>
          </div>
        </div>

        <div className="grid gap-6">

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">
              Account Settings
            </h2>

            <p className="text-slate-400">
              Profile settings and account preferences.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">
              Notification Settings
            </h2>

            <p className="text-slate-400">
              Configure booking and parking alerts.
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">
              Security Settings
            </h2>

            <p className="text-slate-400">
              Password and authentication options.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}