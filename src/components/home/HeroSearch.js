'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { HERO_CITIES } from '@/data/site';

export default function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState(HERO_CITIES[0]);

  const onSubmit = (e) => {
    e.preventDefault();
    router.push('/category/automotive');
  };

  return (
    <form onSubmit={onSubmit} className="d-flex flex-wrap gap-3 align-items-end bg-body rounded-4 shadow-sm p-3">
      <div className="flex-grow-1">
        <label htmlFor="hero-location" className="form-label small text-body-secondary mb-1">Location</label>
        <select id="hero-location" className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
          {HERO_CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <button type="submit" className="btn btn-primary btn-lg rounded-pill px-5">
        <i className="bi bi-search me-2" />Search
      </button>
    </form>
  );
}
