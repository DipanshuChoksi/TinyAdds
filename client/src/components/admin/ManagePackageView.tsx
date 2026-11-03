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
      <div className="row g-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="col-12 col-md-6 col-xl-4">
            <div
              className="admin-card h-100 p-4 position-relative d-flex flex-column"
              style={{
                borderColor: pkg.isPopular ? 'var(--lb-primary)' : 'rgba(226, 232, 240, 0.8)',
              }}
            >
              {pkg.isPopular && (
                <span
                  className="position-absolute top-0 end-0 m-3 badge rounded-pill px-2 py-1"
                  style={{ backgroundColor: 'rgba(212, 87, 43, 0.12)', color: 'var(--lb-primary)', fontWeight: 600, fontSize: '0.7rem' }}
                >
                  Popular
                </span>
              )}
              <div className="d-flex align-items-center justify-content-between mb-2">
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
              <h3 className="h6 fw-semibold mb-1" style={{ color: '#0f172a' }}>
                {pkg.name}
              </h3>
              <div className="d-flex align-items-baseline gap-1 my-2">
                <span className="h4 fw-bold mb-0" style={{ color: '#0f172a' }}>
                  ₹{pkg.price}
                </span>
                <span className="small text-muted">/{pkg.period}</span>
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
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="d-flex align-items-center gap-2" style={{ color: '#475569', fontSize: '0.82rem' }}>
                      <i className="bi bi-check2 text-success fw-bold" />
                      <span>{feat}</span>
                    </li>
                  ))}
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
                >
                  <i className="bi bi-pencil me-1" /> Edit
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-2 py-1 px-3 ${
                    pkg.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'
                  }`}
                  style={{ fontSize: '0.78rem' }}
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
                  />
                </div>
                <div className="modal-body p-4">
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
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Price (INR)</label>
                      <input
                        type="number"
                        className="form-control rounded-2"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Listing Limit</label>
                      <input
                        type="number"
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
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm text-white rounded-2 px-3"
                    style={{ backgroundColor: 'var(--lb-primary)' }}
                  >
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
