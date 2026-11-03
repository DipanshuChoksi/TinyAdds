import AdminSidebar from '@/components/layout/AdminSidebar';
import type { ReactNode } from 'react';
// import AdminSidebar from '@/components/layout/AdminSidebar';

export const metadata = {
  title: 'Admin Control Panel',
  description: 'TinyAdds administrative portal and management dashboard',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell d-flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        {/* Top Header */}
        {/* <header className="admin-header px-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <span className="badge rounded-pill bg-light text-secondary border px-3 py-2">
              <i className="bi bi-shield-check text-success me-1" />
              Secure Admin Session
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="small text-muted d-none d-md-inline">
              <i className="bi bi-clock me-1" />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>

          </div>
        </header> */}

        {/* Dynamic page container */}
        <main className="p-4 p-lg-5 flex-grow-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
