import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

/**
 * Modal - Accessible, theme-consistent modal dialog for React.
 * 
 * Props:
 * - isOpen: boolean (controls visibility)
 * - onClose: function (triggered when closing is requested)
 * - title: string|ReactNode (optional, shown at the top and used for aria-labelledby)
 * - children: ReactNode (body/content)
 * - footer: ReactNode (optional, custom actions)
 * - closeOnOverlayClick: boolean (default true)
 * - size: 'sm' | 'md' | 'lg' (default 'md')
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOverlayClick = true,
  size = "md",
}) {
  const dialogRef = useRef(null);
  const lastActiveElement = useRef(null);
  const titleId = title ? "modal-title-" + Math.random().toString(36).substr(2, 6) : undefined;

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;
    lastActiveElement.current = document.activeElement;

    // Prevent background scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the modal dialog itself
    if (dialogRef.current) dialogRef.current.focus();

    // Handle focus trap
    const handleFocus = (e) => {
      if (!dialogRef.current.contains(e.target)) {
        e.stopPropagation();
        dialogRef.current.focus();
      }
    };
    document.addEventListener("focus", handleFocus, true);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("focus", handleFocus, true);
      if (lastActiveElement.current) {
        lastActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // ESC key to close
  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      // TAB focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusableEls = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const els = Array.prototype.slice.call(focusableEls);
        if (!els.length) {
          e.preventDefault();
          return;
        }
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    },
    [isOpen, onClose]
  );

  // Overlay click to close
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Modal content
  const modalElement = (
    <div
      className="modal-overlay"
      tabIndex={-1}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? titleId : undefined}
      style={{ zIndex: 9999 }}
    >
      <div
        className={`modal-dialog modal-size-${size}`}
        ref={dialogRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={typeof title === "string" ? title : undefined}
      >
        <div className="modal-content">
          {title && (
            <div className="modal-header">
              <span className="modal-title" id={titleId}>
                {title}
              </span>
              <button
                className="modal-close-btn"
                type="button"
                aria-label="Close"
                onClick={onClose}
                tabIndex={0}
              >
                &times;
              </button>
            </div>
          )}
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );

  // Use portal if available
  const portalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root") || document.body
      : null;
  if (portalRoot && ReactDOM.createPortal) {
    return ReactDOM.createPortal(modalElement, portalRoot);
  }
  return modalElement; // fallback: inline render
}

export default Modal;
