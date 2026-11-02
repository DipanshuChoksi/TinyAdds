'use client';
import { useCallback, useMemo, useState } from 'react';

const SORTERS = {
  popular: (a, b) => b.popularity - a.popularity,
  rated: (a, b) => b.rating - a.rating,
  recent: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
};

/** Client-side filter + sort for listing arrays. */
export function useListingFilters(items, initial = {}) {
  const [filters, setFilters] = useState({
    city: '',
    category: '',
    emotion: '',
    sort: 'popular',
    ...initial,
  });

  const setFilter = useCallback((key, value) => setFilters((f) => ({ ...f, [key]: value })), []);

  const result = useMemo(() => {
    const { city, category, emotion, sort } = filters;
    return items
      .filter((i) => !city || i.city.toLowerCase() === city.toLowerCase())
      .filter((i) => !category || i.category === category)
      .filter((i) => !emotion || i.emotion === emotion)
      .sort(SORTERS[sort] ?? SORTERS.popular);
  }, [items, filters]);

  return { filters, setFilter, result };
}
