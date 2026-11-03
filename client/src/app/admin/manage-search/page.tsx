import ManageSearchView from '@/components/admin/ManageSearchView';
import { getAdminSearchTerms } from '@/lib/api';

export default async function AdminManageSearchPage() {
  const searchTerms = await getAdminSearchTerms();

  return <ManageSearchView initialSearchTerms={searchTerms} />;
}
