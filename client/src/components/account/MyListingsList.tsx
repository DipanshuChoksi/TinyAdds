'use client';
import Link from 'next/link';
import { useState } from 'react';
import CoverImage from '@/components/ui/CoverImage';
import { MY_LISTINGS } from '@/data/site';
import type { MyListing } from '@/types';

export default function MyListingsList() {
  const [items, setItems] = useState<MyListing[]>(MY_LISTINGS);

  const remove = (id: string) => {
    if (window.confirm('Delete this listing?')) setItems((l) => l.filter((x) => x.id !== id));
  };

  if (!items.length) return <p className="text-body-secondary">You have no listings yet. <Link href="/add-listing">Add your first post</Link>.</p>;

  return (
    <div className="d-grid gap-3">
      {items.map((it) => (
        <article key={it.id} className="card border-0 shadow-sm">
          <div className="row g-0 align-items-center">
            <div className="col-4 col-md-3 p-3">
              <CoverImage src={it.image} alt={it.title} ratio="4x3" sizes="200px" />
            </div>
            <div className="col p-3">
              <ul className="list-inline small text-body-secondary mb-1">
                <li className="list-inline-item">{it.date}</li>
                <li className="list-inline-item">{it.time}</li>
                <li className="list-inline-item badge text-bg-secondary">{it.type}</li>
              </ul>
              <h2 className="h5 mb-1">{it.title}</h2>
              <p className="mb-1 text-body-secondary">{it.city}</p>
              <small className="text-body-secondary">Created: {it.created}</small>
            </div>
            <div className="col-auto p-3 d-flex gap-2">
              <Link href="/add-listing" className="btn btn-outline-primary btn-sm rounded-pill">Edit</Link>
              <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => remove(it.id)}>Delete</button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
