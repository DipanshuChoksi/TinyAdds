import Link from 'next/link';
import BlogMeta from '@/components/blog/BlogMeta';
import type { BlogPost, BlogSummary } from '@/src/types';

interface Props {
  post: BlogPost;
  prev: BlogSummary;
  next: BlogSummary;
}

export default function BlogArticle({ post, prev, next }: Props) {
  const [intro, second, third, fourth, last] = post.paragraphs;

  return (
    <article className="lb-article">
      <div className="lb-article-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} />
      </div>

      <BlogMeta post={post} />
      <h2 className="lb-article-title">{post.title}</h2>

      <p>{intro}</p>
      <p>{second}</p>

      <figure className="lb-article-figure">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.inlineImage} alt="" loading="lazy" />
      </figure>

      <p>{third}</p>
      <p>{fourth}</p>

      <blockquote className="lb-quote">
        <i className="bi bi-quote lb-quote-ico" aria-hidden="true"></i>
        <p>“ {post.quote.text} “</p>
        <footer>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.quote.avatar} alt="" loading="lazy" />
          <div>
            <strong>{post.quote.name}</strong>
            <span>{post.quote.role}</span>
          </div>
        </footer>
      </blockquote>

      <p>{last}</p>

      <div className="lb-postnav">
        <Link href={`/blog/${prev.slug}`} className="lb-postnav-item">
          <small><i className="bi bi-arrow-left me-1"></i>Prev Post</small>
          <span>{prev.title}</span>
        </Link>
        <Link href={`/blog/${next.slug}`} className="lb-postnav-item lb-postnav-next">
          <small>Next Post<i className="bi bi-arrow-right ms-1"></i></small>
          <span>{next.title}</span>
        </Link>
      </div>

      <div className="lb-article-foot">
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
      </div>
    </article>
  );
}
