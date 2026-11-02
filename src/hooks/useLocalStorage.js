'use client';
import { useCallback, useEffect, useState } from 'react';

/** SSR-safe localStorage state. Reads after mount to avoid hydration mismatch. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, [key]);

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        try {
          if (resolved === null || resolved === undefined) window.localStorage.removeItem(key);
          else window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage may be unavailable */
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, set, ready];
}
