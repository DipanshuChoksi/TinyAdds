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
      icon: 'bi-envelope-paper',
      color: '#FF6B35',
      href: '/admin/inquire',
      label: 'Needs response',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      icon: 'bi-check2-circle',
      color: '#00B894',
      href: '/admin/post-approval',
      label: 'Awaiting moderation',
    },
    {
      title: 'Active Packages',
      value: packages.length,
      icon: 'bi-box-seam',
      color: '#6c5ce7',
      href: '/admin/manage-package',
      label: 'Live monetization plans',
    },
    {
      title: 'Published Blogs',
      value: blogs.length,
      icon: 'bi-journal-text',
      color: '#0984e3',
      href: '/admin/manage-blogs',
      label: 'Content articles',
    },
  ];

  return (
    <div>
      {/* Top Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span
            className="badge rounded-pill text-uppercase fw-semibold mb-2"
            style={{ backgroundColor: 'var(--ta-primary-light)', color: 'var(--ta-primary)' }}
          >
            System Overview
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--ta-secondary)' }}>
            Admin Dashboard
          </h1>
          <p className="text-muted small mb-0">
            Monitor real-time contractor inquiries, post approvals, active monetization packages, and search trends.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/admin/post-approval" className="btn btn-primary rounded-3 px-3 py-2">
            <i className="bi bi-shield-check me-2" />
            Review Posts ({pendingApprovals})
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="row g-3 mb-4">
        {STATS.map((s) => (
          <div key={s.title} className="col-12 col-sm-6 col-xl-3">
            <div className="card admin-stat-card border-0 h-100 p-3 p-xl-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small text-muted fw-medium">{s.title}</span>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 40, height: 40, backgroundColor: 'var(--ta-gray-50)', color: s.color }}
                >
                  <i className={`bi ${s.icon} fs-5`} />
                </div>
              </div>
              <div className="fs-2 fw-bold mb-1" style={{ color: 'var(--ta-secondary)' }}>
                {s.value}
              </div>
              <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top">
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {s.label}
                </span>
                <Link
                  href={s.href}
                  className="small text-decoration-none fw-semibold"
                  style={{ color: 'var(--ta-primary)' }}
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
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h6 fw-bold mb-0" style={{ color: 'var(--ta-secondary)' }}>
                  Recent Inquiries
                </h2>
                <small className="text-muted">Latest direct user requests for contractors</small>
              </div>
              <Link href="/admin/inquire" className="small fw-semibold text-decoration-none" style={{ color: 'var(--ta-primary)' }}>
                View All ({inquiries.length})
              </Link>
            </div>
            <div className="card-body px-4">
              <div className="table-responsive">
                <table className="table align-middle table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="small text-muted fw-semibold">Requester</th>
                      <th className="small text-muted fw-semibold">Service</th>
                      <th className="small text-muted fw-semibold">Status</th>
                      <th className="small text-muted fw-semibold text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.slice(0, 4).map((inq) => (
                      <tr key={inq.id}>
                        <td>
                          <div className="fw-semibold small">{inq.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {inq.phone}
                          </div>
                        </td>
                        <td className="small">{inq.service}</td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              inq.status === 'pending'
                                ? 'bg-warning-subtle text-warning-emphasis'
                                : inq.status === 'in_progress'
                                ? 'bg-info-subtle text-info-emphasis'
                                : 'bg-success-subtle text-success-emphasis'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </td>
                        <td className="text-end">
                          <Link href="/admin/inquire" className="btn btn-sm btn-outline-secondary py-1 px-2 rounded-2">
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
        </div>

        {/* Quick Search Analytics & Master items */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h6 fw-bold mb-0" style={{ color: 'var(--ta-secondary)' }}>
                  Top Search Queries
                </h2>
                <small className="text-muted">Most popular queries across Gujarat</small>
              </div>
              <Link href="/admin/manage-search" className="small fw-semibold text-decoration-none" style={{ color: 'var(--ta-primary)' }}>
                Analytics
              </Link>
            </div>
            <div className="card-body px-4">
              <ul className="list-group list-group-flush">
                {searchTerms.slice(0, 5).map((st) => (
                  <li
                    key={st.id}
                    className="list-group-item px-0 d-flex justify-content-between align-items-center border-bottom-dashed"
                  >
                    <div>
                      <div className="fw-semibold small">{st.term}</div>
                      <small className="text-muted">
                        {st.city} • {st.category}
                      </small>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-light text-dark border me-1">{st.count} searches</span>
                      <i
                        className={`bi ${
                          st.trend === 'up'
                            ? 'bi-arrow-up-right text-success'
                            : st.trend === 'down'
                            ? 'bi-arrow-down-right text-danger'
                            : 'bi-dash text-secondary'
                        }`}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                <span className="small text-muted">Configured Master Items: {masterItems.length}</span>
                <Link href="/admin/master-item" className="btn btn-sm btn-outline-primary rounded-3">
                  Open Master Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
