'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getAdminStates,
  createAdminState,
  updateAdminState,
  deleteAdminState,
} from '@/lib/stateApi';
import { getAdminCountries } from '@/lib/countryApi';
import type { AdminStateResponse } from '@/src/types/state';
import type { AdminCountryResponse } from '@/src/types/country';

interface StateFormValues {
  name: string;
  countryId: number | '';
}

export default function AdminMasterStatePage() {
  const [states, setStates] = useState<AdminStateResponse[]>([]);
  const [countries, setCountries] = useState<AdminCountryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminStateResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StateFormValues>({
    defaultValues: {
      name: '',
      countryId: '',
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [statesData, countriesData] = await Promise.all([
        getAdminStates(),
        getAdminCountries(),
      ]);
      setStates(statesData);
      setCountries(countriesData);
    } catch (err) {
      console.error('Failed to load states data:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
      setStates([]);
    } finally {
      setLoading(false);
    }
  }

  function getCountryName(cId: number) {
    const c = countries.find((country) => country.id === cId);
    return c ? c.name : `Country #${cId}`;
  }

  function openCreateModal() {
    setEditingItem(null);
    setFormError(null);
    const defaultCountry = countries.length > 0 && countries[0] ? countries[0].id : '';
    reset({ name: '', countryId: defaultCountry });
    setShowModal(true);
  }

  function openEditModal(state: AdminStateResponse) {
    setEditingItem(state);
    setFormError(null);
    reset({ name: state.name, countryId: state.countryId });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingItem(null);
    setFormError(null);
    reset({ name: '', countryId: '' });
  }

  const onSubmit = async (values: StateFormValues) => {
    try {
      setFormError(null);
      const cId = Number(values.countryId);

      if (editingItem) {
        const updated = await updateAdminState(editingItem.id, {
          name: values.name.trim(),
          countryId: cId,
        });
        setStates((prev) => prev.map((s) => (s.id === editingItem.id ? updated : s)));
      } else {
        const created = await createAdminState(values.name.trim(), cId);
        setStates((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save state:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to save state');
    }
  };

  async function toggleStatus(state: AdminStateResponse) {
    try {
      const updated = await updateAdminState(state.id, { isActive: !state.isActive });
      setStates((prev) => prev.map((s) => (s.id === state.id ? updated : s)));
    } catch (err) {
      console.error('Failed to toggle status:', err);
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this state?')) return;
    try {
      await deleteAdminState(id);
      setStates((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete state:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete state');
    }
  }

  const filtered = states.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      String(s.id).includes(search) ||
      getCountryName(s.countryId).toLowerCase().includes(search.toLowerCase());

    const matchesCountry =
      selectedCountryFilter === 'all' || s.countryId === Number(selectedCountryFilter);

    return matchesSearch && matchesCountry;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a' }}>State Master</h1>
          <p className="text-muted small mb-0">Manage states & provinces linked to parent countries.</p>
        </div>
        <button
          type="button"
          className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-2"
          style={{ backgroundColor: 'var(--lb-primary)' }}
          onClick={openCreateModal}
          disabled={countries.length === 0}
        >
          <i className="bi bi-plus-lg" />
          <span>Add State</span>
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
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={loadData}>
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
                placeholder="Search state name, ID, or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select form-select-sm"
              value={selectedCountryFilter}
              onChange={(e) => setSelectedCountryFilter(e.target.value)}
            >
              <option value="all">All Countries</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (#{c.id})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 text-md-end text-muted small">
            Showing {filtered.length} of {states.length} states
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden p-0 mb-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th className="ps-4" style={{ width: '90px' }}>ID</th>
                <th>State Name</th>
                <th>Country</th>
                <th>Status</th>
                <th className="text-end pe-4" style={{ width: '120px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Loading states from backend...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <i className="bi bi-map fs-2 d-block mb-2 text-secondary" />
                    No states found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="ps-4 fw-bold text-secondary">
                      #{s.id}
                    </td>
                    <td className="fw-semibold" style={{ color: '#0f172a' }}>
                      {s.name}
                    </td>
                    <td>
                      <span className="badge rounded-pill bg-light text-dark border">
                        {getCountryName(s.countryId)}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge border-0 rounded-pill px-3 py-1 fw-medium ${
                          s.isActive ? 'admin-badge-active' : 'admin-badge-inactive'
                        }`}
                        onClick={() => toggleStatus(s)}
                        title="Click to toggle status"
                      >
                        {s.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => openEditModal(s)}
                          title={`Edit ${s.name}`}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => handleDelete(s.id)}
                          title={`Delete ${s.name}`}
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
                    {editingItem ? `Edit State (#${editingItem.id})` : 'Add New State'}
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
                      Parent Country *
                    </label>
                    <select
                      className={`form-select rounded-2 ${errors.countryId ? 'is-invalid' : ''}`}
                      {...register('countryId', {
                        required: 'Parent country is required',
                        validate: (val) => val !== '' || 'Please select a parent country',
                      })}
                    >
                      <option value="" disabled>Select a country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} (#{c.id})
                        </option>
                      ))}
                    </select>
                    {errors.countryId && (
                      <div className="invalid-feedback small">
                        {errors.countryId.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      State Name *
                    </label>
                    <input
                      type="text"
                      className={`form-control rounded-2 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="e.g. Gujarat, California, Maharashtra..."
                      autoFocus
                      {...register('name', {
                        required: 'State name is required',
                        validate: (val) => val.trim().length > 0 || 'State name cannot be empty',
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
                    {isSubmitting ? 'Saving...' : editingItem ? 'Update State' : 'Save State'}
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
