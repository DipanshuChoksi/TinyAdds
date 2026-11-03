import AdminSidebar from '@/components/layout/AdminSidebar';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Admin Control Panel | TinyAdds',
  description: 'TinyAdds administrative portal and moderation dashboard',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell d-flex min-vh-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area with proper breathing room and padding */}
      <main className="flex-grow-1 overflow-x-hidden p-4 p-md-5" style={{ minWidth: 0 }}>
        <div className="container-fluid px-0 px-xl-2" style={{ maxWidth: '1440px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
