import React from "react";

// PUBLIC_INTERFACE
/**
 * Footer component - visually enhanced for modern UI, accessibility, and light theme.
 * - Subtle divider, improved spacing, and clear typography
 * - Responsive and accessible (role="contentinfo", strong contrast)
 * - Light theme primary colors and smooth hover for any links
 */
export default function Footer() {
  // You could expand this if the footer ever needs links
  return (
    <footer className="footer-root" role="contentinfo" aria-label="Page footer">
      <div className="footer-divider" aria-hidden="true"></div>
      <div className="footer-content">
        <span>
          Made with{" "}
          <span
            className="footer-star"
            role="img"
            aria-label="star"
            style={{
              color: "var(--color-primary)",
              fontWeight: 700,
              verticalAlign: "middle",
            }}
          >
            &#9733;
          </span>{" "}
          | Light theme · Tasks are saved
          {typeof window !== "undefined" && window.localStorage ? " locally." : "."}
        </span>
      </div>
    </footer>
  );
}
