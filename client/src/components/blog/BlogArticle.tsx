import Link from 'next/link';
import BlogMeta from '@/components/blog/BlogMeta';
import type { BlogPost, BlogSummary } from '@/src/types';

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000';

const getImageUrl = (src?: string) => {
  if (!src) return '/assets/img/blog/v1/01.jpg';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  return `${BASE_URL.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
};

interface Props {
  post: BlogPost;
  prev: BlogSummary;
  next: BlogSummary;
}

export default function BlogArticle({ post, prev, next }: Props) {
  const paragraphs = post.paragraphs && post.paragraphs.length > 0 ? post.paragraphs : [];

  return (
    <article className="lb-article">
      {post.image && (
        <div className="lb-article-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getImageUrl(post.image)} alt={post.title} />
        </div>
      )}

      <BlogMeta post={post} />
      <h2 className="lb-article-title">{post.title}</h2>

      {post.content ? (
        <div
          className="lb-article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : (
        paragraphs.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))
      )}

      {post.quote?.text && (
        <blockquote className="lb-quote">
          <i className="bi bi-quote lb-quote-ico" aria-hidden="true"></i>
          <p>“ {post.quote.text} “</p>
          {(post.quote.name || post.quote.avatar) && (
            <footer>
              {post.quote.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.quote.avatar} alt="" loading="lazy" />
              )}
              <div>
                {post.quote.name && <strong>{post.quote.name}</strong>}
                {post.quote.role && <span>{post.quote.role}</span>}
              </div>
            </footer>
          )}
        </blockquote>
      )}

      {/* <div className="lb-postnav">
        <Link href={`/blog/${prev.slug}`} className="lb-postnav-item">
          <small><i className="bi bi-arrow-left me-1"></i>Prev Post</small>
          <span>{prev.title}</span>
        </Link>
        <Link href={`/blog/${next.slug}`} className="lb-postnav-item lb-postnav-next">
          <small>Next Post<i className="bi bi-arrow-right ms-1"></i></small>
          <span>{next.title}</span>
        </Link>
      </div> */}

      {/* <div className="lb-article-foot">
        <div className="lb-share">
          <strong>Share:</strong>
          <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
          <a href="#" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
          <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
          <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
        </div>
        <div className="lb-tagline">
          <strong>Tag:</strong>
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog?q=${encodeURIComponent(tag)}`}>{tag}</Link>
          ))}
        </div>
      </div> */}
    </article>
  );
}
