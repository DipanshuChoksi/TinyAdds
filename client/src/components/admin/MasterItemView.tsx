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
          <span className="lb-badge mb-2">
            System Taxonomies
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--lb-ink)' }}>
            Master Items
          </h1>
          <p className="small mb-0" style={{ color: 'var(--lb-text)' }}>
            Define system master entities including industries, emotional vibe tags, locations, and special badges.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn lb-btn-primary d-inline-flex align-items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg" />
            <span>Add Master Item</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
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
                placeholder="Search master item or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                  style={{ color: 'var(--lb-text)' }}
                  onClick={() => setSearch('')}
                >
                  <i className="bi bi-x-circle-fill" />
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-7 d-flex justify-content-md-end gap-2 flex-wrap">
            {(['all', 'category', 'emotion', 'city', 'tag'] as const).map((t) => {
              const active = tabType === t;
              const count = t === 'all' ? items.length : items.filter((i) => i.type === t).length;
              return (
                <button
                  key={t}
                  type="button"
                  className={`btn admin-pill-btn d-inline-flex align-items-center gap-2 ${
                    active ? 'lb-btn-primary' : 'lb-btn-soft'
                  }`}
                  onClick={() => setTabType(t)}
                >
                  <span>{t === 'all' ? 'All Items' : t.charAt(0).toUpperCase() + t.slice(1)}</span>
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
                <th>Entity Type</th>
                <th>Name</th>
                <th>Slug (URL Key)</th>
                <th>Assigned Listings</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5" style={{ color: 'var(--lb-text)' }}>
                    <i className="bi bi-diagram-3 fs-1 d-block mb-2" style={{ color: 'var(--lb-primary)' }} />
                    No master items found for selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span
                        className="badge rounded-pill text-uppercase"
                        style={{
                          backgroundColor:
                            item.type === 'category'
                              ? 'var(--lb-soft)'
                              : item.type === 'emotion'
                              ? '#fef3c7'
                              : item.type === 'city'
                              ? '#e0f2fe'
                              : '#f3e8ff',
                          color:
                            item.type === 'category'
                              ? 'var(--lb-primary)'
                              : item.type === 'emotion'
                              ? '#b45309'
                              : item.type === 'city'
                              ? '#0369a1'
                              : '#7e22ce',
                          border: '1px solid var(--lb-line)',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          padding: '0.35rem 0.75rem',
                        }}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="fw-bold" style={{ color: 'var(--lb-ink)' }}>{item.name}</td>
                    <td className="small" style={{ color: 'var(--lb-text)' }}>/{item.slug}</td>
                    <td>
                      <span
                        className="badge rounded-pill"
                        style={{ backgroundColor: 'var(--lb-soft)', color: 'var(--lb-ink)', border: '1px solid var(--lb-line)' }}
                      >
                        {item.itemCount} ads
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge border-0 rounded-pill px-3 py-1 fw-bold ${
                          item.status === 'active' ? 'admin-badge-active' : 'admin-badge-inactive'
                        }`}
                        onClick={() => toggleStatus(item.id)}
                      >
                        {item.status.toUpperCase()}
                      </button>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
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
          style={{ backgroundColor: 'rgba(59, 36, 24, 0.4)', backdropFilter: 'blur(3px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content admin-card border-0 shadow-lg p-0 overflow-hidden">
              <form onSubmit={handleCreate}>
                <div
                  className="modal-header border-0 p-4 pb-2 d-flex justify-content-between align-items-center"
                  style={{ borderBottom: '1px solid var(--lb-line)' }}
                >
                  <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--lb-ink)' }}>
                    Add Master Entity
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: 'var(--lb-ink)' }}>Entity Type</label>
                    <select
                      className="form-select rounded-4 p-3"
                      style={{ border: '1px solid var(--lb-line)' }}
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
                    <label className="form-label small fw-bold" style={{ color: 'var(--lb-ink)' }}>Display Name</label>
                    <input
                      type="text"
                      className="form-control rounded-4 p-3"
                      style={{ border: '1px solid var(--lb-line)' }}
                      placeholder="e.g. Solar Energy or Gandhinagar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
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
