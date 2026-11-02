import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CoverImage from '@/components/ui/CoverImage';
import { BLOG_POST, CATEGORIES, VENDOR } from '@/data/site';
import Image from 'next/image';
import { getListing } from '@/lib/api';

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();
  const category = CATEGORIES.find((c) => c.slug === listing.category);

  return (
    <article className="container py-4">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category?.name ?? 'Automotive', href: `/category/${listing.category}` },
          { label: listing.title },
        ]}
      />
      <div className="row g-5 mt-1">
        <div className="col-lg-8">
          <h1 className="h2">{BLOG_POST.title}</h1>
          <p className="text-body-secondary">by <a href="#!">{BLOG_POST.author}</a> · {BLOG_POST.date}</p>
          <p>{BLOG_POST.intro}</p>
          <CoverImage src={listing.image} alt={listing.title} ratio="16x9" />
          <small className="text-body-secondary d-block mt-2 mb-4">Image source Freepik.com</small>

          {BLOG_POST.sections.map(([title, text], i) => (
            <section key={title} className="mb-4">
              <h2 className="h4">{i + 1}. {title}</h2>
              <p>{text}</p>
            </section>
          ))}

          <CoverImage src={BLOG_POST.images[1]} alt="" ratio="16x9" />
          <small className="text-body-secondary d-block mt-2 mb-4">Image source Freepik.com</small>

          <h2 className="h4">Conclusion</h2>
          <p>{BLOG_POST.conclusion}</p>
        </div>

        <aside className="col-lg-4">
          <div className="card border-0 shadow-sm text-center p-4 sticky-top" style={{ top: 96 }}>
            <Image src={VENDOR.avatar} alt={VENDOR.name} width={96} height={96} className="rounded-circle mx-auto mb-3" />
            <h3 className="h6">{VENDOR.name}</h3>
            <div className="d-flex justify-content-center gap-3 mb-3">
              <a href="#!" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a href="#!" aria-label="Instagram"><i className="bi bi-instagram" /></a>
            </div>
            <Link href={`/vendor/${VENDOR.id}`} className="btn btn-outline-primary rounded-pill">View Profile</Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
