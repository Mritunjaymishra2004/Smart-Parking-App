import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  connectWebSocket,
  disconnectWebSocket,
} from "./websocketService";

const WebSocketContext =
  createContext(null);

// ======================================================
// PROVIDER
// ======================================================

export function WebSocketProvider({
  children,
}) {

  const [connected, setConnected] =
    useState(false);

  const [lastMessage, setLastMessage] =
    useState(null);
  
  useEffect(() => {

    const ws = connectWebSocket();

    return () => {

      disconnectWebSocket();
    };

  }, []);   


  // useEffect(() => {

  //   const socket =
  //     connectWebSocket(
  //       (data) => {

  //         setLastMessage(data);
  //       }
  //     );

  //   if (socket) {

  //     setConnected(true);
  //   }

  //   return () => {

  //     disconnectWebSocket();

  //     setConnected(false);
  //   };

  // }, []);

  return (

    <WebSocketContext.Provider
      value={{
        connected,
        lastMessage,
      }}
    >

      {children}

    </WebSocketContext.Provider>
  );
}

// ======================================================
// HOOK
// ======================================================

export const useWebSocket = () => {

  return useContext(
    WebSocketContext
  );
};