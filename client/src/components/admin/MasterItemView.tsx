'use client';

import { useState } from 'react';
import type { AdminMasterItem } from '@/src/types';

interface MasterItemViewProps {
  initialMasterItems: AdminMasterItem[];
}

export default function MasterItemView({ initialMasterItems }: MasterItemViewProps) {
  const [items, setItems] = useState<AdminMasterItem[]>(initialMasterItems);
  const [tabType, setTabType] = useState<'all' | 'category' | 'emotion' | 'city' | 'tag'>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<'category' | 'emotion' | 'city' | 'tag'>('category');

  const filtered = items.filter((item) => {
    const matchesTab = tabType === 'all' || item.type === tabType;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i
      )
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newItem: AdminMasterItem = {
      id: `mi-${Date.now()}`,
      name: name.trim(),
      slug,
      type,
      status: 'active',
      itemCount: 0,
    };

    setItems([...items, newItem]);
    setName('');
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this master entry?')) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
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
            System Taxonomies
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--ta-secondary)' }}>
            Master Items
          </h1>
          <p className="text-muted small mb-0">
            Define system master entities including industries, emotional vibe tags, locations, and special badges.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary rounded-3 px-3 py-2"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg me-1" /> Add Master Item
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
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
                placeholder="Search master item or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-7 d-flex justify-content-md-end gap-2 flex-wrap">
            {(['all', 'category', 'emotion', 'city', 'tag'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`btn btn-sm rounded-3 px-3 ${
                  tabType === t ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setTabType(t)}
              >
                {t.toUpperCase()}
                <span className="ms-1 badge bg-light text-dark">
                  {t === 'all' ? items.length : items.filter((i) => i.type === t).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3 small text-muted fw-semibold">Entity Type</th>
                <th className="py-3 small text-muted fw-semibold">Name</th>
                <th className="py-3 small text-muted fw-semibold">Slug (URL Key)</th>
                <th className="py-3 small text-muted fw-semibold">Assigned Listings</th>
                <th className="py-3 small text-muted fw-semibold">Status</th>
                <th className="px-4 py-3 small text-muted fw-semibold text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No master items found for selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4">
                      <span
                        className={`badge rounded-pill text-uppercase ${
                          item.type === 'category'
                            ? 'bg-primary-subtle text-primary'
                            : item.type === 'emotion'
                            ? 'bg-warning-subtle text-warning-emphasis'
                            : item.type === 'city'
                            ? 'bg-info-subtle text-info-emphasis'
                            : 'bg-secondary-subtle text-secondary'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="fw-semibold text-dark">{item.name}</td>
                    <td className="text-muted small">/{item.slug}</td>
                    <td>
                      <span className="badge bg-light text-dark border">{item.itemCount} ads</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge border-0 rounded-pill px-3 py-1 ${
                          item.status === 'active'
                            ? 'bg-success-subtle text-success'
                            : 'bg-secondary-subtle text-secondary'
                        }`}
                        onClick={() => toggleStatus(item.id)}
                      >
                        {item.status.toUpperCase()}
                      </button>
                    </td>
                    <td className="px-4 text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-3"
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <form onSubmit={handleCreate}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold" style={{ color: 'var(--ta-secondary)' }}>
                    Add Master Entity
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Entity Type</label>
                    <select
                      className="form-select rounded-3"
                      value={type}
                      onChange={(e) =>
                        setType(e.target.value as 'category' | 'emotion' | 'city' | 'tag')
                      }
                    >
                      <option value="category">Category</option>
                      <option value="emotion">Emotion</option>
                      <option value="city">City</option>
                      <option value="tag">Special Tag</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Display Name</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Solar Energy or Gandhinagar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
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
                    Save Entity
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
