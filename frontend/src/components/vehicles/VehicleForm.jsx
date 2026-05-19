import {

  useState,

} from "react";

import {

  X,

  Car,

  Bike,

  Truck,

  Upload,

  Save,

  User,

  Palette,

  Hash,

} from "lucide-react";


// ======================================================
// VEHICLE TYPES
// ======================================================

const VEHICLE_TYPES = [

  {
    label: "Car",
    value: "Car",
    icon: <Car size={20} />,
  },

  {
    label: "Bike",
    value: "Bike",
    icon: <Bike size={20} />,
  },

  {
    label: "Truck",
    value: "Truck",
    icon: <Truck size={20} />,
  },
];


// ======================================================
// VEHICLE FORM
// ======================================================

export default function VehicleForm({

  onClose,

  onSubmit,

  initialData = null,

}) {

  // ====================================================
  // STATE
  // ====================================================

  const [form,
    setForm] =
    useState({

      vehicle_number:
        initialData
          ?.vehicle_number || "",

      owner:
        initialData
          ?.owner || "",

      type:
        initialData
          ?.type || "Car",

      color:
        initialData
          ?.color || "",

      image:
        initialData
          ?.image || "",
    });

  const [preview,
    setPreview] =
    useState(
      initialData?.image || ""
    );

  const [loading,
    setLoading] =
    useState(false);

  const [errors,
    setErrors] =
    useState({});


  // ====================================================
  // CHANGE
  // ====================================================

  const handleChange =
    (key, value) => {

      setForm((prev) => ({

        ...prev,

        [key]: value,
      }));

      setErrors((prev) => ({

        ...prev,

        [key]: "",
      }));
    };


  // ====================================================
  // IMAGE
  // ====================================================

  const handleImage =
    (e) => {

      const file =
        e.target.files[0];

      if (!file) {

        return;
      }

      const imageUrl =
        URL.createObjectURL(
          file
        );

      setPreview(imageUrl);

      handleChange(
        "image",
        imageUrl
      );
    };


  // ====================================================
  // VALIDATION
  // ====================================================

  const validate =
    () => {

      const newErrors = {};

      if (
        !form.vehicle_number
          .trim()
      ) {

        newErrors.vehicle_number =
          "Vehicle number required";
      }

      if (
        !form.owner.trim()
      ) {

        newErrors.owner =
          "Owner name required";
      }

      if (
        !form.color.trim()
      ) {

        newErrors.color =
          "Vehicle color required";
      }

      setErrors(
        newErrors
      );

      return (
        Object.keys(
          newErrors
        ).length === 0
      );
    };


  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      if (!validate()) {

        return;
      }

      try {

        setLoading(true);

        // ==============================================
        // FUTURE API
        // ==============================================

        // await api.post("/vehicles/", form)

        setTimeout(() => {

          onSubmit?.(
            form
          );

          setLoading(false);

        }, 800);

      } catch (error) {

        console.error(error);

        setLoading(false);
      }
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <div className="
      fixed
      inset-0

      z-[9999]

      bg-black/70
      backdrop-blur-sm

      flex
      items-center
      justify-center

      p-4
    ">

      {/* ========================================== */}
      {/* MODAL */}
      {/* ========================================== */}

      <div className="
        relative

        w-full
        max-w-2xl

        bg-slate-900

        border
        border-slate-800

        rounded-3xl

        overflow-hidden

        shadow-2xl
      ">

        {/* ====================================== */}
        {/* HEADER */}
        {/* ====================================== */}

        <div className="
          flex
          items-center
          justify-between

          px-6
          py-5

          border-b
          border-slate-800
        ">

          <div>

            <h2 className="
              text-2xl
              font-bold
              text-white
            ">

              {

                initialData

                  ? "Edit Vehicle"

                  : "Add Vehicle"
              }

            </h2>

            <p className="
              text-slate-400
              mt-1
            ">

              Manage vehicle details
              and smart parking access

            </p>

          </div>


          {/* CLOSE */}

          <button

            onClick={onClose}

            className="
              w-10
              h-10

              rounded-xl

              bg-slate-800

              flex
              items-center
              justify-center

              text-slate-400

              hover:bg-slate-700
              hover:text-white

              transition-all
            "
          >

            <X size={18} />

          </button>

        </div>


        {/* ====================================== */}
        {/* BODY */}
        {/* ====================================== */}

        <form

          onSubmit={
            handleSubmit
          }

          className="
            p-6

            space-y-6
          "
        >

          {/* ==================================== */}
          {/* IMAGE */}
          {/* ==================================== */}

          <div className="
            flex
            justify-center
          ">

            <label className="
              relative

              w-32
              h-32

              rounded-3xl

              overflow-hidden

              border-2
              border-dashed
              border-slate-700

              bg-slate-800

              flex
              items-center
              justify-center

              cursor-pointer

              hover:border-emerald-500/40

              transition-all
            ">

              {preview ? (

                <img

                  src={preview}

                  alt="Vehicle"

                  className="
                    w-full
                    h-full

                    object-cover
                  "
                />

              ) : (

                <div className="
                  flex
                  flex-col
                  items-center

                  text-slate-400
                ">

                  <Upload
                    size={28}
                  />

                  <span className="
                    text-xs
                    mt-2
                  ">

                    Upload

                  </span>

                </div>
              )}

              <input

                type="file"

                accept="image/*"

                hidden

                onChange={
                  handleImage
                }

              />

            </label>

          </div>


          {/* ==================================== */}
          {/* NUMBER */}
          {/* ==================================== */}

          <div>

            <label className="
              text-sm
              text-slate-400
            ">

              Vehicle Number

            </label>

            <div className="
              relative
              mt-2
            ">

              <Hash
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

                value={
                  form.vehicle_number
                }

                onChange={(e) =>

                  handleChange(

                    "vehicle_number",

                    e.target.value
                  )
                }

                placeholder="
                  DL01AB1234
                "

                className="
                  w-full

                  bg-slate-800

                  border
                  border-slate-700

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

            {errors.vehicle_number && (

              <p className="
                text-red-400
                text-sm

                mt-2
              ">

                {
                  errors.vehicle_number
                }

              </p>
            )}

          </div>


          {/* ==================================== */}
          {/* OWNER */}
          {/* ==================================== */}

          <div>

            <label className="
              text-sm
              text-slate-400
            ">

              Owner Name

            </label>

            <div className="
              relative
              mt-2
            ">

              <User
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

                value={form.owner}

                onChange={(e) =>

                  handleChange(

                    "owner",

                    e.target.value
                  )
                }

                placeholder="
                  Vehicle Owner
                "

                className="
                  w-full

                  bg-slate-800

                  border
                  border-slate-700

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

            {errors.owner && (

              <p className="
                text-red-400
                text-sm

                mt-2
              ">

                {errors.owner}

              </p>
            )}

          </div>


          {/* ==================================== */}
          {/* GRID */}
          {/* ==================================== */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2

            gap-5
          ">

            {/* TYPE */}

            <div>

              <label className="
                text-sm
                text-slate-400
              ">

                Vehicle Type

              </label>

              <div className="
                grid
                grid-cols-3

                gap-3

                mt-2
              ">

                {VEHICLE_TYPES.map(
                  (item) => (

                    <button

                      key={item.value}

                      type="button"

                      onClick={() =>

                        handleChange(

                          "type",

                          item.value
                        )
                      }

                      className={`
                        flex
                        flex-col
                        items-center
                        justify-center

                        gap-2

                        py-4

                        rounded-2xl

                        border

                        transition-all

                        ${
                          form.type ===
                          item.value

                            ? `
                              border-emerald-500
                              bg-emerald-500/10
                              text-emerald-400
                            `

                            : `
                              border-slate-700
                              bg-slate-800
                              text-slate-400
                            `
                        }
                      `}
                    >

                      {item.icon}

                      <span className="
                        text-sm
                        font-medium
                      ">

                        {item.label}

                      </span>

                    </button>
                  )
                )}

              </div>

            </div>


            {/* COLOR */}

            <div>

              <label className="
                text-sm
                text-slate-400
              ">

                Vehicle Color

              </label>

              <div className="
                relative
                mt-2
              ">

                <Palette
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

                  value={form.color}

                  onChange={(e) =>

                    handleChange(

                      "color",

                      e.target.value
                    )
                  }

                  placeholder="
                    Black
                  "

                  className="
                    w-full

                    bg-slate-800

                    border
                    border-slate-700

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

              {errors.color && (

                <p className="
                  text-red-400
                  text-sm

                  mt-2
                ">

                  {errors.color}

                </p>
              )}

            </div>

          </div>


          {/* ==================================== */}
          {/* ACTIONS */}
          {/* ==================================== */}

          <div className="
            flex
            flex-col-reverse
            sm:flex-row

            justify-end

            gap-4

            pt-4
          ">

            {/* CANCEL */}

            <button

              type="button"

              onClick={onClose}

              className="
                px-5
                py-3

                rounded-2xl

                bg-slate-800

                text-white

                hover:bg-slate-700

                transition-all
              "
            >

              Cancel

            </button>


            {/* SAVE */}

            <button

              type="submit"

              disabled={loading}

              className="
                flex
                items-center
                justify-center
                gap-2

                px-6
                py-3

                rounded-2xl

                bg-emerald-500

                text-black
                font-semibold

                hover:bg-emerald-400

                transition-all
              "
            >

              <Save size={18} />

              {

                loading

                  ? "Saving..."

                  : initialData

                    ? "Update Vehicle"

                    : "Add Vehicle"
              }

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}