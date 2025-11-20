import React, { useEffect, useRef, useState, useCallback } from "react";
/**
 * Carousel - Accessible, theme-styled, reusable React carousel/slider.
 * 
 * PROPS:
 * - items: ReactNode[] (children/slides; can use as children or via prop)
 * - loop: boolean (should loop by default, default=false)
 * - autoPlay: boolean (should auto-play slides, default=false)
 * - autoPlayInterval: number (ms, default: 4000)
 * - showIndicators: boolean (show pagination dots, default: true)
 * - showArrows: boolean (show prev/next controls, default: true)
 * - onSlideChange: (idx:number)=>void (called on slide change)
 * - className/style: for customization
 * - children: alternative to items
 * 
 * Accessibility:
 * - Keyboard: left/right, home/end, focus management, roving tab index.
 * - ARIA roles: role="region" role="group" role="button" aria-roledescription, aria-labels.
 * - Focus management: arrows/dots are navigable, slide has correct aria-hidden.
 * - Indicators announce index/total, controls are labeled.
 * 
 * Touch:
 * - Swipe left/right via pointer/touch
 * 
 * Animation:
 * - CSS transitions for sliding movement (translateX).
 * 
 * Theme:
 * - Uses app light theme: primary #3b82f6, secondary #64748b, surface #fff, bg #f9fafb, text #111827.
 * 
 */
const DOT_SIZE = 11;
const ARROW_BTN_STYLE = {
  background: "var(--color-surface,#fff)",
  border: "1px solid var(--color-secondary,#64748b)",
  color: "var(--color-primary,#3b82f6)",
  borderRadius: "50%",
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: "1.43em",
  cursor: "pointer",
  margin: "0 7px",
  outline: "none",
  transition: "background 0.15s, box-shadow 0.18s, border-color 0.17s",
  boxShadow: "0 1px 6px rgba(59,130,246,0.06)",
};
const DOT_BASE = {
  display: "inline-block",
  width: DOT_SIZE,
  height: DOT_SIZE,
  borderRadius: "50%",
  margin: "0 5px",
  background: "var(--color-secondary,#64748b)",
  border: "none",
  outline: "none",
  cursor: "pointer",
  opacity: 0.44,
  transition: "opacity 0.18s, background 0.18s, box-shadow 0.16s",
};
const DOT_ACTIVE_STYLE = {
  background: "var(--color-primary,#3b82f6)",
  opacity: 1,
  boxShadow: "0 2px 9px 0 rgba(59,130,246,0.13)"
};

