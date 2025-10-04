import React from "react";

function Navbar() {
  return (
    <a
      href="/"
      className="flex cursor-pointer justify-center items-center h-20 py-12 bg-gray-800/85 shadow-lg border-b border-gray-700"
    >
      <img
        src="/Bingo.png"
        className="h-40 object-contain pointer-events-none"
        alt="Bingo"
      />
    </a>
  );
}

export default Navbar;
