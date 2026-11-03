'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import Logo from '@/components/ui/Logo';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
  { href: '/admin/inquire', label: 'Inquire', icon: 'bi-envelope-paper-fill', badge: '4' },
  { href: '/admin/post-approval', label: 'Post Approval', icon: 'bi-check2-circle', badge: '2' },
  { href: '/admin/manage-blogs', label: 'Manage Blogs', icon: 'bi-journal-richtext' },
  { href: '/admin/manage-package', label: 'Manage Package', icon: 'bi-box-seam-fill' },
  { href: '/admin/manage-search', label: 'Manage Search', icon: 'bi-search-heart-fill' },
  { href: '/admin/master-item', label: 'Master Item', icon: 'bi-database-fill-gear' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="admin-sidebar d-flex flex-column p-3">
      {/* Brand Logo */}
      <div className="px-2 py-2 mb-3 border-bottom pb-3">
        {/* <Logo width={140} height={38} /> */}
        <span className="badge mt-2 text-uppercase fw-semibold" style={{ backgroundColor: 'var(--ta-primary-light)', color: 'var(--ta-primary)' }}>
          Administration
        </span>
      </div>

      {/* Nav Menu */}
      <div className="flex-grow-1 overflow-auto">
        <div className="text-uppercase text-secondary small fw-semibold px-2 mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          Main Navigation
        </div>
        <nav className="nav flex-column gap-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link d-flex align-items-center justify-content-between text-decoration-none ${
                  active ? 'active' : ''
                }`}
              >
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${item.icon} fs-5`} style={{ color: active ? 'var(--ta-primary)' : 'inherit' }} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`badge rounded-pill ${
                      active ? 'bg-primary text-white' : 'bg-light text-secondary border'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Quick Exit */}
      <div className="border-top pt-3 mt-auto">
        <Link
          href="/"
          className="admin-nav-link d-flex align-items-center gap-2 text-decoration-none text-muted mb-2"
        >
          <i className="bi bi-box-arrow-up-right fs-6" />
          <span>View Public Site</span>
        </Link>
        <div className="d-flex align-items-center gap-2 p-2 rounded-3 bg-light">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: 36, height: 36, backgroundColor: 'var(--ta-primary)' }}
          >
            AD
          </div>
          <div className="overflow-hidden">
            <div className="small fw-semibold text-truncate">Administrator</div>
            <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
              admin@tinyadds.com
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
