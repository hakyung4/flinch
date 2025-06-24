import React from 'react';

export function FlinchButton({ onClick, children }) {
  return (
    <button
      style={{
        background: "#ff6a00",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        padding: "8px 16px",
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}