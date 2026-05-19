import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  CheckCheck,
  X,
} from "lucide-react";


// ======================================================
// NOTIFICATION DROPDOWN
// ======================================================

export default function NotificationDropdown({

  notifications = [],

  onClearAll,

  onMarkAllRead,

}) {

  // ====================================================
  // STATE
  // ====================================================

  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef(null);


  // ====================================================
  // UNREAD COUNT
  // ====================================================

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;


  // ====================================================
  // CLOSE OUTSIDE
  // ====================================================

  useEffect(() => {

    const handleClickOutside =
      (event) => {

        if (

          dropdownRef.current &&

          !dropdownRef.current.contains(
            event.target
          )

        ) {

          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);


  // ====================================================
  // FORMAT TIME
  // ====================================================

  const formatTime =
    (time) => {

      if (!time)
        return "";

      return new Date(time)
        .toLocaleTimeString();
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      ref={dropdownRef}
      className="
        relative
      "
    >

      {/* ========================================== */}
      {/* TRIGGER */}
      {/* ========================================== */}

      <button

        onClick={() =>
          setOpen(!open)
        }

        className="
          relative

          flex
          items-center
          justify-center

          w-11
          h-11

          rounded-xl

          border
          border-slate-700

          bg-slate-900/80
          hover:bg-slate-800

          text-slate-300
          hover:text-white

          transition-all
        "
      >

        <Bell size={18} />


        {/* BADGE */}

        {unreadCount > 0 && (

          <span className="
            absolute
            -top-1
            -right-1

            min-w-[20px]
            h-5

            px-1

            flex
            items-center
            justify-center

            rounded-full

            bg-red-500

            text-white
            text-[10px]
            font-bold
          ">

            {unreadCount}

          </span>
        )}

      </button>


      {/* ========================================== */}
      {/* DROPDOWN */}
      {/* ========================================== */}

      {open && (

        <div className="
          absolute
          right-0
          mt-3

          w-[360px]
          max-w-[90vw]

          bg-slate-900/95
          backdrop-blur-xl

          border
          border-slate-800

          rounded-2xl

          shadow-2xl

          overflow-hidden

          z-50
        ">

          {/* ====================================== */}
          {/* HEADER */}
          {/* ====================================== */}

          <div className="
            flex
            items-center
            justify-between

            px-5
            py-4

            border-b
            border-slate-800
          ">

            <div>

              <h3 className="
                text-white
                font-semibold
              ">
                Notifications
              </h3>

              <p className="
                text-xs
                text-slate-400
                mt-1
              ">

                {unreadCount}
                {" "}unread notifications

              </p>

            </div>


            {/* ACTIONS */}

            <div className="
              flex
              items-center
              gap-2
            ">

              <button

                onClick={
                  onMarkAllRead
                }

                className="
                  text-slate-400
                  hover:text-emerald-400

                  transition
                "

                title="Mark all as read"
              >

                <CheckCheck size={18} />

              </button>


              <button

                onClick={
                  onClearAll
                }

                className="
                  text-slate-400
                  hover:text-red-400

                  transition
                "

                title="Clear all"
              >

                <X size={18} />

              </button>

            </div>

          </div>


          {/* ====================================== */}
          {/* LIST */}
          {/* ====================================== */}

          <div className="
            max-h-[420px]
            overflow-y-auto

            scrollbar-thin
            scrollbar-thumb-slate-700
          ">

            {notifications.length === 0 ? (

              <div className="
                p-8
                text-center
                text-slate-400
              ">

                No notifications

              </div>

            ) : (

              notifications.map(
                (item) => (

                  <div

                    key={item.id}

                    className={`
                      px-5
                      py-4

                      border-b
                      border-slate-800

                      transition-all

                      ${
                        item.read

                          ? `
                            bg-transparent
                          `

                          : `
                            bg-emerald-500/5
                          `
                      }
                    `}
                  >

                    {/* TITLE */}

                    <div className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    ">

                      <h4 className="
                        text-sm
                        font-medium
                        text-white
                      ">

                        {item.title}

                      </h4>


                      {!item.read && (

                        <span className="
                          w-2
                          h-2

                          rounded-full

                          bg-emerald-400

                          mt-2
                          shrink-0
                        " />
                      )}

                    </div>


                    {/* MESSAGE */}

                    <p className="
                      text-sm
                      text-slate-400
                      mt-2
                    ">

                      {item.message}

                    </p>


                    {/* TIME */}

                    <p className="
                      text-xs
                      text-slate-500
                      mt-3
                    ">

                      {formatTime(
                        item.created_at
                      )}

                    </p>

                  </div>
                )
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}