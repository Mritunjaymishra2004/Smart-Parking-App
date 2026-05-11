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
  AuthProvider,
} from "./context/AuthContext";

import {
  ParkingProvider,
} from "./context/ParkingContext";

import {
  WebSocketProvider,
} from "./websocket/WebSocketContext";

// ======================================================
// ROOT
// ======================================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  

    <BrowserRouter
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
>

      {/* ====================================== */}
      {/* SOCKET PROVIDER FIRST */}
      {/* ====================================== */}

      <WebSocketProvider>

        {/* ==================================== */}
        {/* AUTH */}
        {/* ==================================== */}

        <AuthProvider>

          {/* ================================== */}
          {/* PARKING */}
          {/* ================================== */}

          <ParkingProvider>

            <App />

          </ParkingProvider>

        </AuthProvider>

      </WebSocketProvider>

    </BrowserRouter>

  
);






// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import {
//   WebSocketProvider,
// } from "./websocket/WebSocketContext";
// import App from "./App";

// import { AuthProvider } from "./context/AuthContext";
// import { ParkingProvider } from "./context/ParkingContext";

// import "./index.css";

// import "leaflet/dist/leaflet.css";

// // ======================================================
// // ROOT RENDER
// // ======================================================

// ReactDOM.createRoot(
//   document.getElementById("root")
// ).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <ParkingProvider>
//           <WebSocketProvider>
//             <App />
//           </WebSocketProvider>
//         </ParkingProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );


// const {
//   lastMessage,
//   connected
// } = useWebSocket();




// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import { AuthProvider } from "./context/AuthContext";
// import "./index.css";
// import "leaflet/dist/leaflet.css";
// import { ParkingProvider } from "./context/ParkingContext";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <AuthProvider>
//       <ParkingProvider>
//         <App />
//       </ParkingProvider>
//     </AuthProvider>
//   </BrowserRouter>
// );