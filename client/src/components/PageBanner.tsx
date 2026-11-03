import Link from "next/link";

type Crumb = { label: string; href?: string };

/** Peach page header with title + breadcrumb (Home › Pages › Current). */
export default function PageBanner({ title, crumbs }: { title: string; crumbs: Crumb[] }) {
  return (
    <section className="lb-banner">
      <div className="container text-center">
        <h1 className="lb-banner-title">{title}</h1>
        <nav aria-label="breadcrumb">
          <ol className="lb-crumbs">
            {crumbs.map((c, i) => (
              <li key={c.label} aria-current={i === crumbs.length - 1 ? "page" : undefined}>
                {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
