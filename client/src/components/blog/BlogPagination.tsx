"use client";

import Pagination from '@/components/ui/Pagination';

interface Props {
  page: number;
  totalPages: number;
  query?: string;
}

export default function BlogPagination({ page, totalPages, query }: Props) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (target > 1) params.set('page', String(target));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : '/blog';
  };

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      getPageHref={hrefFor}
      ariaLabel="Blog pagination"
      className="mt-5"
    />
  );
}
