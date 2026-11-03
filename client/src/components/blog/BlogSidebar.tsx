import Link from 'next/link';
import { getRecentBlogs } from '@/lib/api';

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
        <ul className="lb-recent">
          {recent.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="lb-recent-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.thumb ?? post.image} alt="" loading="lazy" />
              </Link>
              <div>
                <span className="lb-recent-date"><i className="bi bi-calendar3 me-1"></i>{post.date}</span>
                <h5><Link href={`/blog/${post.slug}`}>{post.title}</Link></h5>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
