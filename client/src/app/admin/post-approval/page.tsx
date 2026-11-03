import PostApprovalView from '@/components/admin/PostApprovalView';
import { getAdminPostApprovals } from '@/lib/api';

export default async function AdminPostApprovalPage() {
  const approvals = await getAdminPostApprovals();

  return <PostApprovalView initialApprovals={approvals} />;
}
