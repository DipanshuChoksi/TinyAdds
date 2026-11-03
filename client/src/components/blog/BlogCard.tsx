import Link from 'next/link';
import BlogMeta from '@/components/blog/BlogMeta';
import type { BlogSummary } from '@/src/types';

interface Props {
  post: BlogSummary;
}

/** One big row on the blog list page (image or slider, meta, title, excerpt, Read More). */
export default function BlogCard({ post }: Props) {
  const href = `/blog/${post.slug}`;
  const slides = post.gallery;
  const carouselId = `gallery-${post.slug}`;

  return (
    <article className="lb-post">
      {slides ? (
        <div id={carouselId} className="carousel slide lb-post-media" data-bs-ride="false">
          <div className="carousel-indicators">
            {slides.map((src, index) => (
              <button
                key={src}
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : undefined}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {slides.map((src, index) => (
              <div key={src} className={`carousel-item${index === 0 ? ' active' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      ) : (
        <Link href={href} className="lb-post-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.title} loading="lazy" />
        </Link>
      )}

      <div className="lb-post-body">
        <BlogMeta post={post} />
        <h2 className="lb-post-title"><Link href={href}>{post.title}</Link></h2>
        {post.excerpt && <p>{post.excerpt}</p>}
        <Link href={href} className="btn lb-btn-primary">
          Read More <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
    </article>
  );
}
