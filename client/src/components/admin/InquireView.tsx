'use client';

import type { AdminInquiry } from '@/src/types';
import { useEffect, useState } from 'react';
import Pagination from '@/components/ui/Pagination';

interface InquireViewProps {
  initialInquiries: AdminInquiry[];
  page?: number;
  totalPages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
}

export default function InquireView({
  initialInquiries,
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  onSearch,
}: InquireViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => onSearch?.(searchTerm.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [onSearch, searchTerm]);

  const filtered = initialInquiries;

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a' }}>
            Customer Inquiries
          </h1>
          <p className="small mb-0" style={{ color: '#64748b' }}>
            Review customer requests and view submitted inquiry details.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-card mb-4 p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6 col-lg-5">
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
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                  style={{ color: '#94a3b8' }}
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x-circle-fill" />
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-7 d-flex justify-content-md-end align-items-center">
            <span
              className="badge rounded-pill fw-semibold"
              style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
            >
              {total} {total === 1 ? 'Inquiry' : 'Inquiries'}
            </span>
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
                {/* <th>Status</th> */}
                <th className="text-end pe-4" style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
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
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center justify-content-end gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                          style={{ width: 34, height: 34 }}
                          title="View inquiry"
                          aria-label={`View inquiry from ${item.name}`}
                          onClick={() => setSelectedInquiry(item)}
                        >
                          <i className="bi bi-eye" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && onPageChange && (
          <div className="p-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
            <span className="small text-muted">
              Page {page} of {totalPages} {total > 0 && `(${total} total inquiries)`}
            </span>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              ariaLabel="Inquiry pagination"
            />
          </div>
        )}
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
              {/* <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                  Inquiry Details #{selectedInquiry.id}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedInquiry(null)}
                />
              </div> */}
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
                  <div
                    className="p-3 rounded-2 border bg-white small text-secondary text-break"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                  >
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* <div>
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
                </div> */}
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
