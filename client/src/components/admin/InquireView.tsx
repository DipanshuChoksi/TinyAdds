'use client';

import { AdminInquiry } from '@/src/types';
import { useState } from 'react';

interface InquireViewProps {
  initialInquiries: AdminInquiry[];
}

export default function InquireView({ initialInquiries }: InquireViewProps) {
  const [inquiries, setInquiries] = useState<AdminInquiry[]>(initialInquiries);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(null);

  const updateStatus = (id: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filtered = inquiries.filter((inq) => {
    const matchesFilter = filter === 'all' || inq.status === filter;
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a' }}>
            Customer Inquiries
          </h1>
          <p className="small mb-0" style={{ color: '#64748b' }}>
            View customer requests, contractor quotation queries, and update ticket statuses.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-card mb-4 p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <div className="position-relative">
              <i
                className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: '#94a3b8' }}
              />
              <input
                type="text"
                className="form-control admin-search-input ps-5"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                  style={{ color: '#94a3b8' }}
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-circle-fill" />
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-7 d-flex justify-content-md-end gap-1 flex-wrap">
            {(['all', 'pending', 'in_progress', 'resolved'] as const).map((tab) => {
              const active = filter === tab;
              const count = tab === 'all' ? inquiries.length : inquiries.filter((i) => i.status === tab).length;
              return (
                <button
                  key={tab}
                  type="button"
                  className={`btn btn-sm rounded-2 d-inline-flex align-items-center gap-2 px-3 py-1 ${
                    active ? 'btn-dark' : 'btn-light border'
                  }`}
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => setFilter(tab)}
                >
                  <span>{tab === 'all' ? 'All' : tab === 'in_progress' ? 'In Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  <span
                    className="badge rounded-pill"
                    style={{
                      backgroundColor: active ? 'rgba(255, 255, 255, 0.25)' : '#e2e8f0',
                      color: active ? '#ffffff' : '#475569',
                      fontWeight: 600,
                    }}
                  >
                    {/* {count} */}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden p-0 mb-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th className="ps-4">Requester</th>
                <th>Service Needed</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end pe-4" style={{ width: '130px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary" />
                    No customer inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <div className="fw-semibold" style={{ color: '#1e293b' }}>{item.name}</div>
                      <small className="d-block" style={{ color: '#64748b', fontSize: '0.74rem' }}>{item.email}</small>
                      <small style={{ color: '#64748b', fontSize: '0.74rem' }}>{item.phone}</small>
                    </td>
                    <td>
                      <span className="badge rounded-1 fw-normal" style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' }}>
                        {item.service}
                      </span>
                      <p
                        className="small mb-0 mt-1 text-truncate"
                        style={{ maxWidth: 320, color: '#64748b', fontSize: '0.78rem' }}
                      >
                        {item.message}
                      </p>
                    </td>
                    <td className="small" style={{ color: '#64748b' }}>{item.date}</td>
                    <td>
                      <span
                        className={
                          item.status === 'pending'
                            ? 'admin-badge-pending'
                            : item.status === 'in_progress'
                            ? 'admin-badge-progress'
                            : 'admin-badge-resolved'
                        }
                      >
                        {item.status === 'in_progress' ? 'In Progress' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center justify-content-end gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-2 py-1 px-2"
                          style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                          onClick={() => setSelectedInquiry(item)}
                        >
                          <i className="bi bi-eye me-1" /> View
                        </button>
                        {item.status !== 'resolved' && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success rounded-2 py-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            title="Mark Resolved"
                            onClick={() => updateStatus(item.id, 'resolved')}
                          >
                            <i className="bi bi-check-lg" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                  Inquiry Details #{selectedInquiry.id}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedInquiry(null)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="p-3 rounded-2 bg-light border mb-3">
                  <div className="fw-semibold text-dark">{selectedInquiry.name}</div>
                  <div className="small text-muted mb-1">{selectedInquiry.email}</div>
                  <div className="small text-muted">{selectedInquiry.phone}</div>
                </div>

                <div className="mb-3">
                  <label className="small text-muted fw-bold d-block mb-1" style={{ fontSize: '0.72rem' }}>
                    SERVICE
                  </label>
                  <div className="fw-medium text-dark">{selectedInquiry.service}</div>
                </div>

                <div className="mb-3">
                  <label className="small text-muted fw-bold d-block mb-1" style={{ fontSize: '0.72rem' }}>
                    MESSAGE
                  </label>
                  <div className="p-3 rounded-2 border bg-white small text-secondary">
                    {selectedInquiry.message}
                  </div>
                </div>

                <div>
                  <label className="small text-muted fw-bold d-block mb-2" style={{ fontSize: '0.72rem' }}>
                    STATUS
                  </label>
                  <div className="btn-group w-100">
                    <button
                      type="button"
                      className={`btn btn-sm ${selectedInquiry.status === 'pending' ? 'btn-warning' : 'btn-outline-secondary'}`}
                      onClick={() => updateStatus(selectedInquiry.id, 'pending')}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${selectedInquiry.status === 'in_progress' ? 'btn-info text-white' : 'btn-outline-secondary'}`}
                      onClick={() => updateStatus(selectedInquiry.id, 'in_progress')}
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${selectedInquiry.status === 'resolved' ? 'btn-success' : 'btn-outline-secondary'}`}
                      onClick={() => updateStatus(selectedInquiry.id, 'resolved')}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer p-3 bg-light border-top">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-2"
                  onClick={() => setSelectedInquiry(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
