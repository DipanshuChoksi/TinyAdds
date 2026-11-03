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
  const [inquiries, approvals, blogs, packages] = await Promise.all([
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
      icon: 'bi-envelope-paper',
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
      icon: 'bi-box-seam',
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1 tracking-tight" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </h1>
          <p className="small mb-0" style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Monitor real-time contractor inquiries, post approvals, active monetization packages, and search trends.
          </p>
        </div>
        <div>
          <Link
            href="/admin/post-approval"
            className="btn btn-sm d-inline-flex align-items-center gap-2 py-1 px-3 text-white fw-medium rounded-pill shadow-sm"
            style={{ backgroundColor: 'var(--lb-primary)', fontSize: '0.82rem' }}
          >
            <i className="bi bi-shield-check" />
            <span>Review Posts ({pendingApprovals})</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="row g-3 mb-4">
        {STATS.map((s) => (
          <div key={s.title} className="col-6 col-xl-3">
            <div className="admin-stat-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="small fw-medium" style={{ color: '#64748b', fontSize: '0.82rem', letterSpacing: '-0.01em' }}>
                    {s.title}
                  </span>
                  <div className="admin-stat-icon">
                    <i className={`bi ${s.icon}`} />
                  </div>
                </div>
                <div className="h3 fw-bold mb-1" style={{ color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {s.value}
                </div>
              </div>
              <div
                className="d-flex align-items-center justify-content-between mt-3 pt-2"
                style={{ borderTop: '1px solid #f8fafc' }}
              >
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {s.label}
                </span>
                <Link
                  href={s.href}
                  className="small fw-semibold d-inline-flex align-items-center gap-1 text-decoration-none"
                  style={{ color: 'var(--lb-primary)', fontSize: '0.75rem' }}
                >
                  Manage <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full-Width Recent Inquiries Table */}
      <div className="admin-card overflow-hidden p-0 mb-4">
        <div
          className="px-4 py-3 d-flex justify-content-between align-items-center"
          style={{ borderBottom: '1px solid #f1f5f9' }}
        >
          <div>
            <h2 className="fw-semibold mb-0" style={{ color: '#0f172a', fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
              Recent Inquiries
            </h2>
            <small style={{ color: '#64748b', fontSize: '0.78rem' }}>
              Latest direct user requests for contractors
            </small>
          </div>
          <Link
            href="/admin/inquire"
            className="btn btn-sm lb-btn-neutral rounded-pill py-1 px-3"
            style={{ fontSize: '0.78rem' }}
          >
            View All ({inquiries.length})
          </Link>
        </div>
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th className="ps-4">Requester</th>
                <th>Service Needed</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end pe-4" style={{ width: '110px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.slice(0, 6).map((inq) => (
                <tr key={inq.id}>
                  <td className="ps-4">
                    <div className="fw-semibold" style={{ color: '#0f172a', fontSize: '0.85rem' }}>
                      {inq.name}
                    </div>
                    <small className="d-block" style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {inq.email}
                    </small>
                    <small style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                      {inq.phone}
                    </small>
                  </td>
                  <td>
                    <span
                      className="badge rounded-pill mb-1 fw-normal"
                      style={{ backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
                    >
                      {inq.service}
                    </span>
                    <p
                      className="small mb-0 text-truncate"
                      style={{ maxWidth: 360, color: '#64748b', fontSize: '0.78rem' }}
                    >
                      {inq.message}
                    </p>
                  </td>
                  <td className="small" style={{ color: '#64748b', fontSize: '0.82rem' }}>
                    {inq.date}
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
                  <td className="text-end pe-4">
                    <Link
                      href="/admin/inquire"
                      className="btn btn-sm btn-outline-secondary rounded-pill py-1 px-3 d-inline-flex align-items-center gap-1"
                      style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', borderColor: '#e2e8f0', color: '#475569' }}
                    >
                      <span>Details</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
