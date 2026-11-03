'use client';

import { useState } from 'react';
import type { AdminPackage } from '@/src/types';

interface ManagePackageViewProps {
  initialPackages: AdminPackage[];
}

export default function ManagePackageView({ initialPackages }: ManagePackageViewProps) {
  const [packages, setPackages] = useState<AdminPackage[]>(initialPackages);
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<AdminPackage | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState(999);
  const [listingLimit, setListingLimit] = useState(10);
  const [featuresText, setFeaturesText] = useState('Featured Placement\nDirect Leads\nEmail Support');
  const [isPopular, setIsPopular] = useState(false);

  const openCreateModal = () => {
    setEditingPkg(null);
    setName('');
    setPrice(999);
    setListingLimit(10);
    setFeaturesText('Featured Placement\nDirect Leads\nEmail Support');
    setIsPopular(false);
    setShowModal(true);
  };

  const openEditModal = (pkg: AdminPackage) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setPrice(pkg.price);
    setListingLimit(pkg.listingLimit);
    setFeaturesText(pkg.features.join('\n'));
    setIsPopular(!!pkg.isPopular);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    if (editingPkg) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === editingPkg.id
            ? {
                ...p,
                name,
                price: Number(price),
                listingLimit: Number(listingLimit),
                features,
                isPopular,
              }
            : p
        )
      );
    } else {
      const newPkg: AdminPackage = {
        id: `pkg-${Date.now()}`,
        name,
        price: Number(price),
        period: 'month',
        listingLimit: Number(listingLimit),
        features,
        isPopular,
        status: 'active',
      };
      setPackages([...packages, newPkg]);
    }
    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
      )
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="lb-badge mb-2">
            Monetization & Plans
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--lb-ink)' }}>
            Manage Subscription Packages
          </h1>
          <p className="small mb-0" style={{ color: 'var(--lb-text)' }}>
            Configure vendor subscription tiers, listing quotas, search boost benefits, and pricing.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn lb-btn-primary d-inline-flex align-items-center gap-2"
            onClick={openCreateModal}
          >
            <i className="bi bi-plus-lg" />
            <span>Add New Package</span>
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="row g-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="col-12 col-md-6 col-xl-4">
            <div
              className="admin-card h-100 p-4 position-relative d-flex flex-column"
              style={{
                borderColor: pkg.isPopular ? 'var(--lb-primary)' : 'var(--lb-line)',
                boxShadow: pkg.isPopular ? '0 1rem 2.5rem rgba(212, 87, 43, 0.12)' : undefined,
              }}
            >
              {pkg.isPopular && (
                <span
                  className="position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2"
                  style={{ backgroundColor: 'var(--lb-primary)', color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}
                >
                  Most Popular
                </span>
              )}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span
                  className={
                    pkg.status === 'active'
                      ? 'admin-badge-active'
                      : 'admin-badge-inactive'
                  }
                >
                  {pkg.status.toUpperCase()}
                </span>
              </div>
              <h3 className="h5 fw-bold mb-1" style={{ color: 'var(--lb-ink)' }}>
                {pkg.name}
              </h3>
              <div className="d-flex align-items-baseline gap-1 my-3">
                <span className="fs-1 fw-bold" style={{ color: 'var(--lb-primary)', lineHeight: 1 }}>
                  ₹{pkg.price}
                </span>
                <span className="small fw-semibold" style={{ color: 'var(--lb-text)' }}>/{pkg.period}</span>
              </div>
              <div className="small mb-3" style={{ color: 'var(--lb-text)' }}>
                <strong style={{ color: 'var(--lb-ink)' }}>{pkg.listingLimit}</strong> ad listings included
              </div>

              <div
                className="pt-3 mb-4 flex-grow-1"
                style={{ borderTop: '1px solid var(--lb-line)' }}
              >
                <div
                  className="small fw-bold text-uppercase mb-2"
                  style={{ color: 'var(--lb-text)', fontSize: '0.75rem', letterSpacing: '0.05em' }}
                >
                  Package Benefits:
                </div>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="d-flex align-items-center gap-2" style={{ color: 'var(--lb-ink)' }}>
                      <i className="bi bi-check-circle-fill text-success" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="mt-auto pt-3 d-flex gap-2"
                style={{ borderTop: '1px solid var(--lb-line)' }}
              >
                <button
                  type="button"
                  className="btn lb-btn-soft admin-pill-btn flex-grow-1"
                  onClick={() => openEditModal(pkg)}
                >
                  <i className="bi bi-pencil me-1" /> Edit
                </button>
                <button
                  type="button"
                  className={`btn admin-pill-btn ${
                    pkg.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'
                  }`}
                  onClick={() => toggleStatus(pkg.id)}
                >
                  {pkg.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(59, 36, 24, 0.4)', backdropFilter: 'blur(3px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content admin-card border-0 shadow-lg p-0 overflow-hidden">
              <form onSubmit={handleSave}>
                <div
                  className="modal-header border-0 p-4 pb-2 d-flex justify-content-between align-items-center"
                  style={{ borderBottom: '1px solid var(--lb-line)' }}
                >
                  <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--lb-ink)' }}>
                    {editingPkg ? 'Edit Package' : 'Create Package'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: 'var(--lb-ink)' }}>Package Name</label>
                    <input
                      type="text"
                      className="form-control rounded-4 p-3"
                      style={{ border: '1px solid var(--lb-line)' }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold" style={{ color: 'var(--lb-ink)' }}>Price (INR)</label>
                      <input
                        type="number"
                        className="form-control rounded-4 p-3"
                        style={{ border: '1px solid var(--lb-line)' }}
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold" style={{ color: 'var(--lb-ink)' }}>Listing Limit</label>
                      <input
                        type="number"
                        className="form-control rounded-4 p-3"
                        style={{ border: '1px solid var(--lb-line)' }}
                        value={listingLimit}
                        onChange={(e) => setListingLimit(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: 'var(--lb-ink)' }}>Features (one per line)</label>
                    <textarea
                      className="form-control rounded-4 p-3"
                      style={{ border: '1px solid var(--lb-line)' }}
                      rows={4}
                      value={featuresText}
                      onChange={(e) => setFeaturesText(e.target.value)}
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
                    <label className="form-check-label small fw-semibold" htmlFor="isPopularCheck" style={{ color: 'var(--lb-ink)' }}>
                      Mark as &quot;Most Popular&quot; featured card
                    </label>
                  </div>
                </div>
                <div
                  className="modal-footer border-0 p-3 px-4 d-flex justify-content-end gap-2"
                  style={{ backgroundColor: 'var(--lb-soft)' }}
                >
                  <button
                    type="button"
                    className="btn lb-btn-soft admin-pill-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn lb-btn-primary admin-pill-btn">
                    Save Changes
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
