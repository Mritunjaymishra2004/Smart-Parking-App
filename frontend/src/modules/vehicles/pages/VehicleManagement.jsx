import {
  useState,
  useMemo,
} from "react";

import {
  Plus,
  Search,
  Car,
  Trash2,
} from "lucide-react";


// ======================================================
// DUMMY DATA
// ======================================================

const INITIAL_VEHICLES = [
  {
    id: 1,
    vehicle_number: "DL01AB1234",
    type: "Car",
    color: "Black",
    owner: "Mritunjay",
    status: "Active",
    location: "Zone A",
  },
  {
    id: 2,
    vehicle_number: "UP32XY5678",
    type: "Bike",
    color: "Red",
    owner: "Rahul",
    status: "Parked",
    location: "Zone B",
  },
];


// ======================================================
// VEHICLE MANAGEMENT
// ======================================================

export default function VehicleManagement() {
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

  const [form,
    setForm] =
    useState({
      vehicle_number: "",
      type: "Car",
      color: "",
      owner: "",
    });


  const filteredVehicles =
    useMemo(() => {
      return vehicles.filter(
        (vehicle) =>
          vehicle.vehicle_number
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          vehicle.owner
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [vehicles, search]);


  const addVehicle = () => {
    if (
      !form.vehicle_number ||
      !form.owner
    )
      return;

    setVehicles((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...form,
        status: "Active",
        location: "Zone C",
      },
    ]);

    setForm({
      vehicle_number: "",
      type: "Car",
      color: "",
      owner: "",
    });

    setShowForm(false);
  };


  const deleteVehicle =
    (id) => {
      setVehicles((prev) =>
        prev.filter(
          (v) =>
            v.id !== id
        )
      );
    };


  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Vehicle Management
          </h1>
          <p className="text-slate-400 mt-2">
            Manage all registered vehicles
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(true)
          }
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 text-black font-semibold"
        >
          <Plus size={18} />
          Add Vehicle
        </button>
      </div>


      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        placeholder="Search vehicle..."
        className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white"
      />


      {/* FORM */}
      {showForm && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">

          <input
            placeholder="Vehicle Number"
            value={
              form.vehicle_number
            }
            onChange={(e) =>
              setForm({
                ...form,
                vehicle_number:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
          />

          <input
            placeholder="Owner"
            value={form.owner}
            onChange={(e) =>
              setForm({
                ...form,
                owner:
                  e.target.value,
              })
            }
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
          />

          <button
            onClick={addVehicle}
            className="w-full py-3 bg-emerald-500 rounded-xl text-black font-semibold"
          >
            Save Vehicle
          </button>

        </div>
      )}


      {/* VEHICLE LIST */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredVehicles.map(
          (vehicle) => (
            <div
              key={vehicle.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6"
            >
              <div className="flex justify-between">
                <Car className="text-emerald-400" />

                <button
                  onClick={() =>
                    deleteVehicle(
                      vehicle.id
                    )
                  }
                >
                  <Trash2 className="text-red-400" />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-white mt-4">
                {
                  vehicle.vehicle_number
                }
              </h3>

              <p className="text-slate-400">
                {vehicle.owner}
              </p>

              <p className="text-emerald-400 mt-2">
                {vehicle.location}
              </p>
            </div>
          )
        )}

      </div>

    </div>
  );
}