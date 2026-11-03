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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span
            className="badge rounded-pill text-uppercase fw-semibold mb-2"
            style={{ backgroundColor: 'var(--ta-primary-light)', color: 'var(--ta-primary)' }}
          >
            Leads & Inquiries
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--ta-secondary)' }}>
            Customer Inquiries
          </h1>
          <p className="text-muted small mb-0">
            View customer requests, contractor quotation queries, and update ticket statuses.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-3 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search by name, service, phone or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="btn btn-light border-0" onClick={() => setSearchTerm('')}>
                  <i className="bi bi-x" />
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-7 d-flex justify-content-md-end gap-2 flex-wrap">
            {(['all', 'pending', 'in_progress', 'resolved'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                className={`btn btn-sm rounded-3 px-3 ${
                  filter === tab ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setFilter(tab)}
              >
                {tab === 'all' ? 'All Inquiries' : tab.replace('_', ' ')}
                <span className="ms-1 badge bg-light text-dark">
                  {tab === 'all'
                    ? inquiries.length
                    : inquiries.filter((i) => i.status === tab).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3 small text-muted fw-semibold">Requester</th>
                <th className="py-3 small text-muted fw-semibold">Service Needed</th>
                <th className="py-3 small text-muted fw-semibold">Date</th>
                <th className="py-3 small text-muted fw-semibold">Status</th>
                <th className="px-4 py-3 small text-muted fw-semibold text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary" />
                    No customer inquiries found matching your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4">
                      <div className="fw-semibold text-dark">{item.name}</div>
                      <small className="text-muted d-block">{item.email}</small>
                      <small className="text-muted">{item.phone}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {item.service}
                      </span>
                      <p
                        className="text-muted small mb-0 mt-1 text-truncate"
                        style={{ maxWidth: 300 }}
                      >
                        {item.message}
                      </p>
                    </td>
                    <td className="small text-muted">{item.date}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          item.status === 'pending'
                            ? 'bg-warning-subtle text-warning-emphasis'
                            : item.status === 'in_progress'
                            ? 'bg-info-subtle text-info-emphasis'
                            : 'bg-success-subtle text-success-emphasis'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setSelectedInquiry(item)}
                        >
                          <i className="bi bi-eye me-1" /> View
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-success"
                          title="Mark Resolved"
                          onClick={() => updateStatus(item.id, 'resolved')}
                        >
                          <i className="bi bi-check-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal / Drawer View */}
      {selectedInquiry && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: 'var(--ta-secondary)' }}>
                  Inquiry Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedInquiry(null)}
                />
              </div>
              <div className="modal-body py-3">
                <div className="p-3 rounded-3 bg-light mb-3">
                  <div className="fw-bold fs-6">{selectedInquiry.name}</div>
                  <div className="small text-muted mb-1">{selectedInquiry.email}</div>
                  <div className="small text-muted">{selectedInquiry.phone}</div>
                </div>

                <div className="mb-3">
                  <label className="small text-uppercase text-muted fw-semibold d-block mb-1">
                    Requested Service
                  </label>
                  <div className="fw-semibold">{selectedInquiry.service}</div>
                </div>

                <div className="mb-3">
                  <label className="small text-uppercase text-muted fw-semibold d-block mb-1">
                    Message / Requirements
                  </label>
                  <div className="p-3 border rounded-3 bg-white text-secondary small">
                    {selectedInquiry.message}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small text-uppercase text-muted fw-semibold d-block mb-2">
                    Update Ticket Status
                  </label>
                  <div className="btn-group w-100">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        selectedInquiry.status === 'pending'
                          ? 'btn-warning'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => updateStatus(selectedInquiry.id, 'pending')}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        selectedInquiry.status === 'in_progress'
                          ? 'btn-info text-white'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => updateStatus(selectedInquiry.id, 'in_progress')}
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        selectedInquiry.status === 'resolved'
                          ? 'btn-success'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => updateStatus(selectedInquiry.id, 'resolved')}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-3"
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
