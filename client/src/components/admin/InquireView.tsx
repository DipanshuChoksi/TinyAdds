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
          <span className="lb-badge mb-2">
            Leads & Inquiries
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--lb-ink)' }}>
            Customer Inquiries
          </h1>
          <p className="small mb-0" style={{ color: 'var(--lb-text)' }}>
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
                style={{ color: 'var(--lb-text)' }}
              />
              <input
                type="text"
                className="form-control admin-search-input ps-5"
                placeholder="Search by name, service, phone or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                  style={{ color: 'var(--lb-text)' }}
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-circle-fill" />
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-7 d-flex justify-content-md-end gap-2 flex-wrap">
            {(['all', 'pending', 'in_progress', 'resolved'] as const).map((tab) => {
              const active = filter === tab;
              const count = tab === 'all' ? inquiries.length : inquiries.filter((i) => i.status === tab).length;
              return (
                <button
                  key={tab}
                  type="button"
                  className={`btn admin-pill-btn d-inline-flex align-items-center gap-2 ${
                    active ? 'lb-btn-primary' : 'lb-btn-soft'
                  }`}
                  onClick={() => setFilter(tab)}
                >
                  <span>{tab === 'all' ? 'All Inquiries' : tab === 'in_progress' ? 'In Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  <span
                    className="badge rounded-pill"
                    style={{
                      backgroundColor: active ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
                      color: active ? '#ffffff' : 'var(--lb-primary)',
                      fontWeight: 700,
                    }}
                  >
                    {count}
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
                <th>Requester</th>
                <th>Service Needed</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5" style={{ color: 'var(--lb-text)' }}>
                    <i className="bi bi-inbox fs-1 d-block mb-2" style={{ color: 'var(--lb-primary)' }} />
                    No customer inquiries found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="fw-bold" style={{ color: 'var(--lb-ink)' }}>{item.name}</div>
                      <small className="d-block" style={{ color: 'var(--lb-text)' }}>{item.email}</small>
                      <small style={{ color: 'var(--lb-text)' }}>{item.phone}</small>
                    </td>
                    <td>
                      <span className="badge rounded-pill" style={{ backgroundColor: 'var(--lb-soft)', color: 'var(--lb-ink)', border: '1px solid var(--lb-line)' }}>
                        {item.service}
                      </span>
                      <p
                        className="small mb-0 mt-1 text-truncate"
                        style={{ maxWidth: 300, color: 'var(--lb-text)' }}
                      >
                        {item.message}
                      </p>
                    </td>
                    <td className="small" style={{ color: 'var(--lb-text)' }}>{item.date}</td>
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
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          type="button"
                          className="btn lb-btn-soft admin-pill-btn py-1 px-3"
                          style={{ fontSize: '0.8rem' }}
                          onClick={() => setSelectedInquiry(item)}
                        >
                          <i className="bi bi-eye me-1" /> View
                        </button>
                        {item.status !== 'resolved' && (
                          <button
                            type="button"
                            className="btn btn-sm rounded-pill text-white"
                            style={{ backgroundColor: 'var(--lb-verified)' }}
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

      {/* Detail Modal / Drawer View */}
      {selectedInquiry && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(59, 36, 24, 0.4)', backdropFilter: 'blur(3px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content admin-card border-0 shadow-lg p-0 overflow-hidden">
              <div
                className="modal-header border-0 p-4 pb-2 d-flex justify-content-between align-items-center"
                style={{ borderBottom: '1px solid var(--lb-line)' }}
              >
                <div className="d-flex align-items-center gap-2">
                  <span className="lb-badge" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>Ticket #{selectedInquiry.id}</span>
                  <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--lb-ink)' }}>
                    Inquiry Details
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedInquiry(null)}
                />
              </div>
              <div className="modal-body p-4">
                <div
                  className="p-3 rounded-4 mb-3"
                  style={{ backgroundColor: 'var(--lb-soft)', border: '1px solid var(--lb-line)' }}
                >
                  <div className="fw-bold fs-6" style={{ color: 'var(--lb-ink)' }}>{selectedInquiry.name}</div>
                  <div className="small mb-1" style={{ color: 'var(--lb-text)' }}>
                    <i className="bi bi-envelope me-1" /> {selectedInquiry.email}
                  </div>
                  <div className="small" style={{ color: 'var(--lb-text)' }}>
                    <i className="bi bi-telephone me-1" /> {selectedInquiry.phone}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small text-uppercase fw-bold d-block mb-1" style={{ color: 'var(--lb-text)', fontSize: '0.75rem' }}>
                    Requested Service
                  </label>
                  <div className="fw-bold" style={{ color: 'var(--lb-ink)' }}>{selectedInquiry.service}</div>
                </div>

                <div className="mb-3">
                  <label className="small text-uppercase fw-bold d-block mb-1" style={{ color: 'var(--lb-text)', fontSize: '0.75rem' }}>
                    Message / Requirements
                  </label>
                  <div
                    className="p-3 rounded-3"
                    style={{ backgroundColor: '#ffffff', border: '1px solid var(--lb-line)', color: 'var(--lb-ink)', fontSize: '0.9rem' }}
                  >
                    {selectedInquiry.message}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small text-uppercase fw-bold d-block mb-2" style={{ color: 'var(--lb-text)', fontSize: '0.75rem' }}>
                    Update Ticket Status
                  </label>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn admin-pill-btn flex-grow-1 ${
                        selectedInquiry.status === 'pending'
                          ? 'btn-warning text-dark fw-bold'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => updateStatus(selectedInquiry.id, 'pending')}
                    >
                      Pending
                    </button>
                    <button
                      type="button"
                      className={`btn admin-pill-btn flex-grow-1 ${
                        selectedInquiry.status === 'in_progress'
                          ? 'btn-info text-white fw-bold'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => updateStatus(selectedInquiry.id, 'in_progress')}
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      className={`btn admin-pill-btn flex-grow-1 ${
                        selectedInquiry.status === 'resolved'
                          ? 'btn-success text-white fw-bold'
                          : 'btn-outline-secondary'
                      }`}
                      onClick={() => updateStatus(selectedInquiry.id, 'resolved')}
                    >
                      Resolved
                    </button>
                  </div>
                </div>
              </div>
              <div
                className="modal-footer border-0 p-3 px-4 d-flex justify-content-end"
                style={{ backgroundColor: 'var(--lb-soft)' }}
              >
                <button
                  type="button"
                  className="btn lb-btn-primary admin-pill-btn"
                  onClick={() => setSelectedInquiry(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
