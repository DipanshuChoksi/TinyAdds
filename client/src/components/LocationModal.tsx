"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OTHER_CITIES, POPULAR_CITIES } from "@/data/cities";

type Props = {
  open: boolean;
  current: string;
  onClose: () => void;
  onSelect: (city: string) => void;
};

const slug = (city: string) => city.toLowerCase().replace(/\s+/g, "-");

/** City image from /public/cities/<slug>.png – falls back to an icon if the file is missing. */
function CityIcon({ city }: { city: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="lb-city-ico">
      {failed ? (
        <i className="bi bi-buildings"></i>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/cities/${slug(city)}.png`} alt="" onError={() => setFailed(true)} />
      )}
    </span>
  );
}

/** City picker: search + auto-scrolling popular cities (one line) + "View All Cities" list. */
export default function LocationModal({ open, current, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const track = useRef<HTMLUListElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const q = query.trim().toLowerCase();
  const popular = useMemo(() => POPULAR_CITIES.filter((c) => c.toLowerCase().includes(q)), [q]);
  const others = useMemo(() => OTHER_CITIES.filter((c) => c.toLowerCase().includes(q)), [q]);
  const showOthers = showAll || q.length > 0;

  /** Move the carousel one step; wraps back to the start at the end. */
  const slide = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 120;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 4) return;
    if (dir === 1 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && el.scrollLeft <= 4) el.scrollTo({ left: max, behavior: "smooth" });
    else el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => { if (!paused.current) slide(1); }, 2200);
    return () => clearInterval(id);
  }, [open, slide]);

  if (!open) return null;

  const pick = (city: string) => {
    onSelect(city);
    setQuery("");
    setShowAll(false);
    onClose();
  };

  return (
    <div className="lb-city-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Select your city">
      <div className="lb-city-modal">
        <button type="button" className="lb-city-close" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button>

        <div className="lb-city-search">
          <i className="bi bi-search"></i>
          <input type="text" className="form-control" placeholder="Search for your city" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
        </div>

        {popular.length > 0 && (
          <>
            <h6 className="lb-city-head">Popular Cities</h6>
            <div className="lb-city-carousel" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
              <button type="button" className="lb-city-arrow" onClick={() => slide(-1)} aria-label="Previous cities"><i className="bi bi-chevron-left"></i></button>
              <ul className="lb-city-popular" ref={track}>
                {popular.map((city) => (
                  <li key={city}>
                    <button type="button" className={city === current ? "active" : ""} onClick={() => pick(city)}>
                      <CityIcon city={city} />
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="lb-city-arrow" onClick={() => slide(1)} aria-label="Next cities"><i className="bi bi-chevron-right"></i></button>
            </div>
          </>
        )}

        {showOthers && (
          <div className="lb-city-others-wrap">
            <h6 className="lb-city-head lb-city-head-line">Other Cities</h6>
            {others.length > 0 ? (
              <ul className="lb-city-others">
                {others.map((city) => (
                  <li key={city}>
                    <button type="button" className={city === current ? "active" : ""} onClick={() => pick(city)}>{city}</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-3 mb-0">No city found.</p>
            )}
          </div>
        )}

        {!q && (
          <button type="button" className="lb-city-toggle" onClick={() => setShowAll((s) => !s)}>
            {showAll ? "Hide All Cities" : "View All Cities"}
          </button>
        )}
      </div>
    </div>
  );
}
