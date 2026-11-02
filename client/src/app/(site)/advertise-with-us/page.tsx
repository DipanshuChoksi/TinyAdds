import type { Metadata } from 'next';
import Image from 'next/image';
import CoverImage from '@/components/ui/CoverImage';
import { BENEFITS, PARTNERS, PRINCIPLES, SERVICES, STORY, TEAM, TESTIMONIALS } from '@/data/site';

export const metadata: Metadata = { title: 'Advertise With Us' };

export default function AdvertisePage() {
  return (
    <>
      <section className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h1 className="mb-4">Benefits of Tinyadds</h1>
            {BENEFITS.map((p) => <p key={p}>{p}</p>)}
          </div>
          <div className="col-lg-6">
            <CoverImage src="/assets/img/about/v2/hero.png" alt="" ratio="4x3" priority />
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="mb-4">Our Services</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {SERVICES.map((s) => (
            <div className="col" key={s.title}>
              <div className="card h-100 border-0 shadow-sm card-hover">
                <div className="card-body">
                  <h3 className="h5">{s.title}</h3>
                  <p className="mb-0 text-body-secondary">{s.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <h2 className="mb-4">Our principles</h2>
        {PRINCIPLES.map((p, i) => (
          <div key={p.title} className={`row align-items-center g-4 mb-5 ${i % 2 ? 'flex-lg-row-reverse' : ''}`}>
            <div className="col-lg-6">
              <h3 className="h4">{p.title}</h3>
              <p className="text-body-secondary">{p.text}</p>
            </div>
            <div className="col-lg-6"><CoverImage src={p.image} alt={p.title} ratio="16x9" /></div>
          </div>
        ))}
      </section>

      <section className="container py-5">
        <h2 className="mb-4">Finder story</h2>
        <ol className="list-unstyled row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {STORY.map((s) => (
            <li className="col" key={s.year}>
              <span className="badge text-bg-primary mb-2">{s.year}</span>
              <h3 className="h5">{s.title}</h3>
              <p className="text-body-secondary mb-0">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container py-5">
        <h2 className="mb-4">Users about Finder</h2>
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {TESTIMONIALS.map((t) => (
            <div className="col" key={t.text.slice(0, 24)}>
              <figure className="card h-100 border-0 shadow-sm p-4 mb-0">
                <blockquote className="mb-3">{t.text}</blockquote>
                <figcaption className="d-flex align-items-center gap-3">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-circle" />
                  <div>
                    <strong className="d-block">{t.name}</strong>
                    <small className="text-body-secondary">{t.role}</small>
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-5">
          <div className="col-md-4">
            <h3 className="h5 mb-3">Finder core team</h3>
            <div className="d-flex flex-wrap gap-2">
              {TEAM.map((n, i) => (
                <Image key={n} src={`/assets/img/about/v2/avatars/0${(i % 4) + 1}.jpg`} alt={n} title={n} width={48} height={48} className="rounded-circle" />
              ))}
            </div>
          </div>
          <div className="col-md-4">
            <h3 className="h5 mb-3">Best in the market</h3>
            <ul className="list-unstyled">
              <li><a href="#!">5/5 rating on the App Store</a></li>
              <li><a href="#!">4.9/5 rating on the Google Play</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h3 className="h5 mb-3">Useful links</h3>
            <ul className="list-unstyled">
              {['How can I leave a review for a contractor?', 'What support does Finder Contractor offer?', 'Community: Connect with other contractors', 'Press and announcements about Finder'].map((l) => (
                <li key={l}><a href="#!">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row align-items-center g-4 bg-primary-subtle rounded-5 p-5">
          <div className="col-lg-6">
            <h2>Get Finder App</h2>
            <p>Explore top-rated certified pros</p>
            <div className="d-flex gap-3">
              <a href="#!" className="btn btn-dark rounded-pill"><i className="bi bi-apple me-2" />App Store</a>
              <a href="#!" className="btn btn-dark rounded-pill"><i className="bi bi-google-play me-2" />Google Play</a>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <Image src="/assets/img/home/contractors/app-cta.png" alt="App screens" width={420} height={360} style={{ height: 'auto', maxWidth: '100%' }} />
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="mb-4">Top partners</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {PARTNERS.map((p) => (
            <div className="col" key={p}><a href="#!" className="card h-100 p-3 text-decoration-none text-body border-0 shadow-sm card-hover">{p}</a></div>
          ))}
        </div>
      </section>
    </>
  );
}
