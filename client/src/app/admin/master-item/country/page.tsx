'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getAdminCountries,
  createAdminCountry,
  updateAdminCountry,
  deleteAdminCountry,
} from '@/lib/countryApi';
import type { AdminCountryResponse } from '@/src/types/country';

interface CountryFormValues {
  name: string;
}

export default function AdminMasterCountryPage() {
  const [countries, setCountries] = useState<AdminCountryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminCountryResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CountryFormValues>({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    loadCountries();
  }, []);

  async function loadCountries() {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminCountries();
      setCountries(data);
    } catch (err) {
      console.error('Failed to load countries:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
      setCountries([]);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setFormError(null);
    reset({ name: '' });
    setShowModal(true);
  }

  function openEditModal(country: AdminCountryResponse) {
    setEditingItem(country);
    setFormError(null);
    reset({ name: country.name });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingItem(null);
    setFormError(null);
    reset({ name: '' });
  }

  const onSubmit = async (values: CountryFormValues) => {
    try {
      setFormError(null);

      if (editingItem) {
        const updated = await updateAdminCountry(editingItem.id, { name: values.name.trim() });
        setCountries((prev) => prev.map((c) => (c.id === editingItem.id ? updated : c)));
      } else {
        const created = await createAdminCountry(values.name.trim());
        setCountries((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save country:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to save country');
    }
  };

  async function toggleStatus(country: AdminCountryResponse) {
    try {
      const updated = await updateAdminCountry(country.id, { isActive: !country.isActive });
      setCountries((prev) => prev.map((c) => (c.id === country.id ? updated : c)));
    } catch (err) {
      console.error('Failed to toggle status:', err);
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this country?')) return;
    try {
      await deleteAdminCountry(id);
      setCountries((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete country:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete country');
    }
  }

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || String(c.id).includes(search)
  );

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a' }}>Country Master</h1>
          <p className="text-muted small mb-0">Manage active geographic countries eligible for listings.</p>
        </div>
        <button
          type="button"
          className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-2"
          style={{ backgroundColor: 'var(--lb-primary)' }}
          onClick={openCreateModal}
        >
          <i className="bi bi-plus-lg" />
          <span>Add Country</span>
        </button>
      </div>

      {/* Backend Error Alert */}
      {error && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-warning fs-5" />
            <div>
              <strong>Server connection issue:</strong> {error}
            </div>
          </div>
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={loadCountries}>
            Retry
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="admin-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by country name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-7 text-md-end text-muted small">
            Showing {filtered.length} of {countries.length} countries
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden p-0 mb-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th className="ps-4" style={{ width: '100px' }}>ID</th>
                <th>Country Name</th>
                <th>Status</th>
                <th className="text-end pe-4" style={{ width: '120px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Loading countries from backend...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    <i className="bi bi-globe-americas fs-2 d-block mb-2 text-secondary" />
                    No countries found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="ps-4 fw-bold text-secondary">
                      #{c.id}
                    </td>
                    <td className="fw-semibold" style={{ color: '#0f172a' }}>
                      {c.name}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge border-0 rounded-pill px-3 py-1 fw-medium ${
                          c.isActive ? 'admin-badge-active' : 'admin-badge-inactive'
                        }`}
                        onClick={() => toggleStatus(c)}
                        title="Click to toggle status"
                      >
                        {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => openEditModal(c)}
                          title={`Edit ${c.name}`}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => handleDelete(c.id)}
                          title={`Delete ${c.name}`}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                    {editingItem ? `Edit Country (#${editingItem.id})` : 'Add New Country'}
                  </h6>
                  <button type="button" className="btn-close" onClick={closeModal} />
                </div>
                <div className="modal-body p-4">
                  {formError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {formError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      Country Name *
                    </label>
                    <input
                      type="text"
                      className={`form-control rounded-2 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="e.g. India, United States, United Arab Emirates..."
                      autoFocus
                      {...register('name', {
                        required: 'Country name is required',
                        validate: (val) => val.trim().length > 0 || 'Country name cannot be empty',
                      })}
                    />
                    {errors.name && (
                      <div className="invalid-feedback small">
                        {errors.name.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer p-3 bg-light border-top">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-2"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm text-white rounded-2 px-3"
                    style={{ backgroundColor: 'var(--lb-primary)' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : editingItem ? 'Update Country' : 'Save Country'}
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
