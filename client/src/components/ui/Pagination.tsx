"use client";

import Link from "next/link";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  /** Optional function to generate an href if rendered as <a> links */
  getPageHref?: (page: number) => string;
  ariaLabel?: string;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  getPageHref,
  ariaLabel = "Pagination",
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const result: (number | "ellipsis-start" | "ellipsis-end")[] = [1];
    const showStartEllipsis = page > 4;
    const showEndEllipsis = page < totalPages - 3;

    if (showStartEllipsis) result.push("ellipsis-start");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    const middleStart = !showStartEllipsis ? 2 : (showEndEllipsis ? start : totalPages - 4);
    const middleEnd = !showEndEllipsis ? totalPages - 1 : (!showStartEllipsis ? 5 : end);

    for (let i = middleStart; i <= middleEnd; i++) {
      result.push(i);
    }

    if (showEndEllipsis) result.push("ellipsis-end");
    result.push(totalPages);
    return result;
  })();

  const renderPrev = () => {
    const disabled = page <= 1;
    const content = (
      <>
        <i className="bi bi-chevron-left" aria-hidden="true" />
      </>
    );

    if (disabled) {
      return (
        <li className="page-item disabled">
          <span className="page-link" aria-label="Previous page">
            {content}
          </span>
        </li>
      );
    }

    if (getPageHref) {
      return (
        <li className="page-item">
          <Link
            className="page-link"
            href={getPageHref(page - 1)}
            aria-label="Previous page"
            onClick={() => onPageChange?.(page - 1)}
          >
            {content}
          </Link>
        </li>
      );
    }

    return (
      <li className="page-item">
        <button
          type="button"
          className="page-link"
          onClick={() => onPageChange?.(page - 1)}
          aria-label="Previous page"
        >
          {content}
        </button>
      </li>
    );
  };

  const renderNext = () => {
    const disabled = page >= totalPages;
    const content = (
      <>
        <i className="bi bi-chevron-right" aria-hidden="true" />
      </>
    );

    if (disabled) {
      return (
        <li className="page-item disabled">
          <span className="page-link" aria-label="Next page">
            {content}
          </span>
        </li>
      );
    }

    if (getPageHref) {
      return (
        <li className="page-item">
          <Link
            className="page-link"
            href={getPageHref(page + 1)}
            aria-label="Next page"
            onClick={() => onPageChange?.(page + 1)}
          >
            {content}
          </Link>
        </li>
      );
    }

    return (
      <li className="page-item">
        <button
          type="button"
          className="page-link"
          onClick={() => onPageChange?.(page + 1)}
          aria-label="Next page"
        >
          {content}
        </button>
      </li>
    );
  };

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="pagination lb-pagination justify-content-center align-items-center flex-wrap mb-0">
        {renderPrev()}

        {items.map((item, idx) => {
          if (typeof item === "string") {
            return (
              <li key={`${item}-${idx}`} className="page-item disabled">
                <span className="page-link border-0 bg-transparent text-muted px-2">
                  ...
                </span>
              </li>
            );
          }

          const isActive = item === page;

          if (getPageHref) {
            return (
              <li key={item} className={`page-item ${isActive ? "active" : ""}`}>
                <Link
                  className="page-link"
                  href={getPageHref(item)}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onPageChange?.(item)}
                >
                  {item}
                </Link>
              </li>
            );
          }

          return (
            <li key={item} className={`page-item ${isActive ? "active" : ""}`}>
              <button
                type="button"
                className="page-link"
                onClick={() => onPageChange?.(item)}
                aria-current={isActive ? "page" : undefined}
              >
                {item}
              </button>
            </li>
          );
        })}

        {renderNext()}
      </ul>
    </nav>
  );
}
