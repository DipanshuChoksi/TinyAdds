import type { BlogSummary } from '@/src/types';

interface Props {
  post: BlogSummary;
}

export default function BlogMeta({ post }: Props) {
  return (
    <ul className="lb-post-meta">
      <li><span className="lb-post-tag">{post.tag}</span></li>
      <li><i className="bi bi-calendar3"></i>{post.date}</li>
      <li><i className="bi bi-chat-dots"></i>{post.comments ?? 0} Comments</li>
      <li><i className="bi bi-eye"></i>{post.views ?? '0'} View</li>
    </ul>
  );
}
