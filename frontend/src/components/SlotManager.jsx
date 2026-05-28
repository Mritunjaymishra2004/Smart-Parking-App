import {

  useState,

} from "react";

import {

  Plus,

  Trash2,

  Edit,

} from "lucide-react";


// ======================================================
// INITIAL DATA
// ======================================================

const initialSlots = [

  {
    id: 1,
    slot: "A1",
    status: "Available",
  },

  {
    id: 2,
    slot: "A2",
    status: "Occupied",
  },

  {
    id: 3,
    slot: "B1",
    status: "Reserved",
  },
];


// ======================================================
// SLOT MANAGER
// ======================================================

export default function SlotManager() {

  const [slots,
    setSlots] =
    useState(initialSlots);


  // ====================================================
  // DELETE SLOT
  // ====================================================

  const deleteSlot =
    (id) => {

      setSlots(

        slots.filter(

          (slot) =>
            slot.id !== id
        )
      );
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      min-h-screen

      bg-slate-950

      p-6
    ">

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="
        flex
        items-center
        justify-between

        mb-6
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-white
          ">

            Slot Manager

          </h1>

          <p className="
            text-slate-400
            mt-1
          ">

            Manage parking slots

          </p>

        </div>


        {/* ADD BUTTON */}

        <button className="
          flex
          items-center
          gap-2

          px-5
          py-3

          rounded-xl

          bg-emerald-500

          text-black
          font-semibold

          hover:bg-emerald-400

          transition-all
        ">

          <Plus size={18} />

          Add Slot

        </button>

      </div>


      {/* ========================================== */}
      {/* TABLE */}
      {/* ========================================== */}

      <div className="
        bg-slate-900

        border
        border-slate-800

        rounded-2xl

        overflow-hidden
      ">

        <table className="
          w-full
        ">

          <thead className="
            bg-slate-800
          ">

            <tr>

              <th className="
                px-6
                py-4

                text-left
                text-slate-300
              ">

                Slot

              </th>

              <th className="
                px-6
                py-4

                text-left
                text-slate-300
              ">

                Status

              </th>

              <th className="
                px-6
                py-4

                text-right
                text-slate-300
              ">

                Actions

              </th>

            </tr>

          </thead>


          <tbody>

            {slots.map((slot) => (

              <tr

                key={slot.id}

                className="
                  border-t
                  border-slate-800
                "
              >

                <td className="
                  px-6
                  py-4

                  text-white
                ">

                  {slot.slot}

                </td>

                <td className="
                  px-6
                  py-4
                ">

                  <span className={`
                    px-3
                    py-1

                    rounded-full

                    text-sm
                    font-medium

                    ${
                      slot.status === "Available"

                        ? `
                          bg-emerald-500/20
                          text-emerald-400
                        `

                        : slot.status === "Occupied"

                        ? `
                          bg-red-500/20
                          text-red-400
                        `

                        : `
                          bg-yellow-500/20
                          text-yellow-400
                        `
                    }
                  `}>

                    {slot.status}

                  </span>

                </td>

                <td className="
                  px-6
                  py-4
                ">

                  <div className="
                    flex
                    items-center
                    justify-end
                    gap-3
                  ">

                    {/* EDIT */}

                    <button className="
                      p-2

                      rounded-lg

                      bg-slate-800

                      text-slate-300

                      hover:bg-slate-700
                    ">

                      <Edit size={16} />

                    </button>


                    {/* DELETE */}

                    <button

                      onClick={() =>
                        deleteSlot(slot.id)
                      }

                      className="
                        p-2

                        rounded-lg

                        bg-red-500/10

                        text-red-400

                        hover:bg-red-500/20
                      "
                    >

                      <Trash2 size={16} />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}