export function Carousel({
  items,
  children,
  loop = false,
  autoPlay = false,
  autoPlayInterval = 4000,
  showIndicators = true,
  showArrows = true,
  onSlideChange,
  className = "",
  style = {},
  ...rest
}) {
  const slides = items || React.Children.toArray(children);
  const total = slides.length;
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);

  const autoplayRef = useRef();
  const containerRef = useRef();
  const touchData = useRef({ x1: 0, x2: 0 });

  // Move to next slide
  const move = useCallback((idx, opts = {}) => {
    if (!total) return;
    let nextIdx = idx;
    if (loop) {
      if (nextIdx < 0) nextIdx = total - 1;
      if (nextIdx >= total) nextIdx = 0;
    } else {
      nextIdx = Math.max(0, Math.min(nextIdx, total - 1));
    }
    setAnimating(true);
    setCurrent(nextIdx);
    if (onSlideChange) onSlideChange(nextIdx);
    setTimeout(() => setAnimating(false), 400); // duration must match CSS
  }, [loop, onSlideChange, total]);

  // Keyboard navigation
  const handleKey = (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    switch (e.key) {
      case "ArrowRight":
        move(current + 1);
        e.preventDefault();
        break;
      case "ArrowLeft":
        move(current - 1);
        e.preventDefault();
        break;
      case "Home":
        move(0);
        e.preventDefault();
        break;
      case "End":
        move(total - 1);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  // Play slides
  useEffect(() => {
    if (!autoPlay || paused || total < 2) return;
    autoplayRef.current = setInterval(() => move(current + 1), autoPlayInterval);
    return () => clearInterval(autoplayRef.current);
  }, [autoPlay, paused, current, autoPlayInterval, move, total]);

  // Pause on hover/focus
  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);
  const handleFocusIn = () => setPaused(true);
  const handleFocusOut = (e) => {
    if (!containerRef.current.contains(e.relatedTarget)) setPaused(false);
  };

  // Swipe support (touch/pointer)
  const onPointerDown = e => {
    if (e.pointerType === "touch" || e.type === "touchstart") {
      touchData.current.x1 = e.pageX || e.touches[0]?.clientX || 0;
      touchData.current.x2 = 0;
    }
  };
  const onPointerMove = e => {
    if (e.pointerType === "touch" || e.type === "touchmove") {
      touchData.current.x2 = e.pageX || e.touches[0]?.clientX || 0;
    }
  };
  const onPointerUp = e => {
    const dx = (touchData.current.x2 || (e.pageX || e.changedTouches?.[0]?.clientX || 0)) - touchData.current.x1;
    if (Math.abs(dx) > 35) {
      if (dx < 0) move(current + 1);
      else move(current - 1);
    }
    touchData.current = { x1: 0, x2: 0 };
  };

  // Responsive: slides take full width; enable horizontal scroll for mobile (optional)
  // For transition: use translateX to animate movement.
  const slideWidth = 100; // %
  const offset = -(current * slideWidth);

  return (
    <section
      className={`kavia-carousel-root ${className}`}
      ref={containerRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Carousel"
      style={{
        ...style,
        background: "var(--color-surface,#fff)",
        borderRadius: 14,
        boxShadow: "0 2.5px 12px 0 rgba(59,130,246,0.07)",
        border: "1px solid var(--border-color,#e5e7eb)",
        maxWidth: 520,
        width: "100%",
        margin: "17px auto",
        padding: 0,
        outline: "none",
        position: "relative",
        overflow: "visible",
      }}
      onKeyDown={handleKey}
      tabIndex={0}
      role="region"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
      {...rest}
    >
      <div
        className="kavia-carousel-track"
        style={{
          display: "flex",
          flexDirection: "row",
          transition: animating
            ? "transform 0.42s cubic-bezier(0.76,0,0.24,1)"
            : "none",
          willChange: "transform",
          transform: `translateX(${offset}%)`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((child, idx) => (
          <div
            className="kavia-carousel-slide"
            key={idx}
            aria-hidden={idx !== current}
            aria-roledescription="slide"
            tabIndex={idx === current ? 0 : -1}
            style={{
              minWidth: "100%",
              flex: "0 0 100%",
              outline: idx === current ? "2px solid var(--color-primary,#3b82f6)" : "none",
              boxSizing: "border-box",
              opacity: idx === current ? 1 : 0.85,
              userSelect: idx === current ? "auto" : "none",
              pointerEvents: idx === current ? "auto" : "none",
              background: "var(--color-surface,#fff)",
              transition: "opacity 0.18s",
              padding: "24px 15px 24px 15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 140,
            }}
          >
            {child}
          </div>
        ))}
      </div>
      {/* Controls */}
      {showArrows && total > 1 && (
        <div
          className="kavia-carousel-arrows"
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            pointerEvents: "none",
            zIndex: 5,
            transform: "translateY(-50%)",
          }}
        >
          <button
            type="button"
            aria-label="Previous Slide"
            onClick={() => move(current - 1)}
            style={{
              ...ARROW_BTN_STYLE,
              pointerEvents: "auto",
              left: 0,
              marginLeft: 10,
              boxShadow: "0 1.5px 9px rgba(59,130,246,0.04)",
              visibility: loop || current > 0 ? "visible" : "hidden",
              opacity: loop || current > 0 ? 1 : 0.19,
            }}
            tabIndex={0}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            aria-label="Next Slide"
            onClick={() => move(current + 1)}
            style={{
              ...ARROW_BTN_STYLE,
              pointerEvents: "auto",
              right: 0,
              marginRight: 10,
              boxShadow: "0 1.5px 9px rgba(59,130,246,0.04)",
              visibility: loop || current < total - 1 ? "visible" : "hidden",
              opacity: loop || current < total - 1 ? 1 : 0.19,
            }}
            tabIndex={0}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      )}
      {/* Pagination dots */}
      {showIndicators && total > 1 && (
        <div
          className="kavia-carousel-dots"
          role="group"
          aria-label="Slide navigation"
          style={{
            textAlign: "center",
            margin: "19px 0 0 0",
            display: "flex",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              style={Object.assign(
                {},
                DOT_BASE,
                idx === current ? DOT_ACTIVE_STYLE : {}
              )}
              aria-label={
                idx === current
                  ? `Slide ${idx + 1} of ${total} (current)`
                  : `Go to slide ${idx + 1}`
              }
              aria-current={idx === current ? "true" : undefined}
              onClick={() => move(idx)}
              tabIndex={0}
              type="button"
            />
          ))}
        </div>
      )}
      {/* Live region for screen readers */}
      <div
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(1px,1px,1px,1px)",
          clipPath: "inset(50%)",
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {`Slide ${current + 1} of ${total}`}
      </div>
    </section>
  );
}

export default Carousel;
