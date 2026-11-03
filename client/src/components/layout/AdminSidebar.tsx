'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
      {/* Brand Wordmark & Label */}
      <div className="px-2 py-2 mb-3 border-bottom pb-3" style={{ borderColor: 'var(--lb-line)' }}>
        <Link href="/" className="lb-wordmark text-decoration-none d-block mb-1">
          Tiny<span>Adds</span>
        </Link>
        <div className="d-flex align-items-center gap-2 mt-2">
          <span className="lb-badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.65rem' }}>
            {/* <i className="bi bi-shield-lock-fill me-1" /> Control Center */}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-grow-1 overflow-auto py-1">
        <div
          className="text-uppercase small fw-bold px-2 mb-2"
          style={{ fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--lb-text)', opacity: 0.85 }}
        >
          Administration Menu
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
                  <i
                    className={`bi ${item.icon} fs-5`}
                    style={{ color: active ? '#ffffff' : 'var(--lb-primary)' }}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className="badge rounded-pill"
                    style={{
                      backgroundColor: active ? '#ffffff' : 'var(--lb-soft)',
                      color: active ? 'var(--lb-primary)' : 'var(--lb-ink)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.55rem',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile / Public Site Link */}
      <div className="border-top pt-3 mt-auto" style={{ borderColor: 'var(--lb-line)' }}>
        <Link
          href="/"
          className="admin-nav-link d-flex align-items-center gap-2 text-decoration-none mb-2"
          style={{ color: 'var(--lb-text)' }}
        >
          <i className="bi bi-arrow-up-right-circle fs-5" style={{ color: 'var(--lb-primary)' }} />
          <span>View Public Site</span>
        </Link>
        <div
          className="d-flex align-items-center gap-2 p-2 rounded-4"
          style={{ backgroundColor: 'var(--lb-soft)', border: '1px solid var(--lb-line)' }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
            style={{ width: 38, height: 38, backgroundColor: 'var(--lb-primary)', flexShrink: 0 }}
          >
            AD
          </div>
          <div className="overflow-hidden">
            <div className="small fw-bold text-truncate" style={{ color: 'var(--lb-ink)' }}>
              Super Admin
            </div>
            <div className="text-truncate" style={{ fontSize: '0.75rem', color: 'var(--lb-text)' }}>
              admin@tinyadds.com
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
