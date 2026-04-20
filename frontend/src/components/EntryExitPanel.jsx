import api from "../services/api";

export default function EntryExitPanel({ booking }) {

  const enter = async () => {
    await api.post("/entry/", { vehicle: booking.vehicle_id });
    alert("Gate opened — Slot Occupied");
  };

  const exit = async () => {
  const res = await api.post("/exit/", { session: booking.session_id });
  navigate("/payment", { state: res.data });
};

//   const exit = async () => {
//     const res = await api.post("/exit/", { session: booking.session_id });
//     alert(`Pay ₹${res.data.charges}`);
//   };


  return (
    <div className="bg-slate-900 p-5 rounded mt-4">
      <h2 className="text-xl mb-3">Parking Control</h2>

      <button
        onClick={enter}
        className="bg-green-600 px-4 py-2 rounded mr-3"
      >
        Enter Parking
      </button>

      <button
        onClick={exit}
        className="bg-red-600 px-4 py-2 rounded"
      >
        Exit Parking
      </button>
    </div>
  );
}
