'use client';

import { useState } from 'react';
import type { AdminPackageResponse, CreatePackagePayload, UpdatePackagePayload } from '@/src/types/package';

interface ManagePackageViewProps {
  initialPackages: AdminPackageResponse[];
  onCreatePackage: (data: CreatePackagePayload) => Promise<AdminPackageResponse>;
  onUpdatePackage: (id: string, data: UpdatePackagePayload) => Promise<AdminPackageResponse>;
  onToggleStatus: (id: string, isActive: boolean) => Promise<void>;
  onDeletePackage?: (id: string) => Promise<void>;
}

export default function ManagePackageView({
  initialPackages,
  onCreatePackage,
  onUpdatePackage,
  onToggleStatus,
  onDeletePackage,
}: ManagePackageViewProps) {
  const [packages, setPackages] = useState<AdminPackageResponse[]>(initialPackages);
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<AdminPackageResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState(999);
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const [listingLimit, setListingLimit] = useState(10);
  const [featuresText, setFeaturesText] = useState('Featured Placement\nDirect Leads\nEmail Support');
  const [isPopular, setIsPopular] = useState(false);

  const openCreateModal = () => {
    setEditingPkg(null);
    setName('');
    setPrice(999);
    setPeriod('month');
    setListingLimit(10);
    setFeaturesText('Featured Placement\nDirect Leads\nEmail Support');
    setIsPopular(false);
    setErrorMessage(null);
    setShowModal(true);
  };

  const openEditModal = (pkg: AdminPackageResponse) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setPrice(pkg.price);
    setPeriod(pkg.period || 'month');
    setListingLimit(pkg.listingLimit);
    setFeaturesText((pkg.features || []).join('\n'));
    setIsPopular(!!pkg.isPopular);
    setErrorMessage(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editingPkg) {
        const payload: UpdatePackagePayload = {
          name,
          price: Number(price),
          period,
          listingLimit: Number(listingLimit),
          features,
          isPopular,
        };
        const updated = await onUpdatePackage(editingPkg._id, payload);
        setPackages((prev) => prev.map((p) => (p._id === editingPkg._id ? updated : p)));
      } else {
        const payload: CreatePackagePayload = {
          name,
          price: Number(price),
          period,
          listingLimit: Number(listingLimit),
          features,
          isPopular,
          isActive: true,
        };
        const created = await onCreatePackage(payload);
        setPackages((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err: unknown) {
      console.error('Failed to save package:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save package');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (pkg: AdminPackageResponse) => {
    const nextActive = !pkg.isActive;
    setActionLoadingId(pkg._id);
    try {
      await onToggleStatus(pkg._id, nextActive);
      setPackages((prev) =>
        prev.map((p) => (p._id === pkg._id ? { ...p, isActive: nextActive } : p))
      );
    } catch (err) {
      console.error('Failed to toggle package status:', err);
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (pkg: AdminPackageResponse) => {
    if (!onDeletePackage) return;
    if (!window.confirm(`Are you sure you want to delete package "${pkg.name}"?`)) {
      return;
    }

    setActionLoadingId(pkg._id);
    try {
      await onDeletePackage(pkg._id);
      setPackages((prev) => prev.filter((p) => p._id !== pkg._id));
    } catch (err) {
      console.error('Failed to delete package:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete package');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
            Subscription Packages
          </h1>
          <p className="small mb-0" style={{ color: '#64748b' }}>
            Configure vendor subscription tiers, listing quotas, search boost benefits, and pricing.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-sm d-inline-flex align-items-center gap-2 py-1 px-3 text-white fw-medium rounded-pill shadow-sm"
            style={{ backgroundColor: 'var(--lb-primary)', fontSize: '0.82rem' }}
            onClick={openCreateModal}
          >
            <i className="bi bi-plus-lg" />
            <span>Add New Package</span>
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <div className="card p-5 text-center border-0 shadow-sm rounded-3">
          <i className="bi bi-box-seam display-4 text-muted mb-3" />
          <h5 className="fw-semibold text-dark">No Packages Configured</h5>
          <p className="text-muted small mb-3">Create your first subscription tier to start monetizing vendor listings.</p>
          <div>
            <button
              type="button"
              className="btn btn-sm text-white px-3 py-1 rounded-pill"
              style={{ backgroundColor: 'var(--lb-primary)' }}
              onClick={openCreateModal}
            >
              Add New Package
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {packages.map((pkg) => (
            <div key={pkg._id} className="col-12 col-md-6 col-xl-4">
              <div
                className="admin-card h-100 p-4 position-relative d-flex flex-column"
                style={{
                  borderColor: pkg.isPopular ? 'var(--lb-primary)' : 'rgba(226, 232, 240, 0.8)',
                }}
              >
                {pkg.isPopular && (
                  <span
                    className="position-absolute top-0 end-0 m-3 badge rounded-pill px-2 py-1"
                    style={{
                      backgroundColor: 'rgba(212, 87, 43, 0.12)',
                      color: 'var(--lb-primary)',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  >
                    Popular
                  </span>
                )}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className={pkg.isActive ? 'admin-badge-active' : 'admin-badge-inactive'}>
                    {pkg.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <h3 className="h6 fw-semibold mb-1" style={{ color: '#0f172a' }}>
                  {pkg.name}
                </h3>
                <div className="d-flex align-items-baseline gap-1 my-2">
                  <span className="h4 fw-bold mb-0" style={{ color: '#0f172a' }}>
                    ₹{pkg.price}
                  </span>
                  <span className="small text-muted">/{pkg.period || 'month'}</span>
                </div>
                <div className="small text-muted mb-3">
                  <strong className="text-dark">{pkg.listingLimit}</strong> ad listings included
                </div>

                <div
                  className="pt-3 mb-4 flex-grow-1"
                  style={{ borderTop: '1px solid #f1f5f9' }}
                >
                  <div
                    className="text-uppercase mb-2 text-muted fw-semibold"
                    style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}
                  >
                    Features
                  </div>
                  <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                    {pkg.features && pkg.features.length > 0 ? (
                      pkg.features.map((feat, idx) => (
                        <li
                          key={idx}
                          className="d-flex align-items-center gap-2"
                          style={{ color: '#475569', fontSize: '0.82rem' }}
                        >
                          <i className="bi bi-check2 text-success fw-bold" />
                          <span>{feat}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted fst-italic" style={{ fontSize: '0.8rem' }}>
                        No specific features listed
                      </li>
                    )}
                  </ul>
                </div>

                <div
                  className="mt-auto pt-3 d-flex gap-2"
                  style={{ borderTop: '1px solid #f1f5f9' }}
                >
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-2 flex-grow-1 py-1"
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => openEditModal(pkg)}
                    disabled={actionLoadingId === pkg._id}
                  >
                    <i className="bi bi-pencil me-1" /> Edit
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-2 py-1 px-3 ${
                      pkg.isActive ? 'btn-outline-danger' : 'btn-outline-success'
                    }`}
                    style={{ fontSize: '0.78rem' }}
                    onClick={() => handleToggle(pkg)}
                    disabled={actionLoadingId === pkg._id}
                  >
                    {actionLoadingId === pkg._id ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    ) : pkg.isActive ? (
                      'Deactivate'
                    ) : (
                      'Activate'
                    )}
                  </button>
                  {onDeletePackage && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger rounded-2 py-1 px-2"
                      style={{ fontSize: '0.78rem' }}
                      title="Delete Package"
                      onClick={() => handleDelete(pkg)}
                      disabled={actionLoadingId === pkg._id}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <form onSubmit={handleSave}>
                <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                    {editingPkg ? 'Edit Package' : 'Create Package'}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="modal-body p-4">
                  {errorMessage && (
                    <div className="alert alert-danger py-2 px-3 small mb-3">
                      <i className="bi bi-exclamation-triangle-fill me-2" />
                      {errorMessage}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Package Name</label>
                    <input
                      type="text"
                      className="form-control rounded-2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-muted">Price (INR)</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control rounded-2"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-muted">Period</label>
                      <select
                        className="form-select rounded-2"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as 'month' | 'year')}
                      >
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-muted">Listing Limit</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control rounded-2"
                        value={listingLimit}
                        onChange={(e) => setListingLimit(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Features (one per line)</label>
                    <textarea
                      className="form-control rounded-2"
                      rows={4}
                      value={featuresText}
                      onChange={(e) => setFeaturesText(e.target.value)}
                      placeholder="Featured Placement&#10;Direct Leads&#10;Email Support"
                      required
                    />
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isPopularCheck"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                    />
                    <label className="form-check-label small" htmlFor="isPopularCheck">
                      Mark as Popular tier
                    </label>
                  </div>
                </div>
                <div className="modal-footer p-3 bg-light border-top">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-2"
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm text-white rounded-2 px-3 d-inline-flex align-items-center gap-2"
                    style={{ backgroundColor: 'var(--lb-primary)' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    )}
                    <span>{editingPkg ? 'Save Changes' : 'Create Package'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
