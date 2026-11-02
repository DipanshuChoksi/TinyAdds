'use client';
import { useEffect, useRef } from 'react';

/** Calls `handler` when a click/touch happens outside the returned ref. */
export function useClickOutside(handler) {
  const ref = useRef(null);
  const saved = useRef(handler);

  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) saved.current(e);
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
