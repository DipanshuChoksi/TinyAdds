'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface AdminNavSubItem {
  href: string;
  label: string;
}

export interface AdminNavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
  children?: AdminNavSubItem[];
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: 'bi-grid-1x2' },
  { href: '/admin/inquire', label: 'Inquire', icon: 'bi-envelope-paper' },
  { href: '/admin/post-approval', label: 'Post Approval', icon: 'bi-check2-circle' },
  { href: '/admin/manage-blogs', label: 'Manage Blogs', icon: 'bi-journal-richtext' },
  { href: '/admin/manage-package', label: 'Manage Package', icon: 'bi-box-seam' },
  {
    href: '/admin/master-item',
    label: 'Master',
    icon: 'bi-database-gear',
    children: [
      { href: '/admin/master-item/emotions', label: 'Emotions' },
      { href: '/admin/master-item/manage-cms', label: 'Manage CMS' },
      { href: '/admin/master-item/manage-marquee', label: 'Manage Marquee' },
      { href: '/admin/master-item/tax-master', label: 'TaxMaster' },
      { href: '/admin/master-item/success-stories', label: 'Success Stories' },
      { href: '/admin/master-item/user', label: 'User' },
      { href: '/admin/master-item/country', label: 'Country' },
      { href: '/admin/master-item/state', label: 'State' },
      { href: '/admin/master-item/cities', label: 'City' },
      { href: '/admin/master-item/inquire-contact-us', label: 'Inquire Contact Us' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    '/admin/master-item': true, // Keep open by default
  });

  const isExactActive = (href: string) => pathname === href;

  const isParentActive = (item: AdminNavItem) => {
    if (item.href === '/admin') {
      return pathname === '/admin';
    }
    if (item.children) {
      return item.children.some((child) => pathname === child.href);
    }
    return pathname.startsWith(item.href);
  };

  const toggleSubmenu = (href: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
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
      <div className="px-2 py-1 mb-3 border-bottom pb-3 d-flex align-items-center justify-content-between" style={{ borderColor: '#edf0f2' }}>
        <Link href="/" className="lb-wordmark text-decoration-none d-block m-0" onClick={closeOffcanvas}>
          Tiny<span style={{ color: 'var(--lb-primary)' }}>Adds</span>
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
      <div className="flex-grow-1 overflow-y-auto overflow-x-hidden pe-1">
        <div
          className="text-uppercase small fw-bold px-2 mb-2"
          style={{ fontSize: '0.68rem', letterSpacing: '0.08em', color: '#94a3b8' }}
        >
          Overview
        </div>
        <nav className="nav flex-column gap-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const activeParent = isParentActive(item);
            const isOpen = openMenus[item.href] ?? activeParent;

            if (hasChildren) {
              return (
                <div key={item.href} className="w-100">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSubmenu(item.href)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSubmenu(item.href);
                      }
                    }}
                    className={`admin-nav-link d-flex align-items-center justify-content-between text-decoration-none w-100 ${
                      activeParent ? 'active' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <i
                        className={`bi ${item.icon} fs-5`}
                        style={{ color: activeParent ? 'var(--lb-primary)' : '#64748b' }}
                      />
                      <span>{item.label}</span>
                    </div>
                    <i
                      className={`bi bi-chevron-down fs-7 transition-all ${isOpen ? 'rotate-180' : ''}`}
                      style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </div>

                  {/* Submenu links */}
                  {isOpen && (
                    <div className="d-flex flex-column gap-1 ps-2 pt-1 border-start ms-3 my-1" style={{ borderColor: '#e2e8f0' }}>
                      {item.children?.map((sub) => {
                        const subActive = isExactActive(sub.href);
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={closeOffcanvas}
                            className={`admin-nav-link py-1 px-2 d-flex align-items-center gap-2 text-decoration-none rounded-2 ${
                              subActive ? 'active' : ''
                            }`}
                            style={{
                              fontSize: '0.81rem',
                              backgroundColor: subActive ? 'rgba(212, 87, 43, 0.08)' : 'transparent',
                              color: subActive ? 'var(--lb-primary)' : '#64748b',
                              fontWeight: subActive ? 600 : 400,
                            }}
                          >
                            <i
                              className="bi bi-circle-fill"
                              style={{
                                fontSize: '0.35rem',
                                color: subActive ? 'var(--lb-primary)' : '#94a3b8',
                              }}
                            />
                            <span>{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const active = isExactActive(item.href);
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
                    style={{ color: active ? 'var(--lb-primary)' : '#64748b' }}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className="badge rounded-pill"
                    style={{
                      backgroundColor: active ? 'rgba(212, 87, 43, 0.12)' : '#f1f5f9',
                      color: active ? 'var(--lb-primary)' : '#64748b',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.5rem',
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
      <div className="border-top pt-3 mt-auto" style={{ borderColor: '#edf0f2' }}>
        <Link
          href="/"
          onClick={closeOffcanvas}
          className="admin-nav-link d-flex align-items-center gap-2 text-decoration-none mb-2"
          style={{ color: '#64748b' }}
        >
          <i className="bi bi-box-arrow-up-right fs-6" />
          <span style={{ fontSize: '0.82rem' }}>Public Site</span>
        </Link>
        <div
          className="d-flex align-items-center gap-2 p-2 rounded-3"
          style={{ backgroundColor: '#f8fafc', border: '1px solid #edf0f2' }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
            style={{ width: 32, height: 32, backgroundColor: 'var(--lb-ink)', flexShrink: 0, fontSize: '0.78rem' }}
          >
            AD
          </div>
          <div className="overflow-hidden">
            <div className="small fw-semibold text-truncate" style={{ color: '#1e293b', fontSize: '0.8rem' }}>
              Administrator
            </div>
            <div className="text-truncate" style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
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
        className="d-lg-none px-3 py-2 border-bottom d-flex align-items-center justify-content-between sticky-top bg-white"
        style={{ borderColor: '#edf0f2', zIndex: 1010 }}
      >
        <Link href="/" className="lb-wordmark text-decoration-none m-0">
          Tiny<span style={{ color: 'var(--lb-primary)' }}>Adds</span>
        </Link>
        <button
          className="btn btn-light rounded-3 border-0 p-2 d-flex align-items-center justify-content-center"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#adminSidebarNav"
          aria-controls="adminSidebarNav"
          aria-label="Open navigation menu"
          style={{ width: 36, height: 36, backgroundColor: '#f1f5f9', color: '#334155' }}
        >
          <i className="bi bi-list fs-4" />
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
        style={{ width: '250px', backgroundColor: '#ffffff' }}
      >
        <div className="offcanvas-body d-flex flex-column p-3 h-100">
          {navContent}
        </div>
      </div>
    </>
  );
}
