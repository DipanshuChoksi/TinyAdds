'use client';
import { useCallback, useEffect, useState } from 'react';

type SetValue<T> = (next: T | ((prev: T) => T)) => void;

/** SSR-safe localStorage state. Reads after mount to avoid hydration mismatch. */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, [key]);

  const set = useCallback<SetValue<T>>(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
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
