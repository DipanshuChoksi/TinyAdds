import Image from 'next/image';
import EventCard from '@/components/listing/EventCard';
import { VENDOR, VENDOR_POSTS } from '@/data/site';
import { getVendor } from '@/lib/api';

export const metadata = { title: 'Vendor profile' };

export default async function VendorPage() {
  const vendor = await getVendor();
  return (
    <>
      <div className="position-relative" style={{ height: 260 }}>
        <Image src={vendor.cover} alt="Cover image" fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
      </div>

      <div className="container">
        <div className="row g-4" style={{ marginTop: -60 }}>
          <div className="col-lg-8">
            <div className="d-flex align-items-end gap-3 mb-3">
              <Image src={vendor.avatar} alt={vendor.name} width={120} height={120} className="rounded-circle border border-4 border-white" />
              <div>
                <span className="badge text-bg-success mb-1"><i className="bi bi-patch-check me-1" />Verified</span>
                <h1 className="h2 mb-0">{vendor.name}</h1>
              </div>
            </div>
            <ul className="list-inline text-body-secondary">
              <li className="list-inline-item"><i className="bi bi-geo-alt me-1" />{vendor.location}</li>
              <li className="list-inline-item"><i className="bi bi-telephone me-1" />{vendor.phone}</li>
              <li className="list-inline-item"><a href={`mailto:${vendor.email}`}>Send email</a></li>
            </ul>
            <p className="small text-body-secondary">Last visited {vendor.lastVisited}</p>
            <p>{vendor.bio}</p>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mt-lg-5">
              <div className="card-body d-flex justify-content-between text-center">
                {VENDOR.stats.map(([value, label]) => (
                  <div key={label}>
                    <h4 className="h5 mb-0">{value}</h4>
                    <small className="text-body-secondary">{label}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h2 className="h3 mt-5 mb-4">All Advertise Post</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {VENDOR_POSTS.map((p) => (
            <div className="col" key={p.id}><EventCard item={p} href="#!" /></div>
          ))}
        </div>
      </div>
    </>
  );
}
