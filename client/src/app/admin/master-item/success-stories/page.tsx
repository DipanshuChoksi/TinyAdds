import MasterItemView from '@/components/admin/MasterItemView';
import { getAdminMasterItems } from '@/lib/api';

export default async function AdminMasterSuccessStoriesPage() {
  const masterItems = await getAdminMasterItems();

  return (
    <MasterItemView
      initialMasterItems={masterItems}
      defaultCategory="success-stories"
    />
  );
}

