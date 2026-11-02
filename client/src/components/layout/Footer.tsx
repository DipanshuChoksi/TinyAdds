import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { CATEGORIES, SITE } from '@/data/site';

const COMPANY = [
  { label: 'Home', href: '/' },
  { label: 'Ads Category', href: '/category/automotive' },
  { label: 'Our Blog', href: '/blogs' },
  { label: 'Advertise With Us', href: '/advertise-with-us' },
];

export default function Footer() {
  const half = Math.ceil(CATEGORIES.length / 2);
  const cols = [CATEGORIES.slice(0, half), CATEGORIES.slice(half)];
  return (
    <footer className="footer bg-dark text-light pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4 pb-4">
          <div className="col-lg-4">
            <Logo variant="footer" />
            <p className="mt-3 text-light opacity-75">{SITE.tagline}</p>
            <div className="d-flex gap-3 fs-5">
              <a href="#!" aria-label="Facebook" className="text-light"><i className="bi bi-facebook" /></a>
              <a href="#!" aria-label="Instagram" className="text-light"><i className="bi bi-instagram" /></a>
              <a href="#!" aria-label="Twitter" className="text-light"><i className="bi bi-twitter-x" /></a>
            </div>
          </div>
          <div className="col-lg-5">
            <h6 className="mb-3">Popular categories</h6>
            <div className="row">
              {cols.map((col, i) => (
                <ul key={i} className="col-6 list-unstyled mb-0">
                  {col.map((c) => (
                    <li key={c.slug} className="mb-2">
                      <Link href={`/category/${c.slug}`} className="text-light opacity-75 text-decoration-none">{c.name}</Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div className="col-lg-3">
            <h6 className="mb-3">Company</h6>
            <ul className="list-unstyled mb-0">
              {COMPANY.map((l) => (
                <li key={l.label} className="mb-2">
                  <Link href={l.href} className="text-light opacity-75 text-decoration-none">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr className="opacity-25" />
        <p className="mb-0 small opacity-75">
          © All rights reserved. Made by <a href={SITE.copyrightUrl} className="text-light">{SITE.copyright}</a>
        </p>
      </div>
    </footer>
  );
}
