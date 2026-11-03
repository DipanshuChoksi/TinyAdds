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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
            Master Items
          </h1>
          <p className="small mb-0" style={{ color: '#64748b' }}>
            Define system master entities including industries, emotional vibe tags, locations, and special badges.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-sm d-inline-flex align-items-center gap-2 py-1 px-3 text-white fw-medium rounded-pill shadow-sm"
            style={{ backgroundColor: 'var(--lb-primary)', fontSize: '0.82rem' }}
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
                style={{ color: '#94a3b8' }}
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
                  style={{ color: '#94a3b8' }}
                  onClick={() => setSearch('')}
                >
                  <i className="bi bi-x-circle-fill" />
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-7 d-flex justify-content-md-end gap-1 flex-wrap">
            {(['all', 'category', 'emotion', 'city', 'tag'] as const).map((t) => {
              const active = tabType === t;
              const count = t === 'all' ? items.length : items.filter((i) => i.type === t).length;
              return (
                <button
                  key={t}
                  type="button"
                  className={`btn btn-sm rounded-pill d-inline-flex align-items-center gap-2 px-3 py-1 ${
                    active ? 'btn-dark' : 'btn-light border'
                  }`}
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => setTabType(t)}
                >
                  <span>{t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}</span>
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
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden p-0 mb-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th className="ps-4">Entity Type</th>
                <th>Name</th>
                <th>Slug (URL Key)</th>
                <th>Assigned Listings</th>
                <th>Status</th>
                <th className="text-end pe-4" style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    <i className="bi bi-diagram-3 fs-2 d-block mb-2 text-secondary" />
                    No master items found for selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <span
                        className="badge rounded-pill text-uppercase"
                        style={{
                          backgroundColor:
                            item.type === 'category'
                              ? '#f1f5f9'
                              : item.type === 'emotion'
                              ? '#fef9c3'
                              : item.type === 'city'
                              ? '#f0f9ff'
                              : '#f5f3ff',
                          color:
                            item.type === 'category'
                              ? '#475569'
                              : item.type === 'emotion'
                              ? '#854d0e'
                              : item.type === 'city'
                              ? '#0369a1'
                              : '#6d28d9',
                          border: '1px solid #e2e8f0',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.55rem',
                        }}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="fw-semibold" style={{ color: '#0f172a' }}>{item.name}</td>
                    <td className="small" style={{ color: '#64748b' }}>/{item.slug}</td>
                    <td>
                      <span
                        className="badge rounded-pill fw-normal"
                        style={{ backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}
                      >
                        {item.itemCount} ads
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge border-0 rounded-pill px-3 py-1 fw-medium ${
                          item.status === 'active' ? 'admin-badge-active' : 'admin-badge-inactive'
                        }`}
                        onClick={() => toggleStatus(item.id)}
                      >
                        {item.status.toUpperCase()}
                      </button>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        style={{ fontSize: '0.75rem' }}
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
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <form onSubmit={handleCreate}>
                <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                    Add Master Entity
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Entity Type</label>
                    <select
                      className="form-select rounded-2"
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
                      className="form-control rounded-2"
                      placeholder="e.g. Solar Energy or Gandhinagar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
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
