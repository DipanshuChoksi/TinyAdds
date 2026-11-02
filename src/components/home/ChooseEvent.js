'use client';
import Link from 'next/link';
import EventCard from '@/components/listing/EventCard';
import SelectField from '@/components/ui/SelectField';
import { useListingFilters } from '@/hooks/useListingFilters';
import { CATEGORIES, FILTER_CITIES, HOME_EVENTS, SORT_OPTIONS } from '@/data/site';

export default function ChooseEvent() {
  const { filters, setFilter, result } = useListingFilters(HOME_EVENTS);

  return (
    <section className="container py-5">
      <h2 className="h3 mb-4">Choose Your Event</h2>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <SelectField id="ev-cat" label="Category" value={filters.category} onChange={(v) => setFilter('category', v)}
            options={CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))} placeholder="All categories" />
        </div>
        <div className="col-md-4">
          <SelectField id="ev-loc" label="Location" value={filters.city} onChange={(v) => setFilter('city', v)}
            options={FILTER_CITIES} placeholder="All locations" />
        </div>
        <div className="col-md-4">
          <SelectField id="ev-sort" label="Sort by:" value={filters.sort} onChange={(v) => setFilter('sort', v)} options={SORT_OPTIONS} />
        </div>
      </div>

      {result.length ? (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {result.map((ev) => (
            <div className="col" key={ev.id}><EventCard item={ev} /></div>
          ))}
        </div>
      ) : (
        <p className="text-body-secondary">No events match these filters.</p>
      )}

      <div className="text-center mt-4">
        <Link href="/category/automotive" className="btn btn-outline-primary rounded-pill">View all 32 events</Link>
      </div>
    </section>
  );
}
