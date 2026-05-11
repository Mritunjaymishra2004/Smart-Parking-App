import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "leaflet/dist/leaflet.css";
import { ParkingProvider } from "./context/ParkingContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ParkingProvider>
        <App />
      </ParkingProvider>
    </AuthProvider>
  </BrowserRouter>
);