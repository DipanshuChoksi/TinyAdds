import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CoverImage from '@/components/ui/CoverImage';
import { BLOGS } from '@/data/site';
import { getBlog } from '@/lib/api';

export const generateStaticParams = () => BLOGS.map((b) => ({ slug: b.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);
  return { title: post?.title ?? 'Blog' };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) notFound();

  return (
    <article className="container py-4" style={{ maxWidth: 860 }}>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blogs' }, { label: 'Blog Detail-1' }]} />
      <h1 className="h2 mt-4">{post.title}</h1>
      <p className="text-body-secondary">by <a href="#!">{post.author}</a> · {post.date}</p>
      <p>{post.intro}</p>
      <CoverImage src={post.images[0]} alt="" ratio="16x9" />
      <small className="text-body-secondary d-block mt-2 mb-4">Image source Freepik.com</small>
      {post.sections.map(([title, text], i) => (
        <section key={title} className="mb-4">
          <h2 className="h4">{i + 1}. {title}</h2>
          <p>{text}</p>
        </section>
      ))}
      <CoverImage src={post.images[1]} alt="" ratio="16x9" />
      <small className="text-body-secondary d-block mt-2 mb-4">Image source Freepik.com</small>
      <h2 className="h4">Conclusion</h2>
      <p>{post.conclusion}</p>
    </article>
  );
}
