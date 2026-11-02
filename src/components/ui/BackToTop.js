'use client';
import { useScrolledPast } from '@/hooks/useScrollPosition';

export default function BackToTop() {
  const visible = useScrolledPast(300);
  return (
    <button
      type="button"
      aria-label="Back to top"
      className={`btn-scroll-top btn btn-primary rounded-circle ${visible ? 'show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <i className="bi bi-arrow-up" />
    </button>
  );
}
