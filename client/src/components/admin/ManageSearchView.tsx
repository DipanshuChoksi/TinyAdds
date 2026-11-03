'use client';

import { useState } from 'react';
import type { AdminSearchTerm } from '@/src/types';

interface ManageSearchViewProps {
  initialSearchTerms: AdminSearchTerm[];
}

export default function ManageSearchView({ initialSearchTerms }: ManageSearchViewProps) {
  const [terms, setTerms] = useState<AdminSearchTerm[]>(initialSearchTerms);
  const [filterCity, setFilterCity] = useState('all');
  const [query, setQuery] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newCategory, setNewCategory] = useState('Support');
  const [newCity, setNewCity] = useState('Vadodara');
  const [showAddModal, setShowAddModal] = useState(false);

  const cities = ['all', ...Array.from(new Set(terms.map((t) => t.city)))];

  const filtered = terms.filter((item) => {
    const matchesCity = filterCity === 'all' || item.city === filterCity;
    const matchesQuery =
      item.term.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    return matchesCity && matchesQuery;
  });

  const handleAddTracked = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;

    const newEntry: AdminSearchTerm = {
      id: `st-${Date.now()}`,
      term: newKeyword.trim(),
      category: newCategory,
      city: newCity,
      count: 10,
      lastSearched: 'Just now',
      trend: 'up',
    };

    setTerms([newEntry, ...terms]);
    setNewKeyword('');
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setTerms((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
            Manage Search
          </h1>
          <p className="small mb-0" style={{ color: '#64748b' }}>
            Track user search trends, query volume, geographical intent, and configure promoted search terms.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-sm d-inline-flex align-items-center gap-2 py-1 px-3 text-white fw-medium rounded-pill shadow-sm"
            style={{ backgroundColor: 'var(--lb-primary)', fontSize: '0.82rem' }}
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg" />
            <span>Add Tracked Search</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-card mb-4 p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="position-relative">
              <i
                className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: '#94a3b8' }}
              />
              <input
                type="text"
                className="form-control admin-search-input ps-5"
                placeholder="Search queries or categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2 align-items-center flex-wrap">
            <label className="small fw-semibold me-1" style={{ color: '#64748b', fontSize: '0.8rem' }}>
              Filter by City:
            </label>
            <select
              className="form-select form-select-sm w-auto rounded-pill px-3 py-1"
              style={{ border: '1px solid #e2e8f0', color: '#1e293b', backgroundColor: '#ffffff', fontWeight: 500, fontSize: '0.82rem' }}
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Cities' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Terms Table */}
      <div className="admin-card overflow-hidden p-0 mb-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th className="ps-4">Search Keyword / Query</th>
                <th>Target Category</th>
                <th>City</th>
                <th>Volume (30d)</th>
                <th>Trend</th>
                <th>Last Query</th>
                <th className="text-end pe-4" style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    <i className="bi bi-search fs-2 d-block mb-2 text-secondary" />
                    No search terms found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2 fw-semibold" style={{ color: '#0f172a' }}>
                        <i className="bi bi-search" style={{ color: '#94a3b8', fontSize: '0.8rem' }} />
                        <span>{item.term}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge rounded-pill fw-normal"
                        style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="small" style={{ color: '#64748b' }}>{item.city}</td>
                    <td>
                      <span className="fw-semibold" style={{ color: '#0f172a' }}>{item.count.toLocaleString()}</span>
                    </td>
                    <td>
                      {item.trend === 'up' && (
                        <span className="admin-badge-approved d-inline-flex align-items-center gap-1">
                          <i className="bi bi-graph-up-arrow" /> Trending
                        </span>
                      )}
                      {item.trend === 'down' && (
                        <span className="admin-badge-rejected d-inline-flex align-items-center gap-1">
                          <i className="bi bi-graph-down-arrow" /> Declining
                        </span>
                      )}
                      {item.trend === 'stable' && (
                        <span className="badge rounded-pill bg-light text-secondary border d-inline-flex align-items-center gap-1">
                          <i className="bi bi-dash" /> Steady
                        </span>
                      )}
                    </td>
                    <td className="small" style={{ color: '#64748b' }}>{item.lastSearched}</td>
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

      {/* Add Tracked Keyword Modal */}
      {showAddModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <form onSubmit={handleAddTracked}>
                <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                    Add Search Keyword to Monitor
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  />
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Keyword or Phrase</label>
                    <input
                      type="text"
                      className="form-control rounded-2"
                      placeholder="e.g. CCTV camera installation"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Category</label>
                    <input
                      type="text"
                      className="form-control rounded-2"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">City</label>
                    <input
                      type="text"
                      className="form-control rounded-2"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer p-3 bg-light border-top">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-2"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm text-white rounded-2 px-3"
                    style={{ backgroundColor: 'var(--lb-primary)' }}
                  >
                    Add Keyword
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
