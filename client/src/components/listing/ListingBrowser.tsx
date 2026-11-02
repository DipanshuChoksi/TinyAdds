'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import EventCard from '@/components/listing/EventCard';
import Pagination from '@/components/ui/Pagination';
import SelectField from '@/components/ui/SelectField';
import { useListingFilters } from '@/hooks/useListingFilters';
import { usePagination } from '@/hooks/usePagination';
import { EMOTIONS, SORT_OPTIONS } from '@/data/site';
import type { Listing, SortKey } from '@/types';

const PAGE_SIZE = 12;

/** Used by both the category page and the emotion page. */
interface ListingBrowserProps { items: Listing[]; activeEmotion?: string; allHref: string }

export default function ListingBrowser({ items, activeEmotion = '', allHref }: ListingBrowserProps) {
  const { filters, setFilter, result } = useListingFilters(items, { emotion: activeEmotion });
  const cities = useMemo(() => [...new Set(items.map((i) => i.city))], [items]);
  const { page, pageCount, goTo, paginate } = usePagination(result.length, PAGE_SIZE);
  const visible = paginate(result);

  const tabs = [{ slug: '', name: 'All', href: allHref }, ...EMOTIONS.map((e) => ({ ...e, href: `/emotion/${e.slug}` }))];

  const scrollTopOnPage = (n: number) => {
    goTo(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <ul className="nav nav-pills gap-2">
          {tabs.map((t) => (
            <li key={t.slug || 'all'} className="nav-item">
              <Link href={t.href} className={`nav-link rounded-pill ${t.slug === activeEmotion ? 'active' : ''}`}>{t.name}</Link>
            </li>
          ))}
        </ul>
        <SelectField
          id="city"
          inline
          label="Location"
          value={filters.city}
          onChange={(v) => setFilter('city', v)}
          options={cities}
          placeholder="All"
        />
      </div>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <p className="mb-0 text-body-secondary">Showing {result.length} results</p>
        <SelectField id="sort" inline label="Sort by:" value={filters.sort} onChange={(v) => setFilter('sort', v as SortKey)} options={SORT_OPTIONS} />
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        {visible.map((item) => (
          <div key={item.id} className="col">
            <EventCard item={item} href={`/listing/${item.id}`} />
          </div>
        ))}
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={scrollTopOnPage} />
    </>
  );
}
