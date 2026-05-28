export default function StatusBadge({

  status,

}) {

  const styles = {

    Available:
      "bg-emerald-500/20 text-emerald-400",

    Occupied:
      "bg-red-500/20 text-red-400",

    Reserved:
      "bg-yellow-500/20 text-yellow-400",
  };

  return (

    <span className={`
      px-3
      py-1

      rounded-full

      text-sm
      font-medium

      ${styles[status]}
    `}>

      {status}

    </span>
  );
}