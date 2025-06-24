import React from "react";

export function FlinchButton({ onClick, children, disabled, className = "" }) {
  return (
    <button
      className={
        "bg-flinch hover:bg-orange-200 text-white font-bold px-5 py-2 rounded-xl transition shadow focus:outline-none focus:ring-2 focus:ring-flinch/60 " +
        (disabled ? "opacity-60 cursor-not-allowed " : "") +
        className
      }
      style={{ border: "none" }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}