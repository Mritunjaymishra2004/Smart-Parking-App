import React from "react";

import AppRoutes
  from "./routes/AppRoutes";


// ======================================================
// APP
// ======================================================

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppRoutes />
    </div>
  );
}