import Link from 'next/link';
import CoverImage from '@/components/ui/CoverImage';

export default function BlogCard({ post }) {
  return (
    <article className="card card-hover h-100 border-0 shadow-sm">
      <CoverImage src={post.image} alt={post.title} ratio="4x3" rounded={false} className="rounded-top-4" />
      <div className="card-body">
        <div className="d-flex justify-content-between small text-body-secondary mb-2">
          <span className="badge text-bg-secondary">{post.tag}</span>
          <time>{post.date}</time>
        </div>
        <h3 className="h6 mb-0">
          <Link href={`/blogs/${post.slug}`} className="text-reset text-decoration-none stretched-link">{post.title}</Link>
        </h3>
      </div>
    </article>
  );
}
