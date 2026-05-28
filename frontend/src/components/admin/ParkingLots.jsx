import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../components/common/DashboardLayout";

import Card from "../../components/ui/Card";

import Loader from "../../components/ui/Loader";

import Button from "../../components/ui/Button";

import Modal from "../../components/ui/Modal";

import ConfirmModal from "../../components/ui/ConfirmModal";

import api from "../../api/axios";

import {
  getParkingLots,
} from "../../services/parkingService";

import {
  useNotification,
} from "../../context/NotificationContext";


// ======================================================
// INITIAL FORM
// ======================================================

const initialForm = {

  name: "",

  address: "",

  operator: "",

  latitude: "",

  longitude: "",

  total_slots: "",
};


// ======================================================
// PARKING LOTS
// ======================================================

export default function ParkingLots() {

  // ====================================================
  // STATE
  // ====================================================

  const [parkingLots, setParkingLots] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState(initialForm);

  const [search, setSearch] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [showDeleteModal,
    setShowDeleteModal] =
    useState(false);

  const [selectedLot,
    setSelectedLot] =
    useState(null);


  // ====================================================
  // NOTIFICATION
  // ====================================================

  const {

    success,

    error: showError,

  } = useNotification();


  // ====================================================
  // FETCH PARKING LOTS
  // ====================================================

  const fetchParkingLots =
    async () => {

      try {

        setPageError("");

        const data =
          await getParkingLots();

        setParkingLots(data);

      } catch (err) {

        console.error(
          "Parking lots error:",
          err
        );

        setPageError(
          "Failed to load parking lots"
        );

        showError(
          "Failed to load parking lots"
        );

      } finally {

        setLoading(false);
      }
    };


  // ====================================================
  // LOAD
  // ====================================================

  useEffect(() => {

    fetchParkingLots();

  }, []);


  // ====================================================
  // HANDLE INPUT CHANGE
  // ====================================================

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };


  // ====================================================
  // OPEN ADD
  // ====================================================

  const handleAdd =
    () => {

      setEditingId(null);

      setFormData(initialForm);

      setShowModal(true);
    };


  // ====================================================
  // OPEN EDIT
  // ====================================================

  const handleEdit =
    (lot) => {

      setEditingId(lot.id);

      setFormData({

        name:
          lot.name || "",

        address:
          lot.address || "",

        operator:
          lot.operator || "",

        latitude:
          lot.latitude || "",

        longitude:
          lot.longitude || "",

        total_slots:
          lot.total_slots || "",
      });

      setShowModal(true);
    };


  // ====================================================
  // SAVE LOT
  // ====================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setSaving(true);

        if (editingId) {

          const response =
            await api.put(

              `/parking/lots/${editingId}/`,

              formData
            );

          // ==========================================
          // UPDATE LOCAL STATE
          // ==========================================

          setParkingLots((prev) =>

            prev.map((lot) =>

              lot.id === editingId

                ? response.data

                : lot
            )
          );

          success(
            "Parking lot updated"
          );

        } else {

          const response =
            await api.post(

              "/parking/lots/",

              formData
            );

          setParkingLots((prev) => [

            response.data,

            ...prev,
          ]);

          success(
            "Parking lot created"
          );
        }

        setShowModal(false);

      } catch (err) {

        console.error(
          "Save error:",
          err
        );

        showError(
          "Failed to save parking lot"
        );

      } finally {

        setSaving(false);
      }
    };


  // ====================================================
  // OPEN DELETE MODAL
  // ====================================================

  const openDeleteModal =
    (lot) => {

      setSelectedLot(lot);

      setShowDeleteModal(true);
    };


  // ====================================================
  // DELETE LOT
  // ====================================================

  const handleDelete =
    async () => {

      if (!selectedLot)
        return;

      try {

        await api.delete(

          `/parking/lots/${selectedLot.id}/`
        );

        // ==========================================
        // REMOVE LOCALLY
        // ==========================================

        setParkingLots((prev) =>

          prev.filter(
            (lot) =>
              lot.id !==
              selectedLot.id
          )
        );

        success(
          "Parking lot deleted"
        );

        setShowDeleteModal(false);

      } catch (err) {

        console.error(
          "Delete error:",
          err
        );

        showError(
          "Failed to delete parking lot"
        );
      }
    };


  // ====================================================
  // FILTERED DATA
  // ====================================================

  const filteredLots =
    parkingLots.filter((lot) =>

      lot.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );


  // ====================================================
  // STATS
  // ====================================================

  const totalLots =
    parkingLots.length;

  const totalSlots =
    parkingLots.reduce(

      (sum, lot) =>

        sum +
        Number(
          lot.total_slots || 0
        ),

      0
    );


  // ====================================================
  // UI
  // ====================================================

  return (

    <DashboardLayout>

      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}

      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        mb-8
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            text-white
          ">
            Parking Lots
          </h1>

          <p className="
            text-slate-400
            mt-1
          ">
            Manage parking
            locations and slots
          </p>

        </div>

        <Button
          onClick={handleAdd}
          className="
            bg-emerald-600
            hover:bg-emerald-700
          "
        >
          + Add Parking Lot
        </Button>

      </div>


      {/* ========================================== */}
      {/* STATS */}
      {/* ========================================== */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-5
        mb-8
      ">

        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Total Parking Lots
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-white
          ">
            {totalLots}
          </h2>

        </Card>


        <Card>

          <p className="
            text-slate-400
            text-sm
            mb-2
          ">
            Total Parking Slots
          </p>

          <h2 className="
            text-3xl
            font-bold
            text-emerald-400
          ">
            {totalSlots}
          </h2>

        </Card>

      </div>


      {/* ========================================== */}
      {/* SEARCH */}
      {/* ========================================== */}

      <div className="mb-6">

        <input
          type="text"
          placeholder="Search parking lot..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            md:w-96
            bg-slate-900
            border
            border-slate-700
            text-white
            px-4
            py-3
            rounded-xl
            outline-none
          "
        />

      </div>


      {/* ========================================== */}
      {/* ERROR */}
      {/* ========================================== */}

      {pageError && (

        <div className="
          bg-red-500/10
          border
          border-red-500/20
          text-red-400
          px-4
          py-3
          rounded-xl
          mb-6
        ">

          {pageError}

        </div>
      )}


      {/* ========================================== */}
      {/* LOADER */}
      {/* ========================================== */}

      {loading ? (

        <Loader />

      ) : (

        <div className="
          overflow-x-auto
        ">

          <table className="
            w-full
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            overflow-hidden
          ">

            <thead className="
              bg-slate-800
              text-slate-300
            ">

              <tr>

                <th className="p-4">
                  Name
                </th>

                <th className="p-4">
                  Operator
                </th>

                <th className="p-4">
                  Total Slots
                </th>

                <th className="p-4">
                  Address
                </th>

                <th className="p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredLots.map((lot) => (

                <tr
                  key={lot.id}
                  className="
                    border-t
                    border-slate-800
                    hover:bg-slate-800/40
                  "
                >

                  <td className="
                    p-4
                    text-white
                  ">
                    {lot.name}
                  </td>

                  <td className="
                    p-4
                    text-slate-300
                  ">
                    {lot.operator}
                  </td>

                  <td className="
                    p-4
                    text-emerald-400
                    font-semibold
                  ">
                    {lot.total_slots}
                  </td>

                  <td className="
                    p-4
                    text-slate-300
                  ">
                    {lot.address}
                  </td>

                  <td className="p-4">

                    <div className="
                      flex
                      gap-2
                    ">

                      <Button
                        onClick={() =>
                          handleEdit(lot)
                        }
                        className="
                          bg-blue-600
                          hover:bg-blue-700
                          text-xs
                          px-3
                          py-2
                        "
                      >
                        Edit
                      </Button>

                      <Button
                        onClick={() =>
                          openDeleteModal(lot)
                        }
                        className="
                          bg-red-600
                          hover:bg-red-700
                          text-xs
                          px-3
                          py-2
                        "
                      >
                        Delete
                      </Button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}


      {/* ========================================== */}
      {/* FORM MODAL */}
      {/* ========================================== */}

      <Modal
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
        title={
          editingId
            ? "Edit Parking Lot"
            : "Add Parking Lot"
        }
      >

        <form
          onSubmit={handleSubmit}
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          "
        >

          <input
            type="text"
            name="name"
            placeholder="Parking Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="
              bg-slate-800
              border
              border-slate-700
              text-white
              px-4
              py-3
              rounded-xl
            "
          />

          <input
            type="text"
            name="operator"
            placeholder="Operator"
            value={formData.operator}
            onChange={handleChange}
            required
            className="
              bg-slate-800
              border
              border-slate-700
              text-white
              px-4
              py-3
              rounded-xl
            "
          />

          <input
            type="number"
            step="any"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
            className="
              bg-slate-800
              border
              border-slate-700
              text-white
              px-4
              py-3
              rounded-xl
            "
          />

          <input
            type="number"
            step="any"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
            className="
              bg-slate-800
              border
              border-slate-700
              text-white
              px-4
              py-3
              rounded-xl
            "
          />

          <input
            type="number"
            name="total_slots"
            placeholder="Total Slots"
            value={formData.total_slots}
            onChange={handleChange}
            required
            className="
              bg-slate-800
              border
              border-slate-700
              text-white
              px-4
              py-3
              rounded-xl
            "
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="
              md:col-span-2
              bg-slate-800
              border
              border-slate-700
              text-white
              px-4
              py-3
              rounded-xl
              min-h-[120px]
            "
          />

          <div className="
            md:col-span-2
            flex
            justify-end
            gap-3
            mt-2
          ">

            <Button
              type="button"
              onClick={() =>
                setShowModal(false)
              }
              className="
                bg-slate-700
                hover:bg-slate-600
              "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="
                bg-emerald-600
                hover:bg-emerald-700
              "
            >
              {saving
                ? "Saving..."
                : "Save"}
            </Button>

          </div>

        </form>

      </Modal>


      {/* ========================================== */}
      {/* DELETE MODAL */}
      {/* ========================================== */}

      <ConfirmModal

        open={showDeleteModal}

        onClose={() =>
          setShowDeleteModal(false)
        }

        onConfirm={
          handleDelete
        }

        title="Delete Parking Lot"

        message={`
          Are you sure you want
          to delete
          ${selectedLot?.name}?
        `}

        confirmText="Delete"

        danger
      />

    </DashboardLayout>
  );
}