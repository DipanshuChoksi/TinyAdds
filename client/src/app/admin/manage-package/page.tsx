import ManagePackageView from '@/components/admin/ManagePackageView';
import { getAdminPackages } from '@/lib/api';

export default async function AdminManagePackagePage() {
  const packages = await getAdminPackages();

  return <ManagePackageView initialPackages={packages} />;
}
