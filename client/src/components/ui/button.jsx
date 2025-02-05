// client/src/components/ui/button.jsx
import React from "react";

export default function Button({ children, onClick, className = "" }) {
    return (
      <button
        onClick={onClick}
        className={`bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition ${className}`}
      >
        {children}
      </button>
    );
  }
