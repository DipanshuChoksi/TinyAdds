'use client';
import { useEffect, useState } from 'react';

/** Returns true once the page is scrolled past `threshold` px. */
export function useScrolledPast(threshold = 300): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return past;
}
