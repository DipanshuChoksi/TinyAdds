'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPublicGroups } from '@/lib/api';

const IMG_BASE = 'https://html.aqlova.com/listbnb-prv/listbnb/assets/img/category';

type Category = { id: string; label: string; image?: string };


function Group({ items, hidden = false }: { items: Category[]; hidden?: boolean }) {
  return (
    <div className="lb-marquee-group" aria-hidden={hidden || undefined}>
      {items.map((c) => (
        <Link
          key={c.id}
          href={`/listings?group=${c.id}&page=1`}
          className="lb-cat-sm"
          tabIndex={hidden ? -1 : undefined}
          aria-hidden={hidden || undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.image || `${IMG_BASE}/category-sm-1-${Number(c.id) || 1}.png`}
            alt=""
            width={40}
            height={40}
            loading="lazy"
          />
          <span>{c.label}</span>
        </Link>
      ))}
    </div>
  );
}

/** Auto-scrolling category pills. The second group is a duplicate for a seamless loop. */
export default function CategoryMarquee() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let active = true;

    getPublicGroups(1, 20)
      .then((response) => {
        if (!active) return;

        if (response.success && Array.isArray(response.data)) {
          const mapped = response.data.map((group) => ({
            id: group._id,
            label: group.name,
            image: group.image || undefined,
          }));

          if (mapped.length > 0) {
            setCategories(mapped);
          }
        }
      })
      .catch(() => {
        if (active) {
          setCategories([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="lb-cat-strip lb-marquee">
      <div className="lb-marquee-track">
        <Group items={categories} />
        <Group items={categories} hidden />
      </div>
    </div>
  );
}
