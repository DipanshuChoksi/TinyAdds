'use client';
import { useCallback, useMemo, useState } from 'react';
import type { SortKey } from '@/types';

export interface FilterableItem {
  city: string;
  category?: string;
  emotion?: string;
  popularity: number;
  rating: number;
  createdAt: string;
}

export interface Filters {
  city: string;
  category: string;
  emotion: string;
  sort: SortKey;
}

const SORTERS: Record<SortKey, (a: FilterableItem, b: FilterableItem) => number> = {
  popular: (a, b) => b.popularity - a.popularity,
  rated: (a, b) => b.rating - a.rating,
  recent: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
};

/** Client-side filter + sort for listing arrays. */
export function useListingFilters<T extends FilterableItem>(items: T[], initial: Partial<Filters> = {}) {
  const [filters, setFilters] = useState<Filters>({
    city: '',
    category: '',
    emotion: '',
    sort: 'popular',
    ...initial,
  });

  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value })),
    []
  );

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
