import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";


// ======================================================
// CONTEXT
// ======================================================

const NotificationContext =
  createContext(null);


// ======================================================
// PROVIDER
// ======================================================

export function NotificationProvider({
  children,
}) {

  const [
    notifications,
    setNotifications,
  ] = useState([]);


  // ====================================================
  // REMOVE
  // ====================================================

  const removeNotification =
    useCallback((id) => {

      setNotifications((prev) =>
        prev.filter(
          (n) => n.id !== id
        )
      );

    }, []);


  // ====================================================
  // ADD
  // ====================================================

  const addNotification =
    useCallback(({
      type = "info",
      title = "Notification",
      message = "",
      duration = 4000,
    }) => {

      const id =
        Date.now() +
        Math.random();

      const notification = {
        id,
        type,
        title,
        message,
        duration,
      };

      setNotifications((prev) => [
        ...prev,
        notification,
      ]);

      setTimeout(() => {
        removeNotification(id);
      }, duration);

    }, [removeNotification]);


  // ====================================================
  // CLEAR
  // ====================================================

  const clearNotifications =
    useCallback(() => {
      setNotifications([]);
    }, []);


  const markAllRead =
    useCallback(() => {}, []);


  // ====================================================
  // STYLES
  // ====================================================

  const getStyles = (type) => {

    switch (type) {

      case "success":
        return {
          container:
            "bg-emerald-900/90 border-emerald-500",
          icon:
            "text-emerald-400",
          component:
            <CheckCircle size={20} />,
          progress:
            "bg-emerald-400",
        };

      case "error":
        return {
          container:
            "bg-red-900/90 border-red-500",
          icon:
            "text-red-400",
          component:
            <AlertCircle size={20} />,
          progress:
            "bg-red-400",
        };

      default:
        return {
          container:
            "bg-blue-900/90 border-blue-500",
          icon:
            "text-blue-400",
          component:
            <Info size={20} />,
          progress:
            "bg-blue-400",
        };
    }
  };


  // ====================================================
  // VALUE
  // ====================================================

  const value =
    useMemo(() => ({
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
      markAllRead,
    }), [
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
      markAllRead,
    ]);


  return (
    <NotificationContext.Provider
      value={value}
    >

      {children}

      {/* TOASTS */}

      <div className="
        fixed
        top-5
        right-4
        z-[9999]
        flex
        flex-col
        gap-4
      ">

        {notifications.map(
          (notification) => {

            const styles =
              getStyles(
                notification.type
              );

            return (

              <div
                key={notification.id}
                className={`
                  relative
                  overflow-hidden
                  min-w-[340px]
                  rounded-2xl
                  border
                  backdrop-blur-xl
                  shadow-2xl
                  ${styles.container}
                `}
              >

                <div className="
                  flex
                  items-start
                  gap-4
                  px-5
                  py-4
                ">

                  <div className={styles.icon}>
                    {styles.component}
                  </div>

                  <div className="flex-1">

                    <h4 className="
                      text-sm
                      font-semibold
                      text-white
                    ">
                      {notification.title}
                    </h4>

                    <p className="
                      text-sm
                      text-slate-300
                      mt-1
                    ">
                      {notification.message}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      removeNotification(
                        notification.id
                      )
                    }
                  >
                    <X size={18} />
                  </button>

                </div>

                <div
                  className={`
                    h-[3px]
                    animate-shrink
                    ${styles.progress}
                  `}
                  style={{
                    animationDuration:
                      `${notification.duration}ms`,
                  }}
                />

              </div>
            );
          }
        )}

      </div>

      <style>
        {`
          @keyframes shrink {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }

          .animate-shrink {
            animation-name: shrink;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
            transform-origin: left;
          }
        `}
      </style>

    </NotificationContext.Provider>
  );
}


// ======================================================
// HOOK
// ======================================================

export function useNotification() {

  const context =
    useContext(
      NotificationContext
    );

  if (!context) {
    throw new Error(
      "useNotification must be used inside NotificationProvider"
    );
  }

  return context;
}