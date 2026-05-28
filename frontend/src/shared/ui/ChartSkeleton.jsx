import React from "react";

export default function ChartSkeleton() {
  return (
    <div className="
      animate-pulse
      bg-slate-800
      rounded-2xl
      p-6
      h-80
      w-full
      border
      border-slate-700
    ">
      <div className="
        h-6
        w-40
        bg-slate-700
        rounded
        mb-6
      " />

      <div className="
        flex
        items-end
        gap-4
        h-56
      ">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-slate-700 rounded-t-lg"
            style={{
              height: `${40 + i * 20}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}