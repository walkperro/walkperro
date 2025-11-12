import * as React from "react";

export function Card({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        "rounded-2xl border border-[#2B2B2C] bg-[color:rgba(43,43,44,0.5)] " +
        "shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] " +
        className
      }
      {...props}
    />
  );
}
