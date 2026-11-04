'use client';

import { useEffect, useState } from 'react';
import { getAdminUsers, deleteAdminUser } from '@/lib/userApi';
import type { AdminUserResponse } from '@/src/types/user';

export default function AdminMasterUserPage() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // View Details Modal State
  const [selectedUser, setSelectedUser] = useState<AdminUserResponse | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminUsers(1, 100);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      return;
    }

    try {
      await deleteAdminUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      if (selectedUser?._id === id) {
        setSelectedUser(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const filtered = users.filter((u) => {
    const term = search.toLowerCase();
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    return (
      fullName.includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.mobile && u.mobile.toLowerCase().includes(term)) ||
      (u.city && u.city.toLowerCase().includes(term)) ||
      (u.state && u.state.toLowerCase().includes(term)) ||
      (u.country && u.country.toLowerCase().includes(term))
    );
  });

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
            Registered Users
          </h4>
          <p className="text-muted small mb-0">
            View registered user profiles, contact info, and activity status.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between mb-4">
          <div>
            <i className="bi bi-exclamation-triangle-fill me-2" />
            <span>{error}</span>
          </div>
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={loadUsers}>
            Retry
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
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
                placeholder="Search by name, email, mobile, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-7 text-md-end text-muted small">
            Showing {filtered.length} of {users.length} registered users
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden p-0 mb-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th className="ps-4">User</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Location</th>
                <th>Status</th>
                <th className="text-end pe-4" style={{ width: '120px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Loading users from backend...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    <i className="bi bi-people fs-2 d-block mb-2 text-secondary" />
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const locationParts = [u.city, u.state, u.country].filter(Boolean);
                  const locationDisplay = locationParts.length > 0 ? locationParts.join(', ') : 'Not specified';

                  return (
                    <tr key={u._id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          {u.profileImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={u.profileImage}
                              alt={`${u.firstName} ${u.lastName}`}
                              className="rounded-circle border"
                              style={{ width: '38px', height: '38px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary fw-bold border"
                              style={{ width: '38px', height: '38px', fontSize: '0.85rem' }}
                            >
                              {u.firstName?.[0] || 'U'}
                              {u.lastName?.[0] || ''}
                            </div>
                          )}
                          <div>
                            <span className="fw-semibold d-block text-dark" style={{ fontSize: '0.9rem' }}>
                              {u.firstName} {u.lastName}
                            </span>
                            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                              Joined {new Date(u.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="small text-secondary">{u.email}</td>
                      <td className="small text-secondary">{u.mobile || '—'}</td>
                      <td className="small text-muted">{locationDisplay}</td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-1 fw-medium ${
                            u.isActive ? 'admin-badge-active' : 'admin-badge-inactive'
                          }`}
                        >
                          {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-inline-flex align-items-center gap-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary rounded-pill px-2 py-1"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => setSelectedUser(u)}
                            title="View details"
                          >
                            <i className="bi bi-eye" />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => handleDelete(u._id, `${u.firstName} ${u.lastName}`)}
                            title="Delete user"
                          >
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                  User Details
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                  {selectedUser.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedUser.profileImage}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="rounded-circle border"
                      style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center text-primary fw-bold border fs-4"
                      style={{ width: '64px', height: '64px' }}
                    >
                      {selectedUser.firstName?.[0] || 'U'}
                      {selectedUser.lastName?.[0] || ''}
                    </div>
                  )}
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#0f172a' }}>
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h6>
                    <span
                      className={`badge rounded-pill px-2.5 py-0.5 small ${
                        selectedUser.isActive ? 'admin-badge-active' : 'admin-badge-inactive'
                      }`}
                    >
                      {selectedUser.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold d-block">Email</label>
                    <span className="small text-dark fw-medium">{selectedUser.email}</span>
                  </div>
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold d-block">Mobile</label>
                    <span className="small text-dark fw-medium">{selectedUser.mobile || '—'}</span>
                  </div>
                  <div className="col-sm-4">
                    <label className="text-muted small fw-semibold d-block">Country</label>
                    <span className="small text-dark fw-medium">{selectedUser.country || '—'}</span>
                  </div>
                  <div className="col-sm-4">
                    <label className="text-muted small fw-semibold d-block">State</label>
                    <span className="small text-dark fw-medium">{selectedUser.state || '—'}</span>
                  </div>
                  <div className="col-sm-4">
                    <label className="text-muted small fw-semibold d-block">City</label>
                    <span className="small text-dark fw-medium">{selectedUser.city || '—'}</span>
                  </div>
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold d-block">Created At</label>
                    <span className="small text-dark fw-medium">
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="col-sm-6">
                    <label className="text-muted small fw-semibold d-block">Last Updated</label>
                    <span className="small text-dark fw-medium">
                      {new Date(selectedUser.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="modal-footer p-3 bg-light border-top">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-2"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
