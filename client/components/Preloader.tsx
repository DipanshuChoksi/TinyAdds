"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * The loader only appears when something is actually slow:
 *  - first visit: until the page has finished loading (hides the moment it is ready)
 *  - link clicks: only if the next page has not arrived after SHOW_DELAY ms
 * There is no forced minimum time. Set SHOW_DELAY to 0 to show it on every click.
 */
const SHOW_DELAY = 150; // ms to wait before a slow navigation shows the loader
const MAX_INITIAL = 4000; // first load: never keep the loader longer than this
const SAFETY = 10000; // a navigation that never finishes will not trap the user

export default function Preloader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true); // true in the server HTML => no flash of unstyled content
  const delayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPath = useRef(pathname);
  const booted = useRef(false);

  const clearTimers = () => {
    if (delayTimer.current) clearTimeout(delayTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
  };

  const hide = useCallback(() => {
    clearTimers();
    setVisible(false);
  }, []);

  const startNavigation = useCallback(() => {
    clearTimers();
    delayTimer.current = setTimeout(() => {
      setVisible(true);
      safetyTimer.current = setTimeout(() => setVisible(false), SAFETY);
    }, SHOW_DELAY);
  }, []);

  // 1) first load: hide as soon as the page is ready
  useEffect(() => {
    const done = () => {
      booted.current = true;
      hide();
    };
    const cap = setTimeout(done, MAX_INITIAL);
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
    return () => {
      clearTimeout(cap);
      window.removeEventListener("load", done);
      clearTimers();
    };
  }, [hide]);

  // 2) internal link clicks + browser back/forward
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page / #anchor / dropdown toggles
      startNavigation();
    };
    const onPop = () => {
      if (window.location.pathname !== lastPath.current) startNavigation();
    };
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, [startNavigation]);

  // 3) the new page is in place -> hide immediately (and cancel a pending show)
  useEffect(() => {
    lastPath.current = pathname;
    if (booted.current) hide();
  }, [pathname, hide]);

  // lock page scroll while the loader is up
  useEffect(() => {
    document.documentElement.classList.toggle("lb-loading", visible);
  }, [visible]);

  return (
    <div className={`lb-loader${visible ? "" : " is-hidden"}`} role="status" aria-live="polite" aria-busy={visible}>
      <div className="lb-loader-box">
        <div className="lb-loader-logo">
          Tiny<span>Adds</span>
        </div>
        <div className="lb-wave" aria-hidden="true"></div>
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
}
