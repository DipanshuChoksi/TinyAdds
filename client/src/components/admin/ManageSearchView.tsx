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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span
            className="badge rounded-pill text-uppercase fw-semibold mb-2"
            style={{ backgroundColor: 'var(--ta-primary-light)', color: 'var(--ta-primary)' }}
          >
            Search Analytics & Synonyms
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--ta-secondary)' }}>
            Manage Search
          </h1>
          <p className="text-muted small mb-0">
            Track user search trends, query volume, geographical intent, and configure promoted search terms.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary rounded-3 px-3 py-2"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg me-1" /> Add Tracked Search
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-3 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search queries or categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2 flex-wrap">
            <label className="small text-muted align-self-center me-1">City Filter:</label>
            <select
              className="form-select form-select-sm w-auto rounded-3"
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
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3 small text-muted fw-semibold">Search Keyword / Query</th>
                <th className="py-3 small text-muted fw-semibold">Target Category</th>
                <th className="py-3 small text-muted fw-semibold">City</th>
                <th className="py-3 small text-muted fw-semibold">Volume (30d)</th>
                <th className="py-3 small text-muted fw-semibold">Trend</th>
                <th className="py-3 small text-muted fw-semibold">Last Query</th>
                <th className="px-4 py-3 small text-muted fw-semibold text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">
                    No search terms found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 fw-semibold text-dark">
                      <i className="bi bi-search text-muted me-2 small" />
                      {item.term}
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">{item.category}</span>
                    </td>
                    <td className="small">{item.city}</td>
                    <td>
                      <span className="fw-bold">{item.count.toLocaleString()}</span>
                    </td>
                    <td>
                      {item.trend === 'up' && (
                        <span className="badge bg-success-subtle text-success">
                          <i className="bi bi-graph-up-arrow me-1" /> Trending
                        </span>
                      )}
                      {item.trend === 'down' && (
                        <span className="badge bg-danger-subtle text-danger">
                          <i className="bi bi-graph-down-arrow me-1" /> Declining
                        </span>
                      )}
                      {item.trend === 'stable' && (
                        <span className="badge bg-secondary-subtle text-secondary">
                          <i className="bi bi-dash me-1" /> Steady
                        </span>
                      )}
                    </td>
                    <td className="small text-muted">{item.lastSearched}</td>
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

      {/* Add Tracked Keyword Modal */}
      {showAddModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <form onSubmit={handleAddTracked}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold" style={{ color: 'var(--ta-secondary)' }}>
                    Add Search Keyword to Monitor
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  />
                </div>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Keyword or Phrase</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
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
                      className="form-control rounded-3"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">City</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-3"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-3">
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
