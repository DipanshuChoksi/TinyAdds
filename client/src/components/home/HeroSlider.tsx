'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useInterval } from '@/hooks/useInterval';
import { HERO_SLIDES } from '@/data/site';

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), paused ? null : 4000);

  return (
    <div
      className="position-relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="ratio ratio-16x9 overflow-hidden rounded-5">
        {HERO_SLIDES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`Slide ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width: 992px) 100vw, 50vw"
            style={{ objectFit: 'cover', opacity: i === index ? 1 : 0, transition: 'opacity .6s ease' }}
          />
        ))}
      </div>
      <div className="d-flex justify-content-center gap-2 mt-3">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`btn p-0 rounded-circle ${i === index ? 'bg-primary' : 'bg-secondary-subtle'}`}
            style={{ width: 10, height: 10 }}
          />
        ))}
      </div>
    </div>
  );
}
