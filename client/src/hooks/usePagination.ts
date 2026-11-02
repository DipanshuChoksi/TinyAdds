'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function usePagination(totalItems: number, pageSize = 12) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  // keep page valid when the list shrinks (e.g. after filtering)
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  const goTo = useCallback((n: number) => setPage(Math.min(Math.max(1, n), pageCount)), [pageCount]);

  const range = useMemo<[number, number]>(() => {
    const start = (page - 1) * pageSize;
    return [start, start + pageSize];
  }, [page, pageSize]);

  const paginate = useCallback(<T,>(items: T[]): T[] => items.slice(range[0], range[1]), [range]);

  const reset = useCallback(() => setPage(1), []);

  return { page, pageCount, goTo, paginate, reset };
}
