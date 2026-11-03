import MasterItemView from '@/components/admin/MasterItemView';
import { getAdminMasterItems } from '@/lib/api';

export default async function AdminMasterItemPage() {
  const masterItems = await getAdminMasterItems();

  return <MasterItemView initialMasterItems={masterItems} />;
}
