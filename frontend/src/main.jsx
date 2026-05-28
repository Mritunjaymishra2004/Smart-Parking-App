import React, {
  StrictMode,
} from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import App from "./App";

import "./index.css";
import "leaflet/dist/leaflet.css";

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
  ParkingProvider,
} from "./context/ParkingContext";

import {
  WebSocketProvider,
} from "./context/WebSocketContext";

import {
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";


// ======================================================
// ERROR BOUNDARY
// ======================================================

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error,
    errorInfo
  ) {
    console.error(
      "Application Error:",
      error,
      errorInfo
    );
  }

  reloadApp = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="
          min-h-screen
          bg-gradient-to-br
          from-slate-950
          via-slate-900
          to-slate-950
          text-white
          flex
          items-center
          justify-center
          px-6
        ">
          <div className="
            max-w-lg
            w-full
            rounded-3xl
            bg-slate-900/80
            border border-red-500/20
            backdrop-blur-xl
            p-10
            text-center
            shadow-2xl
          ">

            <div className="
              w-20 h-20
              mx-auto
              rounded-3xl
              bg-red-500/10
              flex items-center justify-center
              mb-6
            ">
              <AlertTriangle
                size={40}
                className="text-red-400"
              />
            </div>

            <h1 className="text-3xl font-bold text-red-400">
              Application Error
            </h1>

            <p className="text-slate-400 mt-4">
              Something went wrong in Smart Parking System.
            </p>

            <button
              onClick={this.reloadApp}
              className="
                mt-8
                px-6 py-3
                rounded-2xl
                bg-emerald-500
                hover:bg-emerald-600
                transition
                font-semibold
                flex items-center gap-2
                mx-auto
              "
            >
              <RefreshCcw size={18} />
              Restart App
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


// ======================================================
// PROVIDERS
// ======================================================

function RootProviders() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <WebSocketProvider>
              <ParkingProvider>
                <App />
              </ParkingProvider>
            </WebSocketProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}


// ======================================================
// ROOT
// ======================================================

const rootElement =
  document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found"
  );
}


// ======================================================
// RENDER
// ======================================================

ReactDOM.createRoot(
  rootElement
).render(
  <StrictMode>
    <ErrorBoundary>
      <RootProviders />
    </ErrorBoundary>
  </StrictMode>
);