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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          {/* <span className="lb-badge mb-2">
            Content Moderation
          </span> */}
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--lb-ink)' }}>
            Post Approval Queue
          </h1>
          <p className="small mb-0" style={{ color: 'var(--lb-text)' }}>
            Review vendor advertisements and listing submissions before they are indexed on the platform.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => {
          const active = filter === tab;
          const count = tab === 'all' ? approvals.length : approvals.filter((a) => a.status === tab).length;
          return (
            <button
              key={tab}
              type="button"
              className={`btn admin-pill-btn d-inline-flex align-items-center gap-2 ${
                active ? 'lb-btn-primary' : 'lb-btn-soft'
              }`}
              onClick={() => setFilter(tab)}
            >
              <span>{tab === 'all' ? 'All Submissions' : tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
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

      {/* Listing Cards Grid */}
      <div className="row g-4">
        {filtered.length === 0 ? (
          <div className="col-12">
            <div className="admin-card p-5 text-center">
              <i className="bi bi-shield-check fs-1 d-block mb-2" style={{ color: 'var(--lb-primary)' }} />
              <h3 className="h6 fw-bold mb-1" style={{ color: 'var(--lb-ink)' }}>Queue is empty</h3>
              <p className="small mb-0" style={{ color: 'var(--lb-text)' }}>No posts currently in this status.</p>
            </div>
          </div>
        ) : (
          filtered.map((post) => (
            <div key={post.id} className="col-12 col-md-6 col-xl-4">
              <div className="admin-card h-100 overflow-hidden d-flex flex-column p-0">
                <div className="position-relative" style={{ height: 200, backgroundColor: 'var(--lb-soft)' }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-fit-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span
                    className={`position-absolute top-0 end-0 m-3 ${
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
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span
                      className="badge rounded-pill"
                      style={{ backgroundColor: 'var(--lb-soft)', color: 'var(--lb-primary)', border: '1px solid var(--lb-line)' }}
                    >
                      {post.category}
                    </span>
                    <small style={{ color: 'var(--lb-text)' }}>• {post.city}</small>
                  </div>
                  <h3 className="h6 fw-bold mb-2" style={{ color: 'var(--lb-ink)' }}>
                    {post.title}
                  </h3>
                  <div className="small mb-3" style={{ color: 'var(--lb-text)' }}>
                    By <strong style={{ color: 'var(--lb-ink)' }}>{post.vendorName}</strong> • {post.submittedAt}
                  </div>
                  {post.price && (
                    <div className="small fw-bold mb-3" style={{ color: 'var(--lb-primary)' }}>
                      {post.price}
                    </div>
                  )}

                  <div
                    className="mt-auto pt-3 d-flex gap-2"
                    style={{ borderTop: '1px solid var(--lb-line)' }}
                  >
                    <button
                      type="button"
                      className="btn lb-btn-soft admin-pill-btn flex-grow-1"
                      onClick={() => setSelectedPost(post)}
                    >
                      <i className="bi bi-eye me-1" /> Inspect
                    </button>
                    {post.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm rounded-pill text-white px-3"
                          style={{ backgroundColor: 'var(--lb-verified)' }}
                          title="Approve Post"
                          onClick={() => handleDecision(post.id, 'approved')}
                        >
                          <i className="bi bi-check-lg" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          title="Reject Post"
                          onClick={() => handleDecision(post.id, 'rejected')}
                        >
                          <i className="bi bi-x-lg" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn lb-btn-soft admin-pill-btn"
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
          style={{ backgroundColor: 'rgba(59, 36, 24, 0.4)', backdropFilter: 'blur(3px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content admin-card border-0 shadow-lg p-0 overflow-hidden">
              <div className="position-relative" style={{ height: 220, backgroundColor: 'var(--lb-soft)' }}>
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
                  className="badge rounded-pill mb-2"
                  style={{ backgroundColor: 'var(--lb-soft)', color: 'var(--lb-primary)', border: '1px solid var(--lb-line)' }}
                >
                  {selectedPost.category}
                </span>
                <h4 className="h5 fw-bold mb-2" style={{ color: 'var(--lb-ink)' }}>
                  {selectedPost.title}
                </h4>
                <div className="small mb-3" style={{ color: 'var(--lb-text)' }}>
                  Vendor: <strong style={{ color: 'var(--lb-ink)' }}>{selectedPost.vendorName}</strong> | Location: <strong style={{ color: 'var(--lb-ink)' }}>{selectedPost.city}</strong>
                </div>
                {selectedPost.price && (
                  <div className="fw-bold mb-3" style={{ color: 'var(--lb-primary)' }}>
                    Rate: {selectedPost.price}
                  </div>
                )}
                <div
                  className="p-3 rounded-3 small mb-4"
                  style={{ backgroundColor: 'var(--lb-soft)', border: '1px solid var(--lb-line)', color: 'var(--lb-text)' }}
                >
                  <i className="bi bi-shield-check text-success me-1" />
                  <strong>Verification checks:</strong> Standard quality passed, content rules compliant, no duplicate listings found for this contractor within 7 days.
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm rounded-pill text-white flex-grow-1 py-2 fw-semibold"
                    style={{ backgroundColor: 'var(--lb-verified)' }}
                    onClick={() => {
                      handleDecision(selectedPost.id, 'approved');
                    }}
                  >
                    <i className="bi bi-check-circle me-1" /> Approve & Publish
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger admin-pill-btn px-4"
                    onClick={() => {
                      handleDecision(selectedPost.id, 'rejected');
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
              <div
                className="modal-footer border-0 p-3 px-4 d-flex justify-content-end"
                style={{ backgroundColor: 'var(--lb-soft)' }}
              >
                <button
                  type="button"
                  className="btn lb-btn-soft admin-pill-btn"
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
