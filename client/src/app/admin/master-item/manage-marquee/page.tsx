import MasterItemView from '@/components/admin/MasterItemView';
import { getAdminMasterItems } from '@/lib/api';

export default async function AdminMasterManageMarqueePage() {
  const masterItems = await getAdminMasterItems();

  return (
    <MasterItemView
      initialMasterItems={masterItems}
      defaultCategory="manage-marquee"
    />
  );
}

