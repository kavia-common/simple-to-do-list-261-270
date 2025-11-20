import React from "react";
import styles from "./Navbar.module.css";

// PUBLIC_INTERFACE
/**
 * Global navigation bar for the Todo app.
 * - Fixed at the top or static, always visible at the top of app container.
 * - App title ("Todo"), simple nav (placeholders), right avatar placeholder.
 * - Responsive: On small screens, stacks or collapses nav list (minimal JS).
 * - Uses style-guide: bg #fff, border, accent #3b82f6, #06b6d4 etc.
 */
export default function Navbar() {
  return (
    <nav
      className="navbar-root"
      role="navigation"
      aria-label="Top navigation"
      style={{
        background: "var(--color-surface, #fff)",
        borderBottom: "1px solid var(--border-color, #e5e7eb)",
        minHeight: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        position: "static", // Change to 'fixed' if you prefer, but adjust App.js padding accordingly
        zIndex: 100,
        boxShadow: "0 1px 4px 0 rgba(59, 130, 246, 0.06)",
      }}
    >
      <div
        className="navbar-title"
        style={{
          color: "var(--color-primary, #3b82f6)",
          fontWeight: 700,
          fontSize: "1.45rem",
          fontFamily: 'inherit',
          letterSpacing: "-0.5px",
        }}
      >
        Todo
      </div>
      {/* Nav items could link to filters if routing is used; here static */}
      <ul
        className="navbar-nav"
        style={{
          display: "flex",
          alignItems: "center",
          listStyle: "none",
          margin: 0,
          padding: 0,
          gap: "1.3rem",
        }}
      >
        {/* As routing/filters not defined, just show placeholders */}
        <li>
          <span
            className="navbar-link"
            style={{
              color: "var(--color-secondary, #64748b)",
              fontWeight: 500,
              fontSize: "1.02rem",
              cursor: "pointer",
            }}
            tabIndex={0}
          >
            All
          </span>
        </li>
        <li>
          <span
            className="navbar-link"
            style={{
              color: "var(--color-secondary, #64748b)",
              fontWeight: 500,
              fontSize: "1.02rem",
              cursor: "pointer",
            }}
            tabIndex={0}
          >
            Active
          </span>
        </li>
        <li>
          <span
            className="navbar-link"
            style={{
              color: "var(--color-secondary, #64748b)",
              fontWeight: 500,
              fontSize: "1.02rem",
              cursor: "pointer",
            }}
            tabIndex={0}
          >
            Completed
          </span>
        </li>
      </ul>
      {/* Right-aligned avatar/placeholder */}
      <div
        className="navbar-avatar-placeholder"
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "var(--color-success, #06b6d4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 8,
        }}
        aria-label="User"
        tabIndex={0}
      >
        {/* Placeholder icon */}
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.2rem" }}>U</span>
      </div>
    </nav>
  );
}
