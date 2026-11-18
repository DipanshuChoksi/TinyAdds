import Link from 'next/link';

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
  const getPaginationItems = () => {
    // If 7 or fewer pages, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items: (number | "ellipsis-start" | "ellipsis-end")[] = [1];

    const showStartEllipsis = page > 4;
    const showEndEllipsis = page < totalPages - 3;

    if (showStartEllipsis) {
      items.push("ellipsis-start");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    // Adjust middle window when near boundaries
    const middleStart = !showStartEllipsis ? 2 : start;
    const middleEnd = !showEndEllipsis ? totalPages - 1 : end;

    for (let i = middleStart; i <= middleEnd; i++) {
      items.push(i);
    }

    if (showEndEllipsis) {
      items.push("ellipsis-end");
    }

    items.push(totalPages);
    return items;
  };

  const paginationItems = getPaginationItems();

  return (
    <nav aria-label="Blog pagination" className="mt-5">
      <ul className="pagination lb-pagination justify-content-center flex-wrap align-items-center">
        <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
          {page === 1 ? (
            <span className="page-link" aria-label="Previous page"><i className="bi bi-chevron-left"></i></span>
          ) : (
            <Link className="page-link" href={hrefFor(page - 1)} aria-label="Previous page"><i className="bi bi-chevron-left"></i></Link>
          )}
        </li>
        {paginationItems.map((item, idx) => {
          if (typeof item === "string") {
            return (
              <li key={`${item}-${idx}`} className="page-item disabled">
                <span className="page-link border-0 bg-transparent text-muted px-2">...</span>
              </li>
            );
          }
          return (
            <li key={item} className={`page-item${item === page ? ' active' : ''}`}>
              <Link className="page-link" href={hrefFor(item)} aria-current={item === page ? 'page' : undefined}>{item}</Link>
            </li>
          );
        })}
        <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
          {page === totalPages ? (
            <span className="page-link" aria-label="Next page"><i className="bi bi-chevron-right"></i></span>
          ) : (
            <Link className="page-link" href={hrefFor(page + 1)} aria-label="Next page"><i className="bi bi-chevron-right"></i></Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
