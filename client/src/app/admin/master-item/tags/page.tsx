import MasterItemView from '@/components/admin/MasterItemView';
import { getAdminMasterItems } from '@/lib/api';

export default async function AdminMasterTagsPage() {
  const masterItems = await getAdminMasterItems();

  return (
    <MasterItemView
      initialMasterItems={masterItems}
      defaultCategory="tag"
      pageTitle="Tags"
      pageDescription="Manage special badges, highlight tags, and vendor certifications."
    />
  );
}

