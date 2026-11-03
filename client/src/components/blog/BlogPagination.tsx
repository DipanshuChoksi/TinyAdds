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
  const numbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Blog pagination" className="mt-5">
      <ul className="pagination lb-pagination justify-content-center flex-wrap">
        <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
          {page === 1 ? (
            <span className="page-link" aria-label="Previous page"><i className="bi bi-chevron-left"></i></span>
          ) : (
            <Link className="page-link" href={hrefFor(page - 1)} aria-label="Previous page"><i className="bi bi-chevron-left"></i></Link>
          )}
        </li>
        {numbers.map((number) => (
          <li key={number} className={`page-item${number === page ? ' active' : ''}`}>
            <Link className="page-link" href={hrefFor(number)} aria-current={number === page ? 'page' : undefined}>{number}</Link>
          </li>
        ))}
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
