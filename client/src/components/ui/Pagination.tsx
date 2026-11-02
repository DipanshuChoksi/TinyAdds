'use client';

function getRange(page: number, count: number): (number | '…')[] {
  if (count <= 6) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = new Set<number>([1, 2, 3, 4, 5, count]);
  if (page > 5) pages.add(page);
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
}

interface PaginationProps { page: number; pageCount: number; onChange: (page: number) => void }

export default function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-5">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page - 1)} aria-label="Previous">
            <i className="bi bi-chevron-left" />
          </button>
        </li>
        {getRange(page, pageCount).map((p, i) =>
          p === '…' ? (
            <li key={`gap-${i}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={p} className={`page-item ${p === page ? 'active' : ''}`} aria-current={p === page ? 'page' : undefined}>
              <button className="page-link" onClick={() => onChange(p)}>{p}</button>
            </li>
          )
        )}
        <li className={`page-item ${page === pageCount ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page + 1)} aria-label="Next">
            <i className="bi bi-chevron-right" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
