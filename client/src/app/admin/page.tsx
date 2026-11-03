import Link from 'next/link';
import {
  getAdminInquiries,
  getAdminMasterItems,
  getAdminPackages,
  getAdminPostApprovals,
  getAdminSearchTerms,
  getBlogs,
} from '@/lib/api';

export default async function AdminDashboardPage() {
  const [inquiries, approvals, blogs, packages, searchTerms, masterItems] = await Promise.all([
    getAdminInquiries(),
    getAdminPostApprovals(),
    getBlogs(),
    getAdminPackages(),
    getAdminSearchTerms(),
    getAdminMasterItems(),
  ]);

  const pendingInquiries = inquiries.filter((i) => i.status === 'pending').length;
  const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;

  const STATS = [
    {
      title: 'Pending Inquiries',
      value: pendingInquiries,
      icon: 'bi-envelope-paper-fill',
      href: '/admin/inquire',
      label: 'Needs direct response',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      icon: 'bi-check2-circle',
      href: '/admin/post-approval',
      label: 'Awaiting moderation',
    },
    {
      title: 'Active Packages',
      value: packages.length,
      icon: 'bi-box-seam-fill',
      href: '/admin/manage-package',
      label: 'Live monetization plans',
    },
    {
      title: 'Published Blogs',
      value: blogs.length,
      icon: 'bi-journal-richtext',
      href: '/admin/manage-blogs',
      label: 'Content articles',
    },
  ];

  return (
    <div>
      {/* Top Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          {/* <span className="lb-badge mb-2">
            System Overview
          </span> */}
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--lb-ink)' }}>
            Admin Dashboard
          </h1>
          <p className="small mb-0" style={{ color: 'var(--lb-text)' }}>
            Monitor real-time contractor inquiries, post approvals, active monetization packages, and search trends.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/post-approval" className="btn lb-btn-primary d-inline-flex align-items-center gap-2">
            <i className="bi bi-shield-check" />
            <span>Review Posts ({pendingApprovals})</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="row g-3 g-xl-4 mb-4">
        {STATS.map((s) => (
          <div key={s.title} className="col-12 col-sm-6 col-xl-3">
            <div className="admin-stat-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="small fw-bold" style={{ color: 'var(--lb-text)' }}>
                    {s.title}
                  </span>
                  <div className="admin-stat-icon">
                    <i className={`bi ${s.icon}`} />
                  </div>
                </div>
                <div className="fs-1 fw-bold mb-1" style={{ color: 'var(--lb-ink)', lineHeight: 1.1 }}>
                  {s.value}
                </div>
              </div>
              <div
                className="d-flex align-items-center justify-content-between mt-3 pt-2"
                style={{ borderTop: '1px solid var(--lb-line)' }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--lb-text)' }}>
                  {s.label}
                </span>
                <Link
                  href={s.href}
                  className="small fw-bold d-inline-flex align-items-center gap-1 text-decoration-none"
                  style={{ color: 'var(--lb-primary)' }}
                >
                  Manage <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section */}
      <div className="row g-4 mb-4">
        {/* Recent Inquiries Quick Table */}
        <div className="col-12 col-lg-7">
          <div className="admin-card h-100 p-0 overflow-hidden">
            <div
              className="p-4 d-flex justify-content-between align-items-center"
              style={{ borderBottom: '1px solid var(--lb-line)' }}
            >
              <div>
                <h2 className="h6 fw-bold mb-1" style={{ color: 'var(--lb-ink)' }}>
                  Recent Inquiries
                </h2>
                <small style={{ color: 'var(--lb-text)' }}>Latest direct user requests for contractors</small>
              </div>
              <Link
                href="/admin/inquire"
                className="btn lb-btn-soft admin-pill-btn"
              >
                View All ({inquiries.length})
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table admin-table align-middle">
                <thead>
                  <tr>
                    <th>Requester</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.slice(0, 4).map((inq) => (
                    <tr key={inq.id}>
                      <td>
                        <div className="fw-bold small" style={{ color: 'var(--lb-ink)' }}>
                          {inq.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--lb-text)' }}>
                          {inq.phone}
                        </div>
                      </td>
                      <td className="small fw-semibold" style={{ color: 'var(--lb-text)' }}>
                        {inq.service}
                      </td>
                      <td>
                        <span
                          className={
                            inq.status === 'pending'
                              ? 'admin-badge-pending'
                              : inq.status === 'in_progress'
                              ? 'admin-badge-progress'
                              : 'admin-badge-resolved'
                          }
                        >
                          {inq.status === 'in_progress' ? 'In Progress' : inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                        </span>
                      </td>
                      <td className="text-end">
                        <Link
                          href="/admin/inquire"
                          className="btn lb-btn-soft admin-pill-btn py-1 px-3"
                          style={{ fontSize: '0.78rem' }}
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Search Analytics & Master items */}
        <div className="col-12 col-lg-5">
          <div className="admin-card h-100 p-4 d-flex flex-column">
            <div
              className="d-flex justify-content-between align-items-center pb-3 mb-3"
              style={{ borderBottom: '1px solid var(--lb-line)' }}
            >
              <div>
                <h2 className="h6 fw-bold mb-1" style={{ color: 'var(--lb-ink)' }}>
                  Top Search Queries
                </h2>
                <small style={{ color: 'var(--lb-text)' }}>Most popular queries across Gujarat</small>
              </div>
              <Link
                href="/admin/manage-search"
                className="btn lb-btn-soft admin-pill-btn"
              >
                Analytics
              </Link>
            </div>

            <div className="flex-grow-1">
              <div className="d-flex flex-column gap-2">
                {searchTerms.slice(0, 5).map((st) => (
                  <div
                    key={st.id}
                    className="p-2 px-3 rounded-3 d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: 'var(--lb-soft)', border: '1px solid var(--lb-line)' }}
                  >
                    <div>
                      <div className="fw-bold small" style={{ color: 'var(--lb-ink)' }}>
                        {st.term}
                      </div>
                      <small style={{ color: 'var(--lb-text)', fontSize: '0.75rem' }}>
                        {st.city} • {st.category}
                      </small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="badge rounded-pill"
                        style={{
                          backgroundColor: '#ffffff',
                          color: 'var(--lb-ink)',
                          border: '1px solid var(--lb-line)',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      >
                        {st.count} searches
                      </span>
                      <i
                        className={`bi ${
                          st.trend === 'up'
                            ? 'bi-arrow-up-right text-success'
                            : st.trend === 'down'
                            ? 'bi-arrow-down-right text-danger'
                            : 'bi-dash text-secondary'
                        } fs-6`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mt-4 pt-3 d-flex justify-content-between align-items-center"
              style={{ borderTop: '1px solid var(--lb-line)' }}
            >
              <span className="small" style={{ color: 'var(--lb-text)' }}>
                Configured Master Items: <strong>{masterItems.length}</strong>
              </span>
              <Link
                href="/admin/master-item"
                className="btn lb-btn-soft admin-pill-btn"
              >
                Open Master Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
