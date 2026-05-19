import {
  useState,
  useMemo,
} from "react";

import DashboardLayout
from "../../components/common/DashboardLayout";

import VehicleCard
from "../../components/vehicles/VehicleCard";

import VehicleForm
from "../../components/vehicles/VehicleForm";

import VehicleHistory
from "../../components/vehicles/VehicleHistory";

import VehicleTracker
from "../../components/vehicles/VehicleTracker";

import {

  Plus,

  Search,

  Car,

} from "lucide-react";


// ======================================================
// DUMMY DATA
// ======================================================

const INITIAL_VEHICLES = [

  {
    id: 1,

    vehicle_number:
      "DL01AB1234",

    type: "Car",

    color: "Black",

    owner: "Mritunjay",

    status: "active",

    lastLocation:
      "Zone A",
  },

  {
    id: 2,

    vehicle_number:
      "UP32XY5678",

    type: "Bike",

    color: "Red",

    owner: "Rahul",

    status: "parked",

    lastLocation:
      "Zone B",
  },
];


// ======================================================
// VEHICLE MANAGEMENT
// ======================================================

export default function VehicleManagement() {

  // ====================================================
  // STATE
  // ====================================================

  const [vehicles,
    setVehicles] =
    useState(
      INITIAL_VEHICLES
    );

  const [search,
    setSearch] =
    useState("");

  const [showForm,
    setShowForm] =
    useState(false);

  const [selectedVehicle,
    setSelectedVehicle] =
    useState(null);


  // ====================================================
  // FILTER
  // ====================================================

  const filteredVehicles =
    useMemo(() => {

      return vehicles.filter(
        (vehicle) => {

          return (

            vehicle.vehicle_number
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )

            ||

            vehicle.owner
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          );
        }
      );

    }, [

      vehicles,

      search,
    ]);


  // ====================================================
  // ADD VEHICLE
  // ====================================================

  const handleAddVehicle =
    (newVehicle) => {

      setVehicles((prev) => [

        ...prev,

        {

          id: Date.now(),

          ...newVehicle,

          status: "active",

          lastLocation:
            "Zone A",
        },
      ]);

      setShowForm(false);
    };


  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete =
    (id) => {

      setVehicles((prev) =>

        prev.filter(

          (vehicle) =>

            vehicle.id !== id
        )
      );
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <DashboardLayout>

      <div className="
        space-y-8
      ">

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <div className="
          flex
          flex-col
          xl:flex-row

          xl:items-center
          xl:justify-between

          gap-5
        ">

          <div>

            <h1 className="
              text-3xl
              font-bold
              text-white
            ">

              Vehicle Management

            </h1>

            <p className="
              text-slate-400
              mt-2
            ">

              Manage vehicles,
              QR access,
              tracking,
              and parking history.

            </p>

          </div>


          {/* ACTIONS */}

          <div className="
            flex
            flex-col
            sm:flex-row

            gap-4
          ">

            {/* SEARCH */}

            <div className="
              relative
            ">

              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  text-slate-500
                "
              />

              <input

                value={search}

                onChange={(e) =>

                  setSearch(
                    e.target.value
                  )
                }

                placeholder="
                  Search vehicle...
                "

                className="
                  w-full
                  sm:w-[280px]

                  bg-slate-900

                  border
                  border-slate-800

                  rounded-2xl

                  pl-11
                  pr-4
                  py-3

                  text-white

                  outline-none

                  focus:border-emerald-500/30
                "
              />

            </div>


            {/* ADD */}

            <button

              onClick={() =>
                setShowForm(true)
              }

              className="
                flex
                items-center
                justify-center
                gap-2

                px-5
                py-3

                rounded-2xl

                bg-emerald-500

                text-black
                font-semibold

                hover:bg-emerald-400

                transition-all
              "
            >

              <Plus size={18} />

              Add Vehicle

            </button>

          </div>

        </div>


        {/* ========================================== */}
        {/* STATS */}
        {/* ========================================== */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-3

          gap-5
        ">

          <div className="
            bg-slate-900

            border
            border-slate-800

            rounded-3xl

            p-6
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="
                  text-slate-400
                  text-sm
                ">

                  Total Vehicles

                </p>

                <h2 className="
                  text-3xl
                  font-bold
                  text-white

                  mt-2
                ">

                  {vehicles.length}

                </h2>

              </div>

              <Car
                className="
                  text-emerald-400
                "
              />

            </div>

          </div>

        </div>


        {/* ========================================== */}
        {/* GRID */}
        {/* ========================================== */}

        <div className="
          grid
          grid-cols-1
          lg:grid-cols-2
          2xl:grid-cols-3

          gap-6
        ">

          {filteredVehicles.map(
            (vehicle) => (

              <VehicleCard

                key={vehicle.id}

                vehicle={vehicle}

                onDelete={
                  handleDelete
                }

                onTrack={() =>

                  setSelectedVehicle(
                    vehicle
                  )
                }

              />
            )
          )}

        </div>


        {/* ========================================== */}
        {/* TRACKER */}
        {/* ========================================== */}

        {selectedVehicle && (

          <VehicleTracker

            vehicle={
              selectedVehicle
            }

            onClose={() =>

              setSelectedVehicle(
                null
              )
            }

          />
        )}


        {/* ========================================== */}
        {/* HISTORY */}
        {/* ========================================== */}

        <VehicleHistory />


        {/* ========================================== */}
        {/* FORM */}
        {/* ========================================== */}

        {showForm && (

          <VehicleForm

            onClose={() =>
              setShowForm(false)
            }

            onSubmit={
              handleAddVehicle
            }

          />
        )}

      </div>

    </DashboardLayout>
  );
}