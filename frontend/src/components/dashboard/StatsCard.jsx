export default function StatsCard({ title, value, color }) {
  return (
    <div className="glass p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
      
      <p className="text-slate-400 text-sm uppercase tracking-wide">
        {title}
      </p>

      <h2 className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </h2>

    </div>
  );
}