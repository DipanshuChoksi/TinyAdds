"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselCategory = {
  id: string;
  label: string;
  /** Photo for the card (remote URL or a file in /public). */
  image?: string;
  /** Gradient shown behind / instead of the photo */
  from: string;
  to: string;
  href?: string;
};

type Props = {
  items: CarouselCategory[];
  label: string;
  title: string;
  description: string;
  /** Time between automatic slides (ms) */
  interval?: number;
};

const COPIES = 3; // [clone][real][clone] -> seamless infinite loop

export default function CategoryCarousel({ items, label, title, description, interval = 3500 }: Props) {
  const n = items.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(n); // start on the middle (real) copy
  const [step, setStep] = useState(0); // card width + gap in px
  const [animate, setAnimate] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduceMotion = useRef(false);

  // measure one slide step (card width + gap), keep it in sync on resize
  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const a = el.children[0] as HTMLElement | undefined;
      const b = el.children[1] as HTMLElement | undefined;
      if (a && b) setStep(b.offsetLeft - a.offsetLeft);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // enable the slide transition only after the first positioning
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = useCallback((dir: 1 | -1) => setPos((p) => p + dir), []);

  // autoplay: keeps running; manual clicks just restart the countdown, they never stop it
  const startTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (reduceMotion.current) return;
    timer.current = setInterval(() => {
      if (!document.hidden) setPos((p) => p + 1);
    }, interval);
  }, [interval]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [startTimer]);

  const manual = (dir: 1 | -1) => {
    go(dir);
    startTimer();
  };

  // after a slide finishes, jump (without animation) back into the middle copy
  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== trackRef.current) return;
    if (pos >= n && pos < 2 * n) return;
    const norm = ((((pos - n) % n) + n) % n) + n;
    setAnimate(false);
    setPos(norm);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
  };

  // touch swipe
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) manual(dx < 0 ? 1 : -1);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") manual(1);
    if (e.key === "ArrowLeft") manual(-1);
  };

  const slides = Array.from({ length: COPIES }, (_, copy) => items.map((c) => ({ c, copy })));

  return (
    <div className="row align-items-center g-4 g-lg-5">
      <div className="col-lg-4">
        <span className="lb-popcat-label">{label}</span>
        <h2 className="lb-h2-left">{title}</h2>
        <p className="mt-3 mb-0">{description}</p>
        <div className="lb-popcat-nav">
          <button type="button" className="lb-popcat-btn" onClick={() => manual(-1)} aria-label="Previous category">
            <i className="bi bi-arrow-left"></i>
          </button>
          <button type="button" className="lb-popcat-btn" onClick={() => manual(1)} aria-label="Next category">
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      <div className="col-lg-8">
        <div
          className="lb-popcat-viewport"
          role="region"
          aria-roledescription="carousel"
          aria-label="Popular categories"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={trackRef}
            className="lb-popcat-track"
            style={{
              transform: `translate3d(${-pos * step}px, 0, 0)`,
              transition: animate ? undefined : "none",
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {slides.flat().map(({ c, copy }, i) => {
              const clone = copy !== 1;
              return (
                <a
                  key={`${copy}-${c.id}`}
                  href={c.href ?? "#"}
                  className="lb-popcat-card"
                  aria-hidden={clone || undefined}
                  tabIndex={clone ? -1 : undefined}
                  style={{ "--c1": c.from, "--c2": c.to } as React.CSSProperties}
                  data-i={i}
                >
                  {c.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="lb-popcat-img" src={c.image} alt="" loading="lazy" draggable={false} onError={(e) => (e.currentTarget.style.display = "none")} />
                  )}
                  <h3>{c.label}</h3>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
