import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import App from "./App";

import "./index.css";

import "leaflet/dist/leaflet.css";


// ======================================================
// CONTEXTS
// ======================================================

import {
  ThemeProvider,
} from "./context/ThemeContext";

import {
  NotificationProvider,
} from "./context/NotificationContext";

import {
  AuthProvider,
} from "./context/AuthContext";

import {
  WebSocketProvider,
} from "./websocket/WebSocketContext";

import {
  ParkingProvider,
} from "./context/ParkingContext";


// ======================================================
// ROOT
// ======================================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    {/* ========================================== */}
    {/* ROUTER */}
    {/* ========================================== */}

    <BrowserRouter

      future={{

        v7_startTransition: true,

        v7_relativeSplatPath: true,
      }}
    >

      {/* ====================================== */}
      {/* THEME */}
      {/* ====================================== */}

      <ThemeProvider>

        {/* ==================================== */}
        {/* NOTIFICATIONS */}
        {/* ==================================== */}

        <NotificationProvider>

          {/* ================================== */}
          {/* AUTH */}
          {/* ================================== */}

          <AuthProvider>

            {/* ================================ */}
            {/* WEBSOCKET */}
            {/* ================================ */}

            <WebSocketProvider>

              {/* ============================== */}
              {/* PARKING */}
              {/* ============================== */}

              <ParkingProvider>

                {/* ============================ */}
                {/* APP */}
                {/* ============================ */}

                <App />

              </ParkingProvider>

            </WebSocketProvider>

          </AuthProvider>

        </NotificationProvider>

      </ThemeProvider>

    </BrowserRouter>

  </React.StrictMode>
);