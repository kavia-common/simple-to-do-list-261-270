import React from "react";
import "./Card.css";

/**
 * Card component: A reusable, theme-consistent Card for layouts and content blocks.
 * 
 * Variants:
 * - default: Soft border, white background, subtle shadow
 * - outlined: Thin border, no shadow
 * - elevated: Stronger shadow and elevation
 * Props:
 * - variant: "default" | "outlined" | "elevated" (default: "default")
 * - as: string (HTML element, default "div"; "button"/"a" => interactive styling)
 * - onClick: Function (if provided, card is clickable and focusable)
 * - className: Additional classes
 * - style: Custom inline style
 * - header: ReactNode (slot, appears at top)
 * - footer: ReactNode (slot, appears at bottom)
 * - children: Main content
 * - tabIndex, aria-label, ...rest: Extra pass-through
 * Accessible/focus/roles: 
 * - Uses semantic role and focus ring when interactive
 */

// PUBLIC_INTERFACE
export default function Card({
  variant = "default",
  as = "div",
  onClick,
  className = "",
  style,
  header,
  footer,
  children,
  tabIndex,
  "aria-label": ariaLabel,
  ...rest
}) {
  const isInteractive = !!onClick || as === "button" || as === "a";
  const Tag = as || "div";
  // Default focusable if card is interactive but not natively tabbable
  const cardTabIndex = typeof tabIndex !== "undefined" ? tabIndex :
    (isInteractive && as === "div" ? 0 : undefined);
  const role = isInteractive && as === "div" ? "button" : undefined;

  return (
    <Tag
      className={
        [
          "kavia-card",
          `card-${variant}`,
          isInteractive ? "card-interactive" : "",
          className
        ].filter(Boolean).join(" ")
      }
      style={style}
      onClick={onClick}
      tabIndex={cardTabIndex}
      role={role}
      aria-label={ariaLabel}
      {...rest}
      // Keyboard: Enter/Space triggers click for div/button
      onKeyDown={isInteractive && as === "div" ? (e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick && onClick(e);
        }
      }) : undefined}
    >
      {header && (
        <div className="card-header" role="heading">{header}</div>
      )}
      <div className="card-content">{children}</div>
      {footer && (
        <div className="card-footer">{footer}</div>
      )}
    </Tag>
  );
}
