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

  const closeOffcanvas = () => {
    const el = document.getElementById('adminSidebarNav');
    if (el?.classList.contains('show')) {
      el.querySelector<HTMLElement>('.btn-close')?.click();
    }
  };

  const navContent = (
    <>
      {/* Brand Wordmark & Label */}
      <div className="px-2 py-2 mb-3 border-bottom pb-3 d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--lb-line)' }}>
        <Link href="/" className="lb-wordmark text-decoration-none d-block m-0" onClick={closeOffcanvas}>
          Tiny<span>Adds</span>
        </Link>
        <button
          type="button"
          className="btn-close d-lg-none"
          data-bs-dismiss="offcanvas"
          data-bs-target="#adminSidebarNav"
          aria-label="Close menu"
        />
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
                onClick={closeOffcanvas}
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
          onClick={closeOffcanvas}
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
    </>
  );

  return (
    <>
      {/* Mobile Topbar with Hamburger Toggle */}
      <header
        className="d-lg-none bg-white px-3 py-2 border-bottom d-flex align-items-center justify-content-between sticky-top"
        style={{ borderColor: 'var(--lb-line)', zIndex: 1010 }}
      >
        <Link href="/" className="lb-wordmark text-decoration-none m-0">
          Tiny<span>Adds</span>
        </Link>
        <button
          className="btn btn-light rounded-pill border-0 p-2 d-flex align-items-center justify-content-center"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#adminSidebarNav"
          aria-controls="adminSidebarNav"
          aria-label="Open navigation menu"
          style={{ width: 42, height: 42, backgroundColor: 'var(--lb-soft)', color: 'var(--lb-primary)' }}
        >
          <i className="bi bi-list fs-3" />
        </button>
      </header>

      {/* Desktop Sticky Sidebar (visible on lg and up) */}
      <aside className="admin-sidebar d-none d-lg-flex flex-column p-3">
        {navContent}
      </aside>

      {/* Mobile Offcanvas Drawer (hidden on lg and up) */}
      <div
        className="offcanvas offcanvas-start d-lg-none"
        tabIndex={-1}
        id="adminSidebarNav"
        aria-labelledby="adminSidebarNavLabel"
        style={{ width: '290px', backgroundColor: '#ffffff' }}
      >
        <div className="offcanvas-body d-flex flex-column p-3 h-100">
          {navContent}
        </div>
      </div>
    </>
  );
}
