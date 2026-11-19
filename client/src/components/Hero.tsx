"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import CategoryMarquee from "./CategoryMarquee";
import { getPublicPosts, type PublicPost } from "@/lib/postApi";

type SectionSlide = {
  id: string;
  title: string;
  image: string;
  tag?: string;
  link?: string;
};

const FALLBACK_SECTION_SLIDES: SectionSlide[] = [
  {
    id: "fb-sec-1",
    title: "Minimalist Modern Advertising",
    image: "/home/Banner1.png",
    tag: "Trending Spotlight",
    link: "/listings",
  },
  {
    id: "fb-sec-2",
    title: "Special Festive Offers & Discounts",
    image: "/home/Banner2.png",
    tag: "Exclusive Deals",
    link: "/listings",
  },
];

export default function Hero() {
  const [standyAds, setStandyAds] = useState<PublicPost[]>([]);
  const [sectionAds, setSectionAds] = useState<PublicPost[]>([]);
  const [standyIndex, setStandyIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [sectionAnimating, setSectionAnimating] = useState(false);
  const [sectionDirection, setSectionDirection] = useState<"next" | "prev">("next");
  const [isSectionPaused, setIsSectionPaused] = useState(false);

  const standyTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      getPublicPosts({ banner: "6af6ec34da18ee7ad2da4e30", limit: 20 }), //Standy slider
      getPublicPosts({ banner: "6af6ec4eda18ee7ad2da4e32", limit: 20 }), // Section banner
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

  // Build section slides list: show fetched ads if any exist; only show fallbacks if none exist
  const sectionSlides: SectionSlide[] =
    sectionAds.length > 0
      ? sectionAds.map((post) => ({
          id: post.id,
          title: post.title,
          image: post.image || "/ads/minimalist-fb-ad.png",
          tag: post.tag || post.searchCategory?.name || "Featured Deal",
          link: `/listings/${post.id}`,
        }))
      : FALLBACK_SECTION_SLIDES;

  const totalSectionSlides = sectionSlides.length;

  // Section Banner navigation
  const goToSection = useCallback(
    (dir: 1 | -1) => {
      if (totalSectionSlides <= 1) return;
      setSectionDirection(dir === 1 ? "next" : "prev");
      setSectionAnimating(true);
      setSectionIndex((prev) => (prev + dir + totalSectionSlides) % totalSectionSlides);

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setSectionAnimating(false);
      }, 400);
    },
    [totalSectionSlides]
  );

  const goToSectionIndex = useCallback(
    (targetIdx: number) => {
      if (targetIdx === sectionIndex || targetIdx < 0 || targetIdx >= totalSectionSlides) return;
      setSectionDirection(targetIdx > sectionIndex ? "next" : "prev");
      setSectionAnimating(true);
      setSectionIndex(targetIdx);

      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      animTimeoutRef.current = setTimeout(() => {
        setSectionAnimating(false);
      }, 400);
    },
    [sectionIndex, totalSectionSlides]
  );

  // Auto-rotation timer for Section Carousel (pauses on hover)
  useEffect(() => {
    if (sectionTimer.current) clearInterval(sectionTimer.current);
    if (totalSectionSlides <= 1 || isSectionPaused) return;

    sectionTimer.current = setInterval(() => {
      if (!document.hidden) {
        goToSection(1);
      }
    }, 4000);

    return () => {
      if (sectionTimer.current) clearInterval(sectionTimer.current);
    };
  }, [goToSection, isSectionPaused, totalSectionSlides]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToSection(-1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    goToSection(1);
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    goToSectionIndex(idx);
  };

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
      standyTimer.current = setInterval(nextStandy, 4500);
      return () => {
        if (standyTimer.current) clearInterval(standyTimer.current);
      };
    }
  }, [standyAds.length, nextStandy]);

  const currentStandy = standyAds[standyIndex];
  const standyImage = currentStandy?.image || "/ads/black-friday-standy.png";
  const currentSlide = sectionSlides[sectionIndex] || sectionSlides[0];

  return (
    <section className="lb-hero lb-hero--showcase">
      <div className="container position-relative">
        <CategoryMarquee />

        <div className="row align-items-center g-4 pt-4 pb-4">
          {/* Left Column: Carousel (Wider width, same height as sell standy) */}
          <div className="col-12 col-lg-7 col-xl-8">
            <div
              className="lb-hero-main-carousel"
              onMouseEnter={() => setIsSectionPaused(true)}
              onMouseLeave={() => setIsSectionPaused(false)}
            >
              <div className="lb-hero-main-carousel-track">
                <Link
                  href={currentSlide.link || "/listings"}
                  key={currentSlide.id + sectionIndex}
                  className={`lb-hero-main-carousel-slide ${
                    sectionAnimating
                      ? sectionDirection === "next"
                        ? "lb-slide-in-right"
                        : "lb-slide-in-left"
                      : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                  />
                  {currentSlide.tag && (
                    <span className="lb-hero-main-carousel-badge">
                      <i className="bi bi-stars" aria-hidden="true" />
                      {currentSlide.tag}
                    </span>
                  )}
                </Link>
              </div>

              {/* Navigation Controls: Left & Right Arrows for manual handling */}
              {totalSectionSlides > 1 && (
                <div className="lb-hero-main-carousel-controls">
                  <button
                    type="button"
                    className="lb-hero-main-carousel-btn lb-hero-main-carousel-btn--prev"
                    onClick={handlePrev}
                    aria-label="Previous banner slide"
                  >
                    <i className="bi bi-chevron-left" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="lb-hero-main-carousel-btn lb-hero-main-carousel-btn--next"
                    onClick={handleNext}
                    aria-label="Next banner slide"
                  >
                    <i className="bi bi-chevron-right" aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Slide Dots Indicator */}
              {totalSectionSlides > 1 && (
                <div className="lb-hero-main-carousel-dots">
                  {sectionSlides.map((slide, idx) => (
                    <button
                      key={slide.id + idx}
                      type="button"
                      className={`lb-hero-main-carousel-dot ${
                        idx === sectionIndex ? "active" : ""
                      }`}
                      onClick={(e) => handleDotClick(e, idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sell Vala Img (Standy Banner), same height */}
          <div className="col-12 col-lg-5 col-xl-4">
            <div className="lb-hero-showcase">
              <div className="lb-showcase-ad lb-showcase-ad--standy">
                {currentStandy ? (
                  <Link
                    href={`/listings/${currentStandy.id}`}
                    className="d-block w-100 h-100 text-decoration-none"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={currentStandy.id}
                      src={standyImage}
                      alt={currentStandy.title || "Featured TinyAdds ad"}
                    />
                  </Link>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key="standy-fallback"
                    src={standyImage}
                    alt="Featured TinyAdds sale ad"
                  />
                )}

                {standyAds.length > 1 && (
                  <div className="lb-showcase-controls">
                    <button
                      type="button"
                      onClick={prevStandy}
                      aria-label="Previous featured ad"
                    >
                      <i className="bi bi-chevron-left" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={nextStandy}
                      aria-label="Next featured ad"
                    >
                      <i className="bi bi-chevron-right" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
