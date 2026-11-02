import Image from 'next/image';
import { UPCOMING_EVENTS } from '@/data/site';

export default function UpcomingEvents() {
  return (
    <section className="container py-5">
      <h2 className="h3 mb-4">Upcoming events in Vadodara</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {UPCOMING_EVENTS.map((ev) => (
          <div className="col" key={ev.id}>
            <article className="position-relative rounded-4 overflow-hidden">
              <div className="ratio ratio-4x3">
                <Image src={ev.image} alt={ev.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,.75))' }}>
                <ul className="list-inline small mb-1">
                  <li className="list-inline-item">{ev.date}</li>
                  <li className="list-inline-item">{ev.time}</li>
                </ul>
                <h3 className="h5 mb-0">{ev.title}</h3>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
