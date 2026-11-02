import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES } from '@/data/site';

export default function CategoryGrid() {
  return (
    <section className="container py-5">
      <h2 className="h3 mb-4">Curated Categories for Every Need</h2>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        {CATEGORIES.map((c) => (
          <div className="col" key={c.slug}>
            <Link href={`/category/${c.slug}`} className="card card-hover h-100 text-decoration-none border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <Image src={c.image} alt="" width={48} height={48} />
                <span className="fw-medium text-body">{c.short}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
