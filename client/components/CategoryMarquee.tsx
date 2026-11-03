const IMG_BASE =
  "https://html.aqlova.com/listbnb-prv/listbnb/assets/img/category";

type Category = { id: number; label: string };

const categories: Category[] = [
  { id: 1, label: "Car & Parts" },
  { id: 2, label: "Fashion" },
  { id: 3, label: "Electronics" },
  { id: 4, label: "Health & Beauty" },
  { id: 5, label: "Mobile Phone" },
  { id: 6, label: "Property & House" },
  { id: 7, label: "Sports Accessories" },
  { id: 8, label: "Kitchen Accessories" },
  { id: 9, label: "Fashion" },
];

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="lb-marquee-group" aria-hidden={hidden || undefined}>
      {categories.map((c) => (
        <a
          key={c.id}
          href="#"
          className="lb-cat-sm"
          tabIndex={hidden ? -1 : undefined}
          aria-hidden={hidden || undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG_BASE}/category-sm-1-${c.id}.png`}
            alt=""
            width={40}
            height={40}
            loading="lazy"
          />
          <span>{c.label}</span>
        </a>
      ))}
    </div>
  );
}

/** Auto-scrolling category pills. The second group is a duplicate for a seamless loop. */
export default function CategoryMarquee() {
  return (
    <div className="lb-cat-strip lb-marquee">
      <div className="lb-marquee-track">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
