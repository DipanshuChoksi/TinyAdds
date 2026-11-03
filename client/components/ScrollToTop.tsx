"use client";

import { useEffect, useState } from "react";

/** Pill-shaped "back to top" button: right edge, vertically centred, shown after scrolling. */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className={`lb-totop${visible ? " is-visible" : ""}`}
      onClick={toTop}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
    >
      <i className="bi bi-arrow-up"></i>
      <span>TOP</span>
    </button>
  );
}
