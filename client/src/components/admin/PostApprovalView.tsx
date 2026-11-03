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
          <span
            className="badge rounded-pill text-uppercase fw-semibold mb-2"
            style={{ backgroundColor: 'var(--ta-primary-light)', color: 'var(--ta-primary)' }}
          >
            Content Moderation
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--ta-secondary)' }}>
            Post Approval Queue
          </h1>
          <p className="text-muted small mb-0">
            Review vendor advertisements and listing submissions before they are indexed on the platform.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`btn btn-sm rounded-3 px-3 ${
              filter === tab ? 'btn-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'all' ? 'All Submissions' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ms-1 badge bg-light text-dark">
              {tab === 'all'
                ? approvals.length
                : approvals.filter((a) => a.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Listing Cards Grid */}
      <div className="row g-4">
        {filtered.length === 0 ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <i className="bi bi-shield-check fs-1 text-muted mb-2" />
              <h3 className="h6 fw-bold">Queue is empty</h3>
              <p className="text-muted small mb-0">No posts currently in this status.</p>
            </div>
          </div>
        ) : (
          filtered.map((post) => (
            <div key={post.id} className="col-12 col-md-6 col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-white">
                <div className="position-relative" style={{ height: 180, backgroundColor: 'var(--ta-gray-100)' }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-fit-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span
                    className={`position-absolute top-0 end-0 m-3 badge rounded-pill ${
                      post.status === 'pending'
                        ? 'bg-warning text-dark'
                        : post.status === 'approved'
                        ? 'bg-success'
                        : 'bg-danger'
                    }`}
                  >
                    {post.status.toUpperCase()}
                  </span>
                </div>
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-light text-secondary border">{post.category}</span>
                    <small className="text-muted">• {post.city}</small>
                  </div>
                  <h3 className="h6 fw-bold mb-2 text-dark">{post.title}</h3>
                  <div className="small text-muted mb-3">
                    By <strong className="text-secondary">{post.vendorName}</strong> • {post.submittedAt}
                  </div>
                  {post.price && (
                    <div className="small fw-semibold text-primary mb-3">{post.price}</div>
                  )}

                  <div className="mt-auto pt-3 border-top d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary flex-grow-1 rounded-3"
                      onClick={() => setSelectedPost(post)}
                    >
                      <i className="bi bi-eye me-1" /> Inspect
                    </button>
                    {post.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-success rounded-3 px-3"
                          title="Approve Post"
                          onClick={() => handleDecision(post.id, 'approved')}
                        >
                          <i className="bi bi-check-lg" /> Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-3 px-3"
                          title="Reject Post"
                          onClick={() => handleDecision(post.id, 'rejected')}
                        >
                          <i className="bi bi-x-lg" /> Reject
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning rounded-3"
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
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="position-relative" style={{ height: 200 }}>
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  fill
                  className="object-fit-cover"
                />
              </div>
              <div className="modal-body p-4">
                <span className="badge bg-light text-secondary border mb-2">{selectedPost.category}</span>
                <h4 className="h5 fw-bold mb-2">{selectedPost.title}</h4>
                <div className="small text-muted mb-3">
                  Vendor: <strong>{selectedPost.vendorName}</strong> | Location: <strong>{selectedPost.city}</strong>
                </div>
                {selectedPost.price && (
                  <div className="fw-semibold text-primary mb-3">Rate: {selectedPost.price}</div>
                )}
                <div className="p-3 bg-light rounded-3 small text-muted mb-3">
                  Verification checks: Standard quality passed, content rules compliant, no duplicate listings found for this contractor within 7 days.
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-success flex-grow-1 rounded-3"
                    onClick={() => {
                      handleDecision(selectedPost.id, 'approved');
                    }}
                  >
                    <i className="bi bi-check-circle me-1" /> Approve & Publish
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger rounded-3"
                    onClick={() => {
                      handleDecision(selectedPost.id, 'rejected');
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-secondary rounded-3"
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
