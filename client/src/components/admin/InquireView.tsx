'use client';

import { AdminInquiry } from '@/src/types';
import { useState } from 'react';

interface InquireViewProps {
  initialInquiries: AdminInquiry[];
  onStatusChange?: (id: string, newStatus: 'pending' | 'in_progress' | 'resolved') => void;
  onDelete?: (id: string) => void;
}

export default function InquireView({ initialInquiries, onStatusChange, onDelete }: InquireViewProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(null);

  const handleStatusChange = (id: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const filtered = initialInquiries.filter((inq) => {
    const matchesFilter = filter === 'all' || inq.status === filter;
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.subject && inq.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
            View customer requests, inquiries, and update ticket statuses.
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
                placeholder="Search by name, subject, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-7 d-flex justify-content-md-end gap-2 flex-wrap">
            {(['all', 'pending', 'in_progress', 'resolved'] as const).map((st) => {
              const label =
                st === 'all'
                  ? 'All Status'
                  : st === 'in_progress'
                  ? 'In Progress'
                  : st.charAt(0).toUpperCase() + st.slice(1);
              return (
                <button
                  key={st}
                  type="button"
                  className={`btn btn-sm ${
                    filter === st ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setFilter(st)}
                >
                  {label}
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
                <th>Subject / Message</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end pe-4" style={{ width: '160px' }}>Action</th>
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
                      {item.phone && (
                        <small style={{ color: '#64748b', fontSize: '0.74rem' }}>{item.phone}</small>
                      )}
                    </td>
                    <td>
                      <span className="badge rounded-1 fw-normal" style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' }}>
                        {item.subject || 'General'}
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
                          item.status === 'in_progress'
                            ? 'admin-badge-progress'
                            : item.status === 'resolved'
                            ? 'admin-badge-resolved'
                            : 'admin-badge-pending'
                        }
                      >
                        {item.status === 'in_progress'
                          ? 'In Progress'
                          : (item.status || 'pending').charAt(0).toUpperCase() + (item.status || 'pending').slice(1)}
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
                            onClick={() => handleStatusChange(item.id, 'resolved')}
                          >
                            <i className="bi bi-check-lg" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger rounded-2 py-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            title="Delete Inquiry"
                            onClick={() => onDelete(item.id)}
                          >
                            <i className="bi bi-trash" />
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
                  {selectedInquiry.phone && (
                    <div className="small text-muted">{selectedInquiry.phone}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="small text-muted fw-bold d-block mb-1" style={{ fontSize: '0.72rem' }}>
                    SUBJECT
                  </label>
                  <div className="fw-medium text-dark">
                    {selectedInquiry.subject || 'General'}
                  </div>
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
                      onClick={() => handleStatusChange(selectedInquiry.id, 'pending')}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${selectedInquiry.status === 'in_progress' ? 'btn-info text-white' : 'btn-outline-secondary'}`}
                      onClick={() => handleStatusChange(selectedInquiry.id, 'in_progress')}
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${selectedInquiry.status === 'resolved' ? 'btn-success' : 'btn-outline-secondary'}`}
                      onClick={() => handleStatusChange(selectedInquiry.id, 'resolved')}
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
