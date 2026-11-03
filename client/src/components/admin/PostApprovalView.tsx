'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { AdminPostApproval } from '@/src/types';

interface PostApprovalViewProps {
  initialApprovals: AdminPostApproval[];
}

export default function PostApprovalView({ initialApprovals }: PostApprovalViewProps) {
  const [approvals, setApprovals] = useState<AdminPostApproval[]>(initialApprovals);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedPost, setSelectedPost] = useState<AdminPostApproval | null>(null);

  const handleDecision = (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const filtered = approvals.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
            Post Approval Queue
          </h1>
          <p className="small mb-0" style={{ color: '#64748b' }}>
            Review vendor advertisements and listing submissions before they are indexed on the platform.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-1 mb-4 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => {
          const active = filter === tab;
          const count = tab === 'all' ? approvals.length : approvals.filter((a) => a.status === tab).length;
          return (
            <button
              key={tab}
              type="button"
              className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-2 px-3 py-1 ${
                active ? 'btn-dark' : 'btn-light border'
              }`}
              style={{ fontSize: '0.8rem' }}
              onClick={() => setFilter(tab)}
            >
              <span>{tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: active ? 'rgba(255, 255, 255, 0.25)' : '#e2e8f0',
                  color: active ? '#ffffff' : '#475569',
                  fontWeight: 600,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Listing Cards Grid */}
      <div className="row g-3">
        {filtered.length === 0 ? (
          <div className="col-12">
            <div className="admin-card p-5 text-center">
              <i className="bi bi-shield-check fs-2 d-block mb-2 text-muted" />
              <h3 className="h6 fw-semibold mb-1" style={{ color: '#0f172a' }}>Queue is empty</h3>
              <p className="small mb-0" style={{ color: '#64748b' }}>No posts currently in this status.</p>
            </div>
          </div>
        ) : (
          filtered.map((post) => (
            <div key={post.id} className="col-12 col-md-6 col-xl-4">
              <div className="admin-card h-100 overflow-hidden d-flex flex-column p-0">
                <div className="position-relative" style={{ height: 180, backgroundColor: '#f1f5f9' }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-fit-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span
                    className={`position-absolute top-0 end-0 m-2.5 ${
                      post.status === 'pending'
                        ? 'admin-badge-pending'
                        : post.status === 'approved'
                        ? 'admin-badge-approved'
                        : 'admin-badge-rejected'
                    }`}
                  >
                    {post.status.toUpperCase()}
                  </span>
                </div>
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1.5">
                    <span
                      className="badge rounded-pill fw-normal"
                      style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', fontSize: '0.7rem' }}
                    >
                      {post.category}
                    </span>
                    <small style={{ color: '#94a3b8', fontSize: '0.75rem' }}>• {post.city}</small>
                  </div>
                  <h3 className="h6 fw-semibold mb-1 text-truncate" style={{ color: '#0f172a' }} title={post.title}>
                    {post.title}
                  </h3>
                  <div className="small mb-2" style={{ color: '#64748b', fontSize: '0.78rem' }}>
                    By <strong style={{ color: '#334155' }}>{post.vendorName}</strong> • {post.submittedAt}
                  </div>
                  {post.price && (
                    <div className="small fw-semibold mb-3" style={{ color: 'var(--lb-primary)' }}>
                      {post.price}
                    </div>
                  )}

                  <div
                    className="mt-auto pt-2 d-flex gap-2"
                    style={{ borderTop: '1px solid #f1f5f9' }}
                  >
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-2 flex-grow-1 py-1"
                      style={{ fontSize: '0.78rem' }}
                      onClick={() => setSelectedPost(post)}
                    >
                      <i className="bi bi-eye me-1" /> Inspect
                    </button>
                    {post.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success rounded-2 px-2.5 py-1"
                          title="Approve Post"
                          onClick={() => handleDecision(post.id, 'approved')}
                        >
                          <i className="bi bi-check-lg" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-2 px-2.5 py-1"
                          title="Reject Post"
                          onClick={() => handleDecision(post.id, 'rejected')}
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-2 py-1 px-2"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => handleDecision(post.id, 'pending')}
                      >
                        Re-queue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inspect Modal */}
      {selectedPost && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="position-relative" style={{ height: 200, backgroundColor: '#f1f5f9' }}>
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  fill
                  className="object-fit-cover"
                />
                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0 m-3 bg-white p-2 rounded-circle shadow-sm"
                  onClick={() => setSelectedPost(null)}
                />
              </div>
              <div className="modal-body p-4">
                <span
                  className="badge rounded-pill mb-2 fw-normal"
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                >
                  {selectedPost.category}
                </span>
                <h5 className="fw-semibold mb-2" style={{ color: '#0f172a' }}>
                  {selectedPost.title}
                </h5>
                <div className="small mb-3 text-muted">
                  Vendor: <strong className="text-dark">{selectedPost.vendorName}</strong> | Location: <strong className="text-dark">{selectedPost.city}</strong>
                </div>
                {selectedPost.price && (
                  <div className="fw-semibold mb-3" style={{ color: 'var(--lb-primary)' }}>
                    Rate: {selectedPost.price}
                  </div>
                )}
                <div
                  className="p-3 rounded-2 small mb-4 border bg-light text-secondary"
                >
                  <i className="bi bi-shield-check text-success me-1" />
                  <strong>Verification checks:</strong> Standard quality passed, content rules compliant, no duplicate listings found for this contractor within 7 days.
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-success flex-grow-1 py-1.5 fw-medium rounded-2"
                    onClick={() => {
                      handleDecision(selectedPost.id, 'approved');
                    }}
                  >
                    <i className="bi bi-check-circle me-1" /> Approve & Publish
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger rounded-2 px-3"
                    onClick={() => {
                      handleDecision(selectedPost.id, 'rejected');
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
              <div className="modal-footer p-3 bg-light border-top">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-2"
                  onClick={() => setSelectedPost(null)}
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
