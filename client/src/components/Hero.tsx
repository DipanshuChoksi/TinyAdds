"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
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
  const standyImage = currentStandy?.image || "/ads/black-friday-standy.png";
  const sectionImage = currentSection?.image || "/ads/minimalist-fb-ad.png";

  return (
    <section className="lb-hero lb-hero--showcase">
      <div className="container position-relative">
        <CategoryMarquee />

        <div className="row align-items-center g-4 g-lg-5 pt-4 pb-4">
          <div className="col-12 col-lg-5">
            <div className="lb-hero-copy">
              <span className="lb-hero-kicker">
                <i className="bi bi-geo-alt-fill" aria-hidden="true" />
                Your local marketplace
              </span>
              <h1 className="lb-hero-title">
                Good finds.
                <span> Great local deals.</span>
              </h1>
              <p className="lb-hero-description">
                Discover businesses, products, and services around you. Buy, sell, and rent with TinyAdds.
              </p>
              <a href="/listings" className="btn lb-btn-primary lb-hero-cta">
                Explore listings
                <i className="bi bi-arrow-up-right" aria-hidden="true" />
              </a>
              <div className="lb-hero-highlights" aria-label="Marketplace options">
                <span>Buy</span>
                <span>Sell</span>
                <span>Rent</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="lb-hero-showcase">
              <div className="lb-showcase-stack">
                <div className="lb-showcase-ad lb-showcase-ad--section">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={currentSection?.id || "section-fallback"}
                    src={sectionImage}
                    alt={currentSection?.title || "Featured local business"}
                  />
                  {sectionAds.length > 1 && (
                    <div className="lb-showcase-controls">
                      <button type="button" onClick={prevSection} aria-label="Previous local spotlight">
                        <i className="bi bi-chevron-left" />
                      </button>
                      <button type="button" onClick={nextSection} aria-label="Next local spotlight">
                        <i className="bi bi-chevron-right" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="lb-showcase-ad lb-showcase-ad--standy">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={currentStandy?.id || "standy-fallback"}
                    src={standyImage}
                    alt={currentStandy?.title || "Featured TinyAdds ad"}
                  />
                  {standyAds.length > 1 && (
                    <div className="lb-showcase-controls">
                      <button type="button" onClick={prevStandy} aria-label="Previous featured ad">
                        <i className="bi bi-chevron-left" />
                      </button>
                      <button type="button" onClick={nextStandy} aria-label="Next featured ad">
                        <i className="bi bi-chevron-right" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
