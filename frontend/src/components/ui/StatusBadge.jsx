export default function StatusBadge({

  status = "unknown",

  text,

}) {

  // ====================================================
  // STATUS COLORS
  // ====================================================

  const getStatusStyles =
    () => {

      switch (
        status?.toLowerCase()
      ) {

        case "active":

          return `
            bg-emerald-500/20
            text-emerald-400
            border-emerald-500/30
          `;

        case "available":

          return `
            bg-emerald-500/20
            text-emerald-400
            border-emerald-500/30
          `;

        case "completed":

          return `
            bg-blue-500/20
            text-blue-400
            border-blue-500/30
          `;

        case "pending":

          return `
            bg-yellow-500/20
            text-yellow-400
            border-yellow-500/30
          `;

        case "reserved":

          return `
            bg-purple-500/20
            text-purple-400
            border-purple-500/30
          `;

        case "cancelled":

          return `
            bg-red-500/20
            text-red-400
            border-red-500/30
          `;

        case "inactive":

          return `
            bg-red-500/20
            text-red-400
            border-red-500/30
          `;

        case "occupied":

          return `
            bg-red-500/20
            text-red-400
            border-red-500/30
          `;

        case "blocked":

          return `
            bg-slate-500/20
            text-slate-300
            border-slate-500/30
          `;

        default:

          return `
            bg-slate-500/20
            text-slate-300
            border-slate-500/30
          `;
      }
    };


  return (

    <span className={`
      inline-flex
      items-center
      justify-center
      px-3
      py-1
      rounded-full
      text-xs
      font-medium
      border
      capitalize
      ${getStatusStyles()}
    `}>

      {text || status}

    </span>
  );
}