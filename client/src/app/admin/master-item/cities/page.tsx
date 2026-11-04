'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getAdminCities,
  createAdminCity,
  updateAdminCity,
  deleteAdminCity,
} from '@/lib/cityApi';
import { getAdminStates } from '@/lib/stateApi';
import { getAdminCountries } from '@/lib/countryApi';
import type { AdminCityResponse } from '@/src/types/city';
import type { AdminStateResponse } from '@/src/types/state';
import type { AdminCountryResponse } from '@/src/types/country';

interface CityFormValues {
  name: string;
  countryId: number | '';
  stateId: number | '';
}

export default function AdminMasterCitiesPage() {
  const [cities, setCities] = useState<AdminCityResponse[]>([]);
  const [states, setStates] = useState<AdminStateResponse[]>([]);
  const [countries, setCountries] = useState<AdminCountryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Table filters
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminCityResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CityFormValues>({
    defaultValues: {
      name: '',
      countryId: '',
      stateId: '',
    },
  });

  const watchedCountryId = watch('countryId');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [citiesData, statesData, countriesData] = await Promise.all([
        getAdminCities(),
        getAdminStates(),
        getAdminCountries(),
      ]);
      setCities(citiesData);
      setStates(statesData);
      setCountries(countriesData);
    } catch (err) {
      console.error('Failed to load cities data:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
      setCities([]);
    } finally {
      setLoading(false);
    }
  }

  function getCountryName(cId: number) {
    const c = countries.find((country) => country.id === cId);
    return c ? c.name : `Country #${cId}`;
  }

  function getStateName(sId: number) {
    const s = states.find((state) => state.id === sId);
    return s ? s.name : `State #${sId}`;
  }

  // Filter available states in form modal based on watched country
  const formAvailableStates = states.filter((s) =>
    watchedCountryId !== '' ? s.countryId === Number(watchedCountryId) : false
  );

  function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCountryId = e.target.value ? Number(e.target.value) : '';
    setValue('countryId', newCountryId, { shouldValidate: true });

    if (newCountryId !== '') {
      const validStates = states.filter((s) => s.countryId === newCountryId);
      setValue(
        'stateId',
        validStates.length > 0 && validStates[0] ? validStates[0].id : '',
        { shouldValidate: true }
      );
    } else {
      setValue('stateId', '', { shouldValidate: true });
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setFormError(null);

    const initialCountry = countries.length > 0 && countries[0] ? countries[0].id : '';
    let initialState: number | '' = '';
    if (initialCountry !== '') {
      const validStates = states.filter((s) => s.countryId === initialCountry);
      initialState = validStates.length > 0 && validStates[0] ? validStates[0].id : '';
    }

    reset({
      name: '',
      countryId: initialCountry,
      stateId: initialState,
    });

    setShowModal(true);
  }

  function openEditModal(city: AdminCityResponse) {
    setEditingItem(city);
    setFormError(null);
    reset({
      name: city.name,
      countryId: city.countryId,
      stateId: city.stateId,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingItem(null);
    setFormError(null);
    reset({
      name: '',
      countryId: '',
      stateId: '',
    });
  }

  const onSubmit = async (values: CityFormValues) => {
    try {
      setFormError(null);
      const cId = Number(values.countryId);
      const sId = Number(values.stateId);

      if (editingItem) {
        const updated = await updateAdminCity(editingItem.id, {
          name: values.name.trim(),
          countryId: cId,
          stateId: sId,
        });
        setCities((prev) => prev.map((c) => (c.id === editingItem.id ? updated : c)));
      } else {
        const created = await createAdminCity(values.name.trim(), cId, sId);
        setCities((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save city:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to save city');
    }
  };

  async function toggleStatus(city: AdminCityResponse) {
    try {
      const updated = await updateAdminCity(city.id, { isActive: !city.isActive });
      setCities((prev) => prev.map((c) => (c.id === city.id ? updated : c)));
    } catch (err) {
      console.error('Failed to toggle status:', err);
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this city?')) return;
    try {
      await deleteAdminCity(id);
      setCities((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete city:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete city');
    }
  }

  // Filter list of states in table header according to selected country filter
  const tableFilterStates = states.filter((s) =>
    selectedCountryFilter === 'all' ? true : s.countryId === Number(selectedCountryFilter)
  );

  const filtered = cities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      String(c.id).includes(search) ||
      getStateName(c.stateId).toLowerCase().includes(search.toLowerCase()) ||
      getCountryName(c.countryId).toLowerCase().includes(search.toLowerCase());

    const matchesCountry =
      selectedCountryFilter === 'all' || c.countryId === Number(selectedCountryFilter);

    const matchesState =
      selectedStateFilter === 'all' || c.stateId === Number(selectedStateFilter);

    return matchesSearch && matchesCountry && matchesState;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a' }}>City Master</h1>
          <p className="text-muted small mb-0">Manage operational cities linked to states and countries.</p>
        </div>
        <button
          type="button"
          className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-2"
          style={{ backgroundColor: 'var(--lb-primary)' }}
          onClick={openCreateModal}
          disabled={states.length === 0}
        >
          <i className="bi bi-plus-lg" />
          <span>Add City</span>
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
          <div className="col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search city, ID, state, or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select form-select-sm"
              value={selectedCountryFilter}
              onChange={(e) => {
                setSelectedCountryFilter(e.target.value);
                setSelectedStateFilter('all');
              }}
            >
              <option value="all">All Countries</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (#{c.id})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select form-select-sm"
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
            >
              <option value="all">All States</option>
              {tableFilterStates.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (#{s.id})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 text-md-end text-muted small">
            {filtered.length} of {cities.length}
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
                <th>City Name</th>
                <th>State</th>
                <th>Country</th>
                <th>Status</th>
                <th className="text-end pe-4" style={{ width: '120px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Loading cities from backend...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    <i className="bi bi-buildings fs-2 d-block mb-2 text-secondary" />
                    No cities found.
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
                      <span className="badge rounded-pill bg-light text-dark border">
                        {getStateName(c.stateId)}
                      </span>
                    </td>
                    <td>
                      <span className="badge rounded-pill bg-light text-secondary border">
                        {getCountryName(c.countryId)}
                      </span>
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
                    {editingItem ? `Edit City (#${editingItem.id})` : 'Add New City'}
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
                      value={watchedCountryId}
                      onChange={handleCountryChange}
                    >
                      <option value="" disabled>Select Country</option>
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
                      Parent State *
                    </label>
                    <select
                      className={`form-select rounded-2 ${errors.stateId ? 'is-invalid' : ''}`}
                      disabled={formAvailableStates.length === 0}
                      {...register('stateId', {
                        required: 'Parent state is required',
                        validate: (val) => val !== '' || 'Please select a parent state',
                      })}
                    >
                      <option value="" disabled>
                        {watchedCountryId === ''
                          ? 'Select a country first'
                          : formAvailableStates.length === 0
                          ? 'No states found in this country'
                          : 'Select State'}
                      </option>
                      {formAvailableStates.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (#{s.id})
                        </option>
                      ))}
                    </select>
                    {errors.stateId && (
                      <div className="invalid-feedback small">
                        {errors.stateId.message}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      City Name *
                    </label>
                    <input
                      type="text"
                      className={`form-control rounded-2 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="e.g. Vadodara, Mumbai, San Francisco..."
                      autoFocus
                      {...register('name', {
                        required: 'City name is required',
                        validate: (val) => val.trim().length > 0 || 'City name cannot be empty',
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
                    disabled={isSubmitting || formAvailableStates.length === 0}
                  >
                    {isSubmitting ? 'Saving...' : editingItem ? 'Update City' : 'Save City'}
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
