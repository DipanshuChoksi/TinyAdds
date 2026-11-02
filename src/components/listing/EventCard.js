import Link from 'next/link';
import CoverImage from '@/components/ui/CoverImage';

export default function EventCard({ item, href = `/listing/${item.id}` }) {
  return (
    <article className="card card-hover h-100 border-0 shadow-sm">
      <Link href={href} className="text-decoration-none">
        <CoverImage src={item.image} alt={item.title} ratio="4x3" rounded={false} className="rounded-top-4" />
      </Link>
      <div className="card-body">
        <ul className="list-inline small text-body-secondary mb-2">
          <li className="list-inline-item"><i className="bi bi-calendar me-1" />{item.date}</li>
          <li className="list-inline-item"><i className="bi bi-clock me-1" />{item.time}</li>
          {item.type && <li className="list-inline-item badge text-bg-secondary">{item.type}</li>}
        </ul>
        <h3 className="h5 mb-1"><Link href={href} className="text-reset text-decoration-none stretched-link">{item.title}</Link></h3>
        <p className="mb-0 text-body-secondary"><i className="bi bi-geo-alt me-1" />{item.city}</p>
      </div>
    </article>
  );
}
