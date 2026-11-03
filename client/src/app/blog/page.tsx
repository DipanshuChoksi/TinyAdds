import type { Metadata } from 'next';
import Link from 'next/link';
import PageBanner from '@/components/PageBanner';
import BlogCard from '@/components/blog/BlogCard';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { BLOG_PAGE_SIZE } from '@/data/site';
import { searchBlogs } from '@/lib/api';

export const metadata: Metadata = { title: 'Blog – TinyAdds' };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = '', page: pageParam } = await searchParams;
  const found = await searchBlogs(q);
  const totalPages = Math.max(1, Math.ceil(found.length / BLOG_PAGE_SIZE));
  const page = Math.min(Math.max(parseInt(pageParam ?? '1', 10) || 1, 1), totalPages);
  const items = found.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);

  return (
    <main>
      <PageBanner title="News Feeds" crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
      <section className="lb-section">
        <div className="container">
          <div className="row g-lg-5 g-0">
            <div className="col-lg-8">
              {q && (
                <p className="lb-search-note">
                  {found.length} result{found.length === 1 ? '' : 's'} for “{q}” · <Link href="/blog">clear</Link>
                </p>
              )}
              {items.length ? (
                <div className="row row-cols-1 row-cols-md-2 g-4">
                  {items.map((post) => (
                    <div key={post.slug} className="col">
                      <BlogCard post={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="lb-empty">No posts found. Try another keyword.</div>
              )}
              <BlogPagination page={page} totalPages={totalPages} query={q || undefined} />
            </div>
            <div className="col-lg-4">
              <BlogSidebar query={q} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
