import {

  createContext,

  useContext,

  useMemo,

  useState,

  useCallback,

} from "react";

import {

  CheckCircle2,

  AlertTriangle,

  Info,

  XCircle,

  X,

} from "lucide-react";


// ======================================================
// CONTEXT
// ======================================================

const NotificationContext =
  createContext();


// ======================================================
// MAX TOASTS
// ======================================================

const MAX_NOTIFICATIONS =
  5;


// ======================================================
// PROVIDER
// ======================================================

export const NotificationProvider = ({

  children,

}) => {

  // ====================================================
  // STATE
  // ====================================================

  const [notifications,
    setNotifications] =
    useState([]);


  // ====================================================
  // REMOVE NOTIFICATION
  // ====================================================

  const removeNotification =
    useCallback((id) => {

      setNotifications((prev) =>

        prev.filter(
          (notification) =>

            notification.id !== id
        )
      );

    }, []);


  // ====================================================
  // ADD NOTIFICATION
  // ====================================================

  const addNotification =
    useCallback(({

      message,

      type = "info",

      title = "",

      duration = 4000,

    }) => {

      const id =
        Date.now() +
        Math.random();

      const notification = {

        id,

        title,

        message,

        type,

        duration,

        createdAt:
          Date.now(),
      };

      setNotifications((prev) => {

        const updated = [

          notification,

          ...prev,
        ];

        return updated.slice(
          0,
          MAX_NOTIFICATIONS
        );
      });

      // ==============================================
      // AUTO REMOVE
      // ==============================================

      setTimeout(() => {

        removeNotification(id);

      }, duration);

    }, [removeNotification]);


  // ====================================================
  // SUCCESS
  // ====================================================

  const success =
    (
      message,

      title =
        "Success"
    ) => {

      addNotification({

        message,

        title,

        type:
          "success",
      });
    };


  // ====================================================
  // ERROR
  // ====================================================

  const error =
    (
      message,

      title =
        "Error"
    ) => {

      addNotification({

        message,

        title,

        type:
          "error",

        duration: 5000,
      });
    };


  // ====================================================
  // WARNING
  // ====================================================

  const warning =
    (
      message,

      title =
        "Warning"
    ) => {

      addNotification({

        message,

        title,

        type:
          "warning",
      });
    };


  // ====================================================
  // INFO
  // ====================================================

  const info =
    (
      message,

      title =
        "Information"
    ) => {

      addNotification({

        message,

        title,

        type:
          "info",
      });
    };


  // ====================================================
  // CLEAR ALL
  // ====================================================

  const clearAll =
    () => {

      setNotifications([]);
    };


  // ====================================================
  // TOAST STYLES
  // ====================================================

  const getToastStyles =
    (type) => {

      switch (type) {

        case "success":

          return {

            container: `
              border-emerald-500/30
              bg-emerald-500/10
            `,

            icon: `
              text-emerald-400
            `,

            progress: `
              bg-emerald-400
            `,
          };


        case "error":

          return {

            container: `
              border-red-500/30
              bg-red-500/10
            `,

            icon: `
              text-red-400
            `,

            progress: `
              bg-red-400
            `,
          };


        case "warning":

          return {

            container: `
              border-yellow-500/30
              bg-yellow-500/10
            `,

            icon: `
              text-yellow-400
            `,

            progress: `
              bg-yellow-400
            `,
          };


        default:

          return {

            container: `
              border-blue-500/30
              bg-blue-500/10
            `,

            icon: `
              text-blue-400
            `,

            progress: `
              bg-blue-400
            `,
          };
      }
    };


  // ====================================================
  // ICONS
  // ====================================================

  const getToastIcon =
    (type) => {

      switch (type) {

        case "success":

          return (
            <CheckCircle2
              size={22}
            />
          );

        case "error":

          return (
            <XCircle
              size={22}
            />
          );

        case "warning":

          return (
            <AlertTriangle
              size={22}
            />
          );

        default:

          return (
            <Info
              size={22}
            />
          );
      }
    };


  // ====================================================
  // MEMOIZED VALUE
  // ====================================================

  const value =
    useMemo(() => ({

      success,

      error,

      warning,

      info,

      addNotification,

      clearAll,

    }), [

      success,

      error,

      warning,

      info,

      addNotification,
    ]);


  // ====================================================
  // PROVIDER
  // ====================================================

  return (

    <NotificationContext.Provider
      value={value}
    >

      {children}


      {/* ========================================== */}
      {/* TOAST CONTAINER */}
      {/* ========================================== */}

      <div className="
        fixed
        top-5
        right-5

        z-[9999]

        flex
        flex-col
        gap-4

        w-[92vw]
        sm:w-auto

        pointer-events-none
      ">

        {notifications.map(
          (notification) => {

            const styles =
              getToastStyles(
                notification.type
              );

            return (

              <div

                key={notification.id}

                className={`
                  relative

                  overflow-hidden

                  min-w-[320px]
                  max-w-[420px]

                  rounded-2xl

                  border

                  backdrop-blur-xl

                  shadow-2xl

                  animate-slideIn

                  pointer-events-auto

                  ${styles.container}
                `}
              >

                {/* ============================== */}
                {/* CONTENT */}
                {/* ============================== */}

                <div className="
                  flex
                  items-start
                  gap-4

                  px-5
                  py-4
                ">

                  {/* ICON */}

                  <div className={`
                    mt-0.5
                    shrink-0

                    ${styles.icon}
                  `}>

                    {getToastIcon(
                      notification.type
                    )}

                  </div>


                  {/* BODY */}

                  <div className="
                    flex-1
                    min-w-0
                  ">

                    {/* TITLE */}

                    <h4 className="
                      text-sm
                      font-semibold
                      text-white
                      mb-1
                    ">

                      {notification.title}

                    </h4>


                    {/* MESSAGE */}

                    <p className="
                      text-sm
                      text-slate-300
                      leading-relaxed
                    ">

                      {notification.message}

                    </p>

                  </div>


                  {/* CLOSE */}

                  <button

                    onClick={() =>
                      removeNotification(
                        notification.id
                      )
                    }

                    className="
                      text-slate-400
                      hover:text-white

                      transition-all

                      shrink-0
                    "
                  >

                    <X size={18} />

                  </button>

                </div>


                {/* ============================== */}
                {/* PROGRESS BAR */}
                {/* ============================== */}

                <div className="
                  absolute
                  bottom-0
                  left-0

                  h-[3px]
                  w-full

                  bg-white/5
                ">

                  <div

                    className={`
                      h-full

                      animate-toastProgress

                      ${styles.progress}
                    `}

                    style={{
                      animationDuration:
                        `${notification.duration}ms`,
                    }}
                  />

                </div>

              </div>
            );
          }
        )}

      </div>

    </NotificationContext.Provider>
  );
};


// ======================================================
// HOOK
// ======================================================

export const useNotification =
  () => {

    const context =
      useContext(
        NotificationContext
      );

    if (!context) {

      throw new Error(

        "useNotification must be used within NotificationProvider"
      );
    }

    return context;
  };