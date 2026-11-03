import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageBanner from '@/components/PageBanner';
import BlogArticle from '@/components/blog/BlogArticle';
import BlogComments from '@/components/blog/BlogComments';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { getBlog, getBlogs } from '@/lib/api';

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);
  return { title: post ? `${post.title} – TinyAdds` : 'Blog – TinyAdds' };
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, blogs] = await Promise.all([getBlog(slug), getBlogs()]);
  if (!post) notFound();

  const index = blogs.findIndex((blog) => blog.slug === post.slug);
  const prev = blogs[(index - 1 + blogs.length) % blogs.length];
  const next = blogs[(index + 1) % blogs.length];

  return (
    <main>
      <PageBanner
        title="News Details"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: 'Blog Details' }]}
      />
      <section className="lb-section">
        <div className="container">
          <div className="row g-lg-5 g-0">
            <div className="col-lg-8">
              <BlogArticle post={post} prev={prev} next={next} />
              <BlogComments initialComments={post.commentList} />
            </div>
            <div className="col-lg-4">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
