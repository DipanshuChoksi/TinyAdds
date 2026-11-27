'use client';

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { getAdminUsers, deleteAdminUser, updateAdminUserStatus, createAdminUser } from '@/lib/userApi';
import type { AdminUserResponse } from '@/src/types/user';
import Pagination from '@/components/ui/Pagination';
import { useConfirm, useToast } from '@/components/ui/UiProvider';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  password: '',
};

export default function AdminMasterAdminUsersPage() {
  const confirm = useConfirm();
  const toast = useToast();
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Create Admin Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadUsers = useCallback(async (targetPage = page, searchTerm = search) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminUsers(targetPage, 10, searchTerm, 'admin');
      setUsers(res.items);
      if (res.meta) {
        setPage(res.meta.page);
        setTotalPages(res.meta.totalPages);
        setTotal(res.meta.total);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadUsers(page, search);
  }, [page, search, loadUsers]);

  const handleToggleStatus = async (user: AdminUserResponse) => {
    try {
      const updated = await updateAdminUserStatus(user._id, !user.isActive);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isActive: updated.isActive } : u)));
      toast.success(`Admin user ${updated.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: 'Delete admin user?',
      message: `"${name}" will be permanently deleted.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!confirmed) return;

    try {
      await deleteAdminUser(id);
      toast.success('Admin user deleted');
      await loadUsers(page, search);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete admin user');
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createAdminUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        password: form.password,
      });
      toast.success('Admin user created');
      setShowCreateModal(false);
      setForm(initialForm);
      await loadUsers(1, search);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create admin user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h4 className="mb-1 fw-bold">Admin Users</h4>
          <p className="text-muted small mb-0">Manage administrator accounts ({total} total)</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setForm(initialForm);
            setShowCreateModal(true);
          }}
        >
          <i className="bi bi-plus-lg me-2" />
          Add Admin User
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, email, or mobile..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm me-2" role="status" />
                    Loading admin users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No admin users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const fullName = `${user.firstName} ${user.lastName}`.trim();
                  return (
                    <tr key={user._id}>
                      <td className="fw-medium">{fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={user.isActive}
                            onChange={() => handleToggleStatus(user)}
                            aria-label={`Toggle status for ${fullName}`}
                          />
                          <span className={`badge ms-2 ${user.isActive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="text-muted small">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(user._id, fullName)}
                          title="Delete admin user"
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="card-footer bg-white border-top-0 py-3">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Admin User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                />
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        maxLength={80}
                        value={form.firstName}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        maxLength={80}
                        value={form.lastName}
                        onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        maxLength={254}
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Mobile</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        maxLength={20}
                        value={form.mobile}
                        onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium">Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          required
                          minLength={8}
                          maxLength={128}
                          value={form.password}
                          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                        </button>
                      </div>
                      <div className="form-text">Minimum 8 characters.</div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowCreateModal(false)}
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={creating}>
                    {creating ? 'Creating...' : 'Create Admin'}
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
