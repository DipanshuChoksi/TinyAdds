import Link from 'next/link';
import { getRecentBlogs } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000';

const getImageUrl = (src?: string) => {
  if (!src) return '/assets/img/blog/v1/01.jpg';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  return `${BASE_URL.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
};

interface Props {
  query?: string;
}

/** Right column (sticky on desktop) shared by the blog list and the blog details page. */
export default async function BlogSidebar({ query = '' }: Props) {
  const recent = await getRecentBlogs(4);

  return (
    <aside className="lb-side">
      <div className="lb-side-box">
        <h4 className="lb-side-title">Recent Post</h4>
        {recent.length === 0 ? (
          <p className="small text-muted mb-0 py-2">No recent posts found.</p>
        ) : (
          <ul className="lb-recent">
            {recent.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="lb-recent-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getImageUrl(post.thumb ?? post.image)} alt="" loading="lazy" />
                </Link>
                <div>
                  <span className="lb-recent-date"><i className="bi bi-calendar3 me-1"></i>{post.date}</span>
                  <h5><Link href={`/blog/${post.slug}`}>{post.title}</Link></h5>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
