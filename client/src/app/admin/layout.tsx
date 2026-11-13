import AdminSidebar from '@/components/layout/AdminSidebar';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Admin Control Panel',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell d-flex flex-column flex-lg-row min-vh-100">
      {/* Sidebar (Desktop sticky sidebar + Mobile topbar & offcanvas drawer) */}
      <AdminSidebar />

      {/* Main Content Area: compact dashboard padding */}
      <main className="flex-grow-1 overflow-x-hidden p-3 p-md-4" style={{ minWidth: 0 }}>
        <div className="container-fluid px-0" style={{ maxWidth: '1400px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
