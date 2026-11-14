"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getPublicPosts, type PublicPost } from "@/lib/postApi";

const CARDS_PER_PAGE = 12; // 4 columns x 3 rows grid
const COPIES = 3; // [clone][real][clone] for infinite continuous loop

export default function Listings() {
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [loading, setLoading] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let active = true;
    getPublicPosts({ banner: "Listing ads", limit: 100 })
      .then((res) => {
        if (!active) return;
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setPosts(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch listing ads:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Split posts into pages of 12 items (4 columns x 3 rows)
  const pages: PublicPost[][] = [];
  if (posts.length > 0) {
    for (let i = 0; i < posts.length; i += CARDS_PER_PAGE) {
      pages.push(posts.slice(i, i + CARDS_PER_PAGE));
    }
  }

  const numPages = pages.length;
  // If we have more than 1 page of 12 cards, enable infinite multi-page carousel
  const hasMultiplePages = numPages > 1;

  // Start on the real middle copy if multiple pages, else 0
  const [pos, setPos] = useState(hasMultiplePages ? numPages : 0);

  // Measure page container width on resize
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      if (containerRef.current) {
        setStep(containerRef.current.offsetWidth);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [numPages]);

  // Slide left or right
  const go = useCallback((dir: 1 | -1) => {
    if (!hasMultiplePages) return;
    setAnimate(true);
    setPos((p) => p + dir);
  }, [hasMultiplePages]);

  const startTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (!hasMultiplePages) return;
    timer.current = setInterval(() => {
      if (!document.hidden) {
        go(1);
      }
    }, 6000);
  }, [go, hasMultiplePages]);

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

  // Seamless jump without animation when reaching edge copy
  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (!hasMultiplePages || e.target !== trackRef.current) return;
    if (pos >= numPages && pos < 2 * numPages) return;
    const norm = ((((pos - numPages) % numPages) + numPages) % numPages) + numPages;
    setAnimate(false);
    setPos(norm);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
  };

  const slidePages = hasMultiplePages
    ? Array.from({ length: COPIES }, (_, copy) =>
        pages.map((pageCards) => ({ pageCards, copy }))
      ).flat()
    : pages.map((pageCards) => ({ pageCards, copy: 0 }));

  if (loading && posts.length === 0) {
    return null;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      <section className="lb-section lb-soft py-5">
        <div className="container" ref={containerRef}>
          <div className="lb-head text-center mb-4 position-relative">
            <span className="lb-badge">hand-picked listing</span>
            <h2>Top-notch items</h2>

            {/* Navigation arrows when there are multiple pages of 12 */}
            {hasMultiplePages && (
              <div className="lb-listings-nav d-none d-md-flex align-items-center gap-2 position-absolute end-0 top-50 translate-middle-y">
                <button
                  type="button"
                  className="lb-listings-nav-btn"
                  onClick={() => manual(-1)}
                  aria-label="Previous 12 items"
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <button
                  type="button"
                  className="lb-listings-nav-btn"
                  onClick={() => manual(1)}
                  aria-label="Next 12 items"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            )}
          </div>

          {/* Carousel Viewport */}
          <div className="lb-listings-viewport position-relative overflow-hidden">
            <div
              ref={trackRef}
              className="lb-listings-track d-flex"
              style={{
                transform: hasMultiplePages ? `translate3d(${-pos * step}px, 0, 0)` : "none",
                transition: animate ? "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
              }}
              onTransitionEnd={onTransitionEnd}
            >
              {slidePages.map(({ pageCards, copy }, pageIdx) => (
                <div
                  key={`${copy}-page-${pageIdx}`}
                  className="lb-listings-page-item flex-shrink-0"
                  style={{ width: step || "100%" }}
                >
                  {/* 4 by 3 Grid Layout (4 columns on desktop, 3 rows for 12 cards) */}
                  <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4 px-1">
                    {pageCards.map((item) => (
                      <div className="col" key={`${copy}-${item.id}`}>
                        <article className="lb-card h-100 shadow-sm">
                          <div className="lb-card-img" style={{ height: 210, overflow: "hidden" }}>
                            <img
                              src={item.image || "/ads/minimalist-fb-ad.png"}
                              alt={item.title}
                              loading="lazy"
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <div className="lb-card-body d-flex flex-column">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="badge bg-light text-dark border">
                                <i className="bi bi-clock me-1 text-muted" />
                                {item.fromDate || "Active"}
                              </span>
                              {item.emotion && (
                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                  {item.emotion}
                                </span>
                              )}
                            </div>

                            <h3 className="lb-card-title mb-2">
                              <span className="d-inline-block text-truncate w-100" title={item.title}>
                                {item.title}
                              </span>
                            </h3>

                            <p className="lb-meta mb-3">
                              {item.address ? (
                                <span className="text-truncate d-inline-block" style={{ maxWidth: 200 }}>
                                  <i className="bi bi-geo-alt me-1 text-primary" /> {item.address}
                                </span>
                              ) : (
                                <span className="text-muted small">
                                  <i className="bi bi-geo-alt me-1" /> Gujarat
                                </span>
                              )}
                            </p>

                            <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                              <span className="lb-chip">
                                {item.searchCategory || item.searchGroup || "Listing Ad"}
                              </span>
                              <span className="text-muted small text-truncate" style={{ maxWidth: 120 }}>
                                {item.contactNo ? <i className="bi bi-telephone me-1" /> : null}
                                {item.contactPerson || "TinyAdds"}
                              </span>
                            </div>
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Bottom Navigation Controls */}
          {hasMultiplePages && (
            <div className="d-flex d-md-none justify-content-center align-items-center gap-3 mt-4">
              <button
                type="button"
                className="lb-listings-nav-btn"
                onClick={() => manual(-1)}
                aria-label="Previous 12 items"
              >
                <i className="bi bi-chevron-left" />
              </button>
              <button
                type="button"
                className="lb-listings-nav-btn"
                onClick={() => manual(1)}
                aria-label="Next 12 items"
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
