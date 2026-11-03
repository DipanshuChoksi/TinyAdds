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
          <span
            className="badge rounded-pill text-uppercase fw-semibold mb-2"
            style={{ backgroundColor: 'var(--ta-primary-light)', color: 'var(--ta-primary)' }}
          >
            Monetization & Plans
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--ta-secondary)' }}>
            Manage Subscription Packages
          </h1>
          <p className="text-muted small mb-0">
            Configure vendor subscription tiers, listing quotas, search boost benefits, and pricing.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary rounded-3 px-3 py-2"
            onClick={openCreateModal}
          >
            <i className="bi bi-plus-lg me-1" /> Add New Package
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="row g-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="col-12 col-md-6 col-xl-4">
            <div
              className={`card border-0 shadow-sm rounded-4 h-100 p-4 position-relative ${
                pkg.isPopular ? 'border-2 border-primary' : ''
              } bg-white`}
            >
              {pkg.isPopular && (
                <span
                  className="position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2"
                  style={{ backgroundColor: 'var(--ta-primary)', color: '#fff' }}
                >
                  Most Popular
                </span>
              )}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span
                  className={`badge ${
                    pkg.status === 'active'
                      ? 'bg-success-subtle text-success'
                      : 'bg-secondary-subtle text-secondary'
                  }`}
                >
                  {pkg.status.toUpperCase()}
                </span>
              </div>
              <h3 className="h5 fw-bold mb-1" style={{ color: 'var(--ta-secondary)' }}>
                {pkg.name}
              </h3>
              <div className="d-flex align-items-baseline gap-1 my-3">
                <span className="fs-1 fw-bold" style={{ color: 'var(--ta-primary)' }}>
                  ₹{pkg.price}
                </span>
                <span className="text-muted small">/{pkg.period}</span>
              </div>
              <div className="small text-muted mb-3">
                <strong>{pkg.listingLimit}</strong> ad listings included
              </div>

              <div className="border-top pt-3 mb-4">
                <div className="small fw-semibold text-muted text-uppercase mb-2">Package Benefits:</div>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="d-flex align-items-center gap-2">
                      <i className="bi bi-check2 text-success fw-bold" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-3 border-top d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary flex-grow-1 rounded-3"
                  onClick={() => openEditModal(pkg)}
                >
                  <i className="bi bi-pencil me-1" /> Edit
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-3 ${
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
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <form onSubmit={handleSave}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold" style={{ color: 'var(--ta-secondary)' }}>
                    {editingPkg ? 'Edit Package' : 'Create Package'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Package Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
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
                        className="form-control rounded-3"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Listing Limit</label>
                      <input
                        type="number"
                        className="form-control rounded-3"
                        value={listingLimit}
                        onChange={(e) => setListingLimit(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Features (one per line)</label>
                    <textarea
                      className="form-control rounded-3"
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
                      Mark as &quot;Most Popular&quot; badge
                    </label>
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-3"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-3">
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
