"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { getPublicPosts, type PublicPost } from "@/lib/postApi";

function extractText(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

/** Fallback items aligned with TinyAdds platform data and branding */
const FALLBACK_SLIDES = [
  {
    id: "fb-1",
    title: "Verified Business Directory",
    image: "/ads/minimalist-fb-ad.png",
    author: "Amitaujas LLP",
    role: "Verified Business Partner",
    company: "TinyAdds",
    quote:
      "TinyAdds has completely transformed how local customers discover our services. The targeted ads deliver genuine leads effortlessly.",
    emotion: "Trusted",
  },
  {
    id: "fb-2",
    title: "Prime Property & Automotive Showcase",
    image: "/ads/section-banner-sale.png",
    author: "Shree Sai Motors",
    role: "Automotive & Property",
    company: "TinyAdds",
    quote:
      "A seamless advertising and discovery experience. Reaching the right audience in Gujarat has never been faster or more reliable.",
    emotion: "Excited",
  },
  {
    id: "fb-3",
    title: "Festive Deals & Local Marketplace",
    image: "/ads/black-friday-standy.png",
    author: "Local Traders Hub",
    role: "Retail & Electronics",
    company: "TinyAdds",
    quote:
      "Discover the best local items, products, and services across all active categories with direct seller contact.",
    emotion: "Happy",
  },
];

type SlideItem = {
  id: string;
  title: string;
  image: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  emotion?: string;
};

export default function SliderBannerCarousel() {
  const [sliderAds, setSliderAds] = useState<PublicPost[]>([]);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let active = true;
    getPublicPosts({ banner: "slider-banner", limit: 20 }) // Slider banner by slug
      .then((res) => {
        if (!active) return;
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setSliderAds(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load slider banner carousel:", err);
      });

    return () => {
      active = false;
    };
  }, []);

  const items: SlideItem[] = sliderAds.length > 0
    ? sliderAds.map((post) => ({
        id: post.id,
        title: post.title,
        image: post.image || "/ads/minimalist-fb-ad.png",
        author: post.contactPerson || post.title,
        role: [
          Array.isArray(post.tags) && post.tags.length > 0
            ? (typeof post.tags[0] === "object" && post.tags[0] !== null && "name" in post.tags[0] ? post.tags[0].name : String(post.tags[0]))
            : "",
          post.searchCategory?.name,
          post.searchGroup?.name,
        ].filter(Boolean).join(" • ") || "Featured Advertiser",
        company: post.searchGroup?.name || "TinyAdds",
        quote: extractText(post.description) || post.title,
        emotion: post.emotion?.name,
      }))
    : FALLBACK_SLIDES;

  const total = items.length;

  const goTo = useCallback((dir: 1 | -1) => {
    if (total <= 1) return;
    setSlideDirection(dir === 1 ? "next" : "prev");
    setAnimating(true);
    setIndex((prev) => (prev + dir + total) % total);

    // Reset animation state after slide transition completes
    window.setTimeout(() => {
      setAnimating(false);
    }, 450);
  }, [total]);

  const startTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (total <= 1) return;
    timer.current = setInterval(() => {
      if (!document.hidden) {
        goTo(1);
      }
    }, 4500);
  }, [goTo, total]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [startTimer]);

  const manual = (dir: 1 | -1) => {
    goTo(dir);
    startTimer();
  };

  const currentSlide = items[index];

  return (
    <section className="lb-section lb-soft lb-slider-carousel-section py-5">
      <div className="container">
        <div className="lb-head text-center mb-4">
          <span className="lb-badge">Featured Stories</span>
          <h2>Top Banner Showcase</h2>
        </div>

        {/* Carousel Container */}
        <div className="position-relative overflow-hidden lb-slider-single-wrap">
          {currentSlide.id.startsWith("fb-") ? (
            <div
              key={currentSlide.id + index}
              className={`lb-theme-carousel-card position-relative shadow-sm mx-1 ${
                animating
                  ? slideDirection === "next"
                    ? "lb-slide-in-right"
                    : "lb-slide-in-left"
                  : ""
              }`}
            >
              <div className="w-100 p-2 p-md-3">
                <div className="lb-theme-carousel-img-box">
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title || currentSlide.author}
                    className="lb-theme-carousel-img"
                  />
                </div>
              </div>
            </div>
          ) : (
            <Link
              href={`/listings/${currentSlide.id}`}
              key={currentSlide.id + index}
              className={`lb-theme-carousel-card position-relative shadow-sm mx-1 text-decoration-none d-block text-reset ${
                animating
                  ? slideDirection === "next"
                    ? "lb-slide-in-right"
                    : "lb-slide-in-left"
                  : ""
              }`}
            >
              <div className="w-100 p-2 p-md-3">
                <div className="lb-theme-carousel-img-box">
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title || currentSlide.author}
                    className="lb-theme-carousel-img"
                  />
                </div>
              </div>
            </Link>
          )}

          {/* Navigation Controls */}
          {total > 1 && (
            <div className="lb-theme-carousel-nav">
              <button
                type="button"
                className="lb-theme-nav-btn"
                onClick={() => manual(-1)}
                aria-label="Previous slide"
              >
                <i className="bi bi-arrow-left" />
              </button>
              <button
                type="button"
                className="lb-theme-nav-btn"
                onClick={() => manual(1)}
                aria-label="Next slide"
              >
                <i className="bi bi-arrow-right" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
