'use client';
import { useEffect, useRef } from 'react';

/** Calls `handler` when a click/touch happens outside the returned ref. */
export function useClickOutside<T extends HTMLElement = HTMLDivElement>(handler: (e: Event) => void) {
  const ref = useRef<T>(null);
  const saved = useRef(handler);

  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) saved.current(e);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, []);

  return ref;
}
