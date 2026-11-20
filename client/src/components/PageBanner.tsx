import Link from "next/link";

type Crumb = { label: string; href?: string };

const truncate = (text: string) =>
  text.length > 10 ? `${text.slice(0, 10)}...` : text;

/** Peach page header with title + breadcrumb (Home › Pages › Current). */
export default function PageBanner({ title, crumbs }: { title: string; crumbs: Crumb[] }) {
  return (
    <section className="lb-banner">
      <div className="container">
        <div className="lb-banner-content">
          <h1 className="lb-banner-title">{title}</h1>
          <nav aria-label="breadcrumb">
            <ol className="lb-crumbs">
              {crumbs.map((c, i) => (
                <li key={c.label} aria-current={i === crumbs.length - 1 ? "page" : undefined}>
                  {c.href ? <Link href={c.href}>{truncate(c.label)}</Link> : c.label}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );  
}
