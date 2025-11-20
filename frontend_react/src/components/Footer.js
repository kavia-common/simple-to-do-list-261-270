import React from "react";

// PUBLIC_INTERFACE
export default function Footer() {
  return (
    <footer>
      <span>
        Made with <span style={{color:"#3b82f6"}}>&#9733;</span> | Light theme &middot; Tasks are saved {typeof window !== "undefined" && window.localStorage ? "locally" : ""}.
      </span>
    </footer>
  );
}
