import {

  useEffect,

  useState,

  useMemo,

  useCallback,

  useRef,

} from "react";

import api from "../../services/api";

import {
  connectSocket,
} from "../../utils/socket";

import Navbar
from "../../components/common/Navbar";

import DashboardBackground
from "../../components/common/DashboardBackground";

import {

  AlertTriangle,

  ShieldCheck,

  Clock3,

  IndianRupee,

  RefreshCcw,

} from "lucide-react";


// ======================================================
// SAFE ARRAY
// ======================================================

const safeArray =
  (value) => {

    if (
      Array.isArray(value)
    ) {

      return value;
    }

    if (
      Array.isArray(
        value?.results
      )
    ) {

      return value.results;
    }

    if (
      Array.isArray(
        value?.data
      )
    ) {

      return value.data;
    }

    return [];
  };


// ======================================================
// COMPONENT
// ======================================================

export default function AdminViolations() {

  // ====================================================
  // STATE
  // ====================================================

  const [violations,
    setViolations] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState("");

  const [message,
    setMessage] =
    useState("");

  const loadingRef =
    useRef(false);


  // ====================================================
  // LOAD VIOLATIONS
  // ====================================================

  const loadViolations =
    useCallback(async () => {

      if (
        loadingRef.current
      ) {

        return;
      }

      loadingRef.current =
        true;

      try {

        setError("");

        const response =
          await api.get(
            "/admin/violations/"
          );

        const data =
          safeArray(
            response.data
          );

        setViolations(data);

      } catch (error) {

        console.error(
          "Violation load error:",
          error
        );

        setError(
          "Using demo violation data"
        );

        setViolations([

          {
            id: 1,

            slot_code: "A1",

            vehicle_plate:
              "DL01AB1234",

            minutes: 22,

            fine: 220,

            resolved: false,

            session: "S1",

            type: "OVERSTAY",

            created_at:
              Date.now(),
          },
        ]);

      } finally {

        loadingRef.current =
          false;

        setLoading(false);
      }

    }, []);


  // ====================================================
  // INITIAL LOAD + POLLING
  // ====================================================

  useEffect(() => {

    loadViolations();

    const interval =
      setInterval(() => {

        loadViolations();

      }, 10000);

    return () => {

      clearInterval(
        interval
      );
    };

  }, [loadViolations]);


  // ====================================================
  // WEBSOCKET
  // ====================================================

  useEffect(() => {

    const disconnect =
      connectSocket(
        (msg) => {

          if (
            msg?.type !==
            "violation"
          ) {

            return;
          }

          const incoming =
            msg?.data;

          if (!incoming) {

            return;
          }

          setViolations(
            (prev) => {

              const exists =
                prev.some(
                  (v) =>

                    v.id ===
                    incoming.id
                );

              if (exists) {

                return prev;
              }

              return [

                incoming,

                ...prev,
              ];
            }
          );

          setMessage(
            `Violation detected for ${incoming.vehicle_plate}`
          );
        }
      );

    return () => {

      if (
        typeof disconnect ===
        "function"
      ) {

        disconnect();
      }
    };

  }, []);


  // ====================================================
  // AUTO CLEAR MESSAGE
  // ====================================================

  useEffect(() => {

    if (!message) {

      return;
    }

    const timer =
      setTimeout(() => {

        setMessage("");

      }, 3000);

    return () => {

      clearTimeout(timer);
    };

  }, [message]);


  // ====================================================
  // FORCE EXIT
  // ====================================================

  const forceExit =
    useCallback(async (
      violation
    ) => {

      try {

        await api.post(

          "/admin/force-exit/",

          {
            session:
              violation.session,
          }
        );

        setMessage(
          `Vehicle ${violation.vehicle_plate} removed`
        );

        setViolations(
          (prev) =>

            prev.map((v) =>

              v.id === violation.id

                ? {

                    ...v,

                    resolved: true,
                  }

                : v
            )
        );

      } catch (error) {

        console.error(
          "Force exit error:",
          error
        );

        setMessage(
          `Simulated force exit for ${violation.vehicle_plate}`
        );

        setViolations(
          (prev) =>

            prev.map((v) =>

              v.id === violation.id

                ? {

                    ...v,

                    resolved: true,
                  }

                : v
            )
        );
      }

    }, []);


  // ====================================================
  // SORTED VIOLATIONS
  // ====================================================

  const sortedViolations =
    useMemo(() => {

      return [

        ...safeArray(
          violations
        ),

      ].sort(

        (a, b) => (

          new Date(
            b.created_at || 0
          )

          -

          new Date(
            a.created_at || 0
          )
        )
      );

    }, [violations]);


  // ====================================================
  // STATS
  // ====================================================

  const unresolvedCount =
    sortedViolations.filter(
      (v) => !v.resolved
    ).length;

  const totalFine =
    sortedViolations.reduce(
      (sum, v) =>

        sum + (
          Number(v.fine) || 0
        ),

      0
    );


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-950
        text-white
      ">

        Loading violations...

      </div>
    );
  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <>

      <Navbar />

      <DashboardBackground>

        <div className="
          min-h-screen
          text-white
          p-6
        ">

          {/* HEADER */}

          <div className="
            flex
            flex-col
            xl:flex-row
            xl:items-center
            xl:justify-between
            gap-5
            mb-8
          ">

            <div>

              <h1 className="
                text-3xl
                font-bold
              ">

                Live Parking Violations

              </h1>

              <p className="
                text-slate-400
                mt-2
              ">

                Realtime violation monitoring and enforcement

              </p>

            </div>

            <button

              type="button"

              onClick={
                loadViolations
              }

              className="
                flex
                items-center
                gap-2

                bg-slate-800
                hover:bg-slate-700

                px-4
                py-2

                rounded-xl
              "
            >

              <RefreshCcw
                size={16}
              />

              Refresh

            </button>

          </div>


          {/* MESSAGE */}

          {message && (

            <div className="
              bg-emerald-500/10
              border
              border-emerald-500/20
              text-emerald-400

              px-4
              py-3

              rounded-xl

              mb-6
            ">

              {message}

            </div>
          )}


          {/* ERROR */}

          {error && (

            <div className="
              bg-yellow-500/10
              border
              border-yellow-500/20
              text-yellow-400

              px-4
              py-3

              rounded-xl

              mb-6
            ">

              {error}

            </div>
          )}


          {/* STATS */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-5
            mb-8
          ">

            <div className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-5
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <AlertTriangle
                  className="
                    text-red-400
                  "
                />

                <div>

                  <p className="
                    text-slate-400
                    text-sm
                  ">

                    Active Violations

                  </p>

                  <h2 className="
                    text-2xl
                    font-bold
                  ">

                    {unresolvedCount}

                  </h2>

                </div>

              </div>

            </div>


            <div className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-5
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <IndianRupee
                  className="
                    text-yellow-400
                  "
                />

                <div>

                  <p className="
                    text-slate-400
                    text-sm
                  ">

                    Total Fines

                  </p>

                  <h2 className="
                    text-2xl
                    font-bold
                  ">

                    ₹{totalFine}

                  </h2>

                </div>

              </div>

            </div>


            <div className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-5
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <Clock3
                  className="
                    text-blue-400
                  "
                />

                <div>

                  <p className="
                    text-slate-400
                    text-sm
                  ">

                    Total Records

                  </p>

                  <h2 className="
                    text-2xl
                    font-bold
                  ">

                    {
                      sortedViolations.length
                    }

                  </h2>

                </div>

              </div>

            </div>

          </div>


          {/* TABLE */}

          <div className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
          ">

            <div className="
              overflow-x-auto
            ">

              <table className="
                w-full
              ">

                <thead className="
                  bg-slate-800
                  text-slate-300
                ">

                  <tr>

                    <th className="
                      p-4
                      text-left
                    ">
                      Vehicle
                    </th>

                    <th className="
                      p-4
                      text-left
                    ">
                      Slot
                    </th>

                    <th className="
                      p-4
                      text-left
                    ">
                      Type
                    </th>

                    <th className="
                      p-4
                      text-left
                    ">
                      Overstay
                    </th>

                    <th className="
                      p-4
                      text-left
                    ">
                      Fine
                    </th>

                    <th className="
                      p-4
                      text-left
                    ">
                      Status
                    </th>

                    <th className="
                      p-4
                      text-left
                    ">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {sortedViolations.map(
                    (violation) => (

                      <tr

                        key={violation.id}

                        className="
                          border-t
                          border-slate-800
                          hover:bg-slate-800/50
                        "
                      >

                        <td className="
                          p-4
                        ">

                          {
                            violation.vehicle_plate
                          }

                        </td>

                        <td className="
                          p-4
                        ">

                          {
                            violation.slot_code
                          }

                        </td>

                        <td className="
                          p-4
                          text-red-400
                          font-semibold
                        ">

                          {
                            violation.type ||

                            "OVERSTAY"
                          }

                        </td>

                        <td className="
                          p-4
                        ">

                          {
                            violation.minutes

                              ? `${violation.minutes} min`

                              : "-"
                          }

                        </td>

                        <td className="
                          p-4
                          text-yellow-400
                        ">

                          ₹{
                            violation.fine || 0
                          }

                        </td>

                        <td className="
                          p-4
                        ">

                          {
                            violation.resolved

                              ? (

                                <span className="
                                  text-emerald-400
                                  flex
                                  items-center
                                  gap-2
                                ">

                                  <ShieldCheck
                                    size={16}
                                  />

                                  Resolved

                                </span>
                              )

                              : (

                                <span className="
                                  text-red-400
                                ">

                                  Unresolved

                                </span>
                              )
                          }

                        </td>

                        <td className="
                          p-4
                        ">

                          {!violation.resolved && (

                            <button

                              type="button"

                              onClick={() =>
                                forceExit(
                                  violation
                                )
                              }

                              className="
                                bg-red-600
                                hover:bg-red-700

                                px-3
                                py-1.5

                                rounded-lg

                                text-sm
                              "
                            >

                              Force Exit

                            </button>
                          )}

                        </td>

                      </tr>
                    )
                  )}


                  {sortedViolations.length === 0 && (

                    <tr>

                      <td

                        colSpan="7"

                        className="
                          p-8
                          text-center
                          text-slate-400
                        "
                      >

                        No violations detected

                      </td>

                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </DashboardBackground>

    </>
  );
}