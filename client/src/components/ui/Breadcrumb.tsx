import Link from 'next/link';

export interface Crumb { label: string; href?: string }

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-0">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className={`breadcrumb-item ${last ? 'active' : ''}`} aria-current={last ? 'page' : undefined}>
              {last || !item.href ? item.label : <Link href={item.href}>{item.label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
