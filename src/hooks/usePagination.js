'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

export function usePagination(totalItems, pageSize = 12) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));

  // keep page valid when the list shrinks (e.g. after filtering)
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount));
  }, [pageCount]);

  const goTo = useCallback(
    (n) => setPage(Math.min(Math.max(1, n), pageCount)),
    [pageCount]
  );

  const range = useMemo(() => {
    const start = (page - 1) * pageSize;
    return [start, start + pageSize];
  }, [page, pageSize]);

  const paginate = useCallback((items) => items.slice(range[0], range[1]), [range]);

  return { page, pageCount, goTo, paginate, reset: () => setPage(1) };
}
