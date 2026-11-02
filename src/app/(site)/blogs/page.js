import BlogCard from '@/components/listing/BlogCard';
import { getBlogs } from '@/lib/api';

export const metadata = { title: 'Blogs' };

export default async function BlogsPage() {
  const blogs = await getBlogs();
  return (
    <div className="container py-5">
      <h1 className="mb-4">Blogs</h1>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
        {blogs.map((post) => (
          <div className="col" key={post.slug}><BlogCard post={post} /></div>
        ))}
      </div>
    </div>
  );
}
