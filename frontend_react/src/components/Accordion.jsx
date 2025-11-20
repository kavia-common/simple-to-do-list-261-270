import React, { useState, useRef, useCallback } from "react";
import "./Accordion.css";

/**
 * Accordion - A reusable, accessible Accordion component for React.
 *
 * PROPS:
 *  items: [{ id, title, content, disabled? }]
 *  allowMultiple: boolean (default: false) - allow multiple panels expanded
 *  className: string - optional
 *  style: object - optional
 *
 * Theme: Uses CSS variables (--color-primary etc) for colors.
 *
 * Accessibility:
 *  - Keyboard: up/down to change header, Home/End for first/last, Enter/Space toggles.
 *  - ARIA roles per https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *
 * Animation:
 *  - Smooth max-height transition for expanding/collapsing content.
 */
// PUBLIC_INTERFACE
export default function Accordion({
  items,
  allowMultiple = false,
  className = "",
  style,
}) {
  // Holds list of expanded item indices
  const [open, setOpen] = useState(() =>
    items.map(() => false)
  );
  const headerRefs = useRef([]);

  // Handles expand/collapse logic
  const toggle = useCallback(
    (idx) => {
      setOpen((prev) => {
        if (items[idx].disabled) return prev;
        // Single expand: only one open
        if (!allowMultiple) {
          return prev.map((_, j) => j === idx ? !prev[j] : false);
        }
        // Multiple
        return prev.map((o, j) => (j === idx ? !o : o));
      });
    },
    [allowMultiple, items]
  );

  // Keyboard navigation logic
  const onHeaderKeyDown = (e, idx) => {
    const { key } = e;
    // Helper: focus a header by index
    const focusHeader = (i) => {
      headerRefs.current[i]?.focus();
    };
    const lastIdx = items.length - 1;
    if (key === "ArrowDown") {
      e.preventDefault();
      focusHeader(idx === lastIdx ? 0 : idx + 1);
    } else if (key === "ArrowUp") {
      e.preventDefault();
      focusHeader(idx === 0 ? lastIdx : idx - 1);
    } else if (key === "Home") {
      e.preventDefault();
      focusHeader(0);
    } else if (key === "End") {
      e.preventDefault();
      focusHeader(lastIdx);
    } else if (key === "Enter" || key === " ") {
      e.preventDefault();
      toggle(idx);
    }
  };

  return (
    <div
      className={`kavia-accordion-root ${className}`}
      style={style}
      data-accordion
      role="presentation"
    >
      {items.map((item, idx) => {
        const expanded = !!open[idx];
        const panelId = `accordion-panel-${item.id || idx}`;
        const headerId = `accordion-header-${item.id || idx}`;
        // ARIA: If disabled, set disabled props
        return (
          <div
            className={`kavia-accordion-item${expanded ? " expanded" : ""}${item.disabled ? " disabled" : ""}`}
            key={item.id || idx}
            data-expanded={expanded}
            aria-disabled={!!item.disabled}
          >
            <h3 className="kavia-accordion-header" style={{ margin: 0 }}>
              <button
                ref={el => (headerRefs.current[idx] = el)}
                className="kavia-accordion-trigger"
                id={headerId}
                aria-controls={panelId}
                aria-expanded={expanded}
                aria-disabled={!!item.disabled}
                tabIndex={0}
                type="button"
                disabled={!!item.disabled}
                onClick={() => toggle(idx)}
                onKeyDown={e => onHeaderKeyDown(e, idx)}
              >
                <span className="kavia-accordion-title">{item.title}</span>
                {/* Chevron */}
                <span
                  className="kavia-accordion-chevron"
                  aria-hidden="true"
                  style={{
                    transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                >
                  ▶
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              className="kavia-accordion-panel"
              role="region"
              aria-labelledby={headerId}
              aria-hidden={!expanded}
              data-expanded={expanded}
              style={{
                maxHeight: expanded ? "300px" : "0px",
                opacity: expanded ? 1 : 0.7,
                overflow: "hidden",
                transition: "max-height 0.32s cubic-bezier(0.77,0,0.18,1), opacity 0.19s linear",
              }}
            >
              <div className="kavia-accordion-panel-inner">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
