"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import CategoryMarquee from "./CategoryMarquee";
import { getPublicPosts, type PublicPost } from "@/lib/postApi";

export default function Hero() {
  const [standyAds, setStandyAds] = useState<PublicPost[]>([]);
  const [sectionAds, setSectionAds] = useState<PublicPost[]>([]);
  const [standyIndex, setStandyIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);

  const standyTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      getPublicPosts({ banner: "Standy slider", limit: 20 }),
      getPublicPosts({ banner: "Section banner", limit: 20 }),
    ])
      .then(([standyRes, sectionRes]) => {
        if (!active) return;
        if (standyRes?.success && Array.isArray(standyRes.data)) {
          setStandyAds(standyRes.data);
        }
        if (sectionRes?.success && Array.isArray(sectionRes.data)) {
          setSectionAds(sectionRes.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load hero ads:", err);
      });

    return () => {
      active = false;
    };
  }, []);

  // Standy auto-rotation
  const nextStandy = useCallback(() => {
    setStandyIndex((prev) => {
      const total = standyAds.length > 0 ? standyAds.length : 1;
      return (prev + 1) % total;
    });
  }, [standyAds.length]);

  const prevStandy = useCallback(() => {
    setStandyIndex((prev) => {
      const total = standyAds.length > 0 ? standyAds.length : 1;
      return (prev - 1 + total) % total;
    });
  }, [standyAds.length]);

  useEffect(() => {
    if (standyAds.length > 1) {
      standyTimer.current = setInterval(nextStandy, 4000);
      return () => {
        if (standyTimer.current) clearInterval(standyTimer.current);
      };
    }
  }, [standyAds.length, nextStandy]);

  // Section banner auto-rotation
  const nextSection = useCallback(() => {
    setSectionIndex((prev) => {
      const total = sectionAds.length > 0 ? sectionAds.length : 1;
      return (prev + 1) % total;
    });
  }, [sectionAds.length]);

  const prevSection = useCallback(() => {
    setSectionIndex((prev) => {
      const total = sectionAds.length > 0 ? sectionAds.length : 1;
      return (prev - 1 + total) % total;
    });
  }, [sectionAds.length]);

  useEffect(() => {
    if (sectionAds.length > 1) {
      sectionTimer.current = setInterval(nextSection, 4500);
      return () => {
        if (sectionTimer.current) clearInterval(sectionTimer.current);
      };
    }
  }, [sectionAds.length, nextSection]);

  const currentStandy = standyAds[standyIndex];
  const currentSection = sectionAds[sectionIndex];

  return (
    <>
      <section className="lb-hero pb-4">
        <img
          src="https://html.aqlova.com/listbnb-prv/listbnb/assets/img/hero/shape-1-3.png"
          alt=""
          className="lb-shape lb-hero-shape-bg d-none d-lg-block"
        />
        <div className="container position-relative">
          <CategoryMarquee />

          {/* Hero Ads Row matching tinyadds.com */}
          <div className="row g-3 align-items-stretch pt-4 pb-2">
            {/* Left Col: Mascot + Standy Slider (Black Friday spot) */}
            <div className="col-12 col-lg-5">
              <div className="row g-2 align-items-center h-100">
                {/* Character */}
                <div className="col-5 text-center">
                  <img
                    src="/ads/tinyadds-character.png"
                    alt="TinyAdds Mascot"
                    className="img-fluid"
                    style={{ maxHeight: 420, objectFit: "contain" }}
                  />
                </div>

                {/* Standy Slider */}
                <div className="col-7">
                  <div className="lb-standy-card position-relative overflow-hidden rounded-3 shadow-sm h-100">
                    {currentStandy ? (
                      <div className="lb-ad-slide">
                        <img
                          src={currentStandy.image || "/ads/black-friday-standy.png"}
                          alt={currentStandy.title || "Standy ad"}
                          className="w-100 d-block rounded-3"
                          style={{ height: 420, objectFit: "cover" }}
                        />
                        <div className="lb-ad-overlay">
                          <span className="badge bg-danger mb-1">Standy Ad</span>
                          <h6 className="text-white mb-0 text-truncate">{currentStandy.title}</h6>
                        </div>
                      </div>
                    ) : (
                      <div className="lb-ad-slide">
                        <img
                          src="/ads/black-friday-standy.png"
                          alt="Black Friday Sale"
                          className="w-100 d-block rounded-3"
                          style={{ height: 420, objectFit: "cover" }}
                        />
                      </div>
                    )}

                    {standyAds.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="lb-slider-arrow lb-arrow-prev"
                          onClick={prevStandy}
                          aria-label="Previous standy ad"
                        >
                          <i className="bi bi-chevron-left" />
                        </button>
                        <button
                          type="button"
                          className="lb-slider-arrow lb-arrow-next"
                          onClick={nextStandy}
                          aria-label="Next standy ad"
                        >
                          <i className="bi bi-chevron-right" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Section Banner (Minimalist Facebook Ads spot) */}
            <div className="col-12 col-lg-7">
              <div className="lb-slider-banner-card position-relative overflow-hidden rounded-3 shadow-sm h-100">
                {currentSection ? (
                  <div className="lb-ad-slide h-100">
                    <img
                      src={currentSection.image || "/ads/minimalist-fb-ad.png"}
                      alt={currentSection.title || "Section banner ad"}
                      className="w-100 h-100 d-block rounded-3"
                      style={{ minHeight: 420, objectFit: "cover" }}
                    />
                    <div className="lb-ad-overlay">
                      <span className="badge bg-primary mb-1">Section Banner</span>
                      <h5 className="text-white mb-0 text-truncate">{currentSection.title}</h5>
                    </div>
                  </div>
                ) : (
                  <div className="lb-ad-slide h-100">
                    <img
                      src="/ads/minimalist-fb-ad.png"
                      alt="Minimalist Facebook Ads"
                      className="w-100 h-100 d-block rounded-3"
                      style={{ minHeight: 420, objectFit: "cover" }}
                    />
                  </div>
                )}

                {sectionAds.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="lb-slider-arrow lb-arrow-prev"
                      onClick={prevSection}
                      aria-label="Previous section ad"
                    >
                      <i className="bi bi-chevron-left" />
                    </button>
                    <button
                      type="button"
                      className="lb-slider-arrow lb-arrow-next"
                      onClick={nextSection}
                      aria-label="Next section ad"
                    >
                      <i className="bi bi-chevron-right" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
