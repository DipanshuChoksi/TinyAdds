import ManageBlogsView from '@/components/admin/ManageBlogsView';
import { getBlogs } from '@/lib/api';

export default async function AdminManageBlogsPage() {
  const blogs = await getBlogs();

  return <ManageBlogsView initialBlogs={blogs} />;
}
