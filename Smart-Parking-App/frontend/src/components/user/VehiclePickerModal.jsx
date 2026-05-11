export default function VehiclePickerModal({ vehicles, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-slate-900 p-6 rounded-xl w-[400px] space-y-4 shadow-xl">

        <h2 className="text-xl font-bold text-white">
          Select Vehicle
        </h2>

        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelect(v)}
            className="w-full bg-slate-800 hover:bg-emerald-600 p-3 rounded-lg text-left text-white transition"
          >
            <div className="font-bold">
              {v.type.toUpperCase()}
            </div>
            <div className="text-sm text-slate-400">
              {v.plate}
            </div>
          </button>
        ))}

        <button
          onClick={onClose}
          className="w-full bg-red-600 py-2 rounded-lg font-bold"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}