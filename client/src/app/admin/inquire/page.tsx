import InquireView from '@/components/admin/InquireView';
import { getAdminInquiries } from '@/lib/api';

export default async function AdminInquirePage() {
  const inquiries = await getAdminInquiries();

  return <InquireView initialInquiries={inquiries} />;
}
