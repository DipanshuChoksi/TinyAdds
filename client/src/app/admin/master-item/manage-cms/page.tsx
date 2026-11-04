'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
import {
  getAdminCms,
  createAdminCms,
  updateAdminCms,
  deleteAdminCms,
} from '@/lib/cmsApi';
import type { AdminCmsResponse } from '@/src/types/cms';

// Dynamically import RichTextEditor to avoid SSR issues with TinyMCE
const RichTextEditor = dynamic(
  () => import('@/components/client-admin/RichTextEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 text-center border rounded bg-light text-muted small">
        <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
        Loading editor...
      </div>
    ),
  }
);

interface CmsFormValues {
  title: string;
  slug: string;
  content: string;
  image: string;
}

export default function AdminMasterManageCmsPage() {
  const [items, setItems] = useState<AdminCmsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminCmsResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CmsFormValues>({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      image: '',
    },
  });

  const currentImage = watch('image');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminCms();
      setItems(data);
    } catch (err) {
      console.error('Failed to load CMS pages:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setEditingItem(null);
    setFormError(null);
    setFileError(null);
    reset({
      title: '',
      slug: '',
      content: '',
      image: '',
    });
    setShowModal(true);
  };

  const openEditModal = (item: AdminCmsResponse) => {
    setEditingItem(item);
    setFormError(null);
    setFileError(null);
    reset({
      title: item.title,
      slug: item.slug,
      content: item.content || '',
      image: item.image || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormError(null);
    setFileError(null);
    reset({
      title: '',
      slug: '',
      content: '',
      image: '',
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, SVG, WebP, etc.)');
      return;
    }

    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError('Image size exceeds 2MB. Please select a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setValue('image', reader.result, { shouldValidate: true });
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: CmsFormValues) => {
    try {
      setFormError(null);

      if (editingItem) {
        const updated = await updateAdminCms(editingItem._id, {
          title: values.title.trim(),
          slug: values.slug.trim() || undefined,
          content: values.content,
          image: values.image,
        });
        setItems((prev) => prev.map((item) => (item._id === editingItem._id ? updated : item)));
      } else {
        const created = await createAdminCms({
          title: values.title.trim(),
          slug: values.slug.trim() || undefined,
          content: values.content,
          image: values.image,
          isActive: true,
        });
        setItems((prev) => [created, ...prev]);
      }

      closeModal();
    } catch (err) {
      console.error('Failed to save CMS page:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to save CMS page');
    }
  };

  const handleToggleStatus = async (item: AdminCmsResponse) => {
    const nextStatus = !item.isActive;
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i._id === item._id ? { ...i, isActive: nextStatus } : i))
    );

    try {
      await updateAdminCms(item._id, { isActive: nextStatus });
    } catch (err) {
      console.error('Failed to toggle status:', err);
      // Revert on error
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, isActive: item.isActive } : i))
      );
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async (item: AdminCmsResponse) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    const prevItems = items;
    setItems((prev) => prev.filter((i) => i._id !== item._id));

    try {
      await deleteAdminCms(item._id);
    } catch (err) {
      console.error('Failed to delete CMS page:', err);
      setItems(prevItems);
      alert(err instanceof Error ? err.message : 'Failed to delete CMS page');
    }
  };

  const filtered = items.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(term) ||
      item.slug.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading CMS pages...</span>
        </div>
        <p className="text-muted small">Fetching CMS pages from backend...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a' }}>Manage CMS</h1>
          <p className="text-muted small mb-0">Manage static CMS pages, policies, terms, and custom portal content.</p>
        </div>
        <button
          type="button"
          className="btn text-white d-flex align-items-center gap-2 px-3 py-2 rounded-2"
          style={{ backgroundColor: 'var(--lb-primary)' }}
          onClick={openCreateModal}
        >
          <i className="bi bi-plus-lg" />
          <span>Add New CMS Page</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between mb-4">
          <div>
            <i className="bi bi-exclamation-triangle-fill me-2" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            onClick={loadData}
          >
            Retry
          </button>
        </div>
      )}

      {/* Table Card */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="card-header bg-white border-bottom p-3">
          <div className="row g-3 align-items-center justify-content-between">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <i className="bi bi-search" />
                </span>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search by title or slug..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-auto text-muted small">
              Total: <strong>{filtered.length}</strong> pages
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted text-uppercase">
                <th className="ps-4">Title</th>
                <th>Image</th>
                <th>Slug</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <i className="bi bi-file-earmark-richtext fs-2 d-block mb-2 text-secondary" />
                    No CMS pages found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id}>
                    <td className="ps-4 fw-semibold" style={{ color: '#0f172a' }}>
                      {item.title}
                    </td>
                    <td>
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: '36px',
                            height: '36px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                      ) : (
                        <span className="text-muted small">-</span>
                      )}
                    </td>
                    <td>
                      <code className="small text-secondary">/{item.slug}</code>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge border-0 rounded-pill px-3 py-1 fw-medium ${
                          item.isActive ? 'admin-badge-active' : 'admin-badge-inactive'
                        }`}
                        onClick={() => handleToggleStatus(item)}
                      >
                        {item.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => openEditModal(item)}
                          title={`Edit ${item.title}`}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => handleDelete(item)}
                          title={`Delete ${item.title}`}
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                    {editingItem ? `Edit CMS Page: ${editingItem.title}` : 'Add New CMS Page'}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  />
                </div>
                <div className="modal-body p-4">
                  {formError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {formError}
                    </div>
                  )}

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-muted">
                        Page Title *
                      </label>
                      <input
                        type="text"
                        className={`form-control rounded-2 ${errors.title ? 'is-invalid' : ''}`}
                        placeholder="e.g. Terms of Service, Privacy Policy..."
                        {...register('title', {
                          required: 'Page title is required',
                          maxLength: { value: 200, message: 'Max 200 characters' },
                        })}
                        autoFocus
                      />
                      {errors.title && (
                        <div className="invalid-feedback small">{errors.title.message}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold text-muted">
                        Slug (URL identifier)
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-2"
                        placeholder="e.g. terms-of-service (leave empty to auto-generate)"
                        {...register('slug')}
                      />
                      <div className="form-text small" style={{ fontSize: '0.75rem' }}>
                        Leave blank to generate automatically from the title.
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      Featured / Header Banner Image
                    </label>

                    <input
                      type="file"
                      className="form-control rounded-2 mb-2"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    {fileError && (
                      <div className="text-danger small mb-2" style={{ fontSize: '0.78rem' }}>
                        <i className="bi bi-exclamation-circle me-1" />
                        {fileError}
                      </div>
                    )}

                    {currentImage ? (
                      <div className="d-flex align-items-center gap-2 p-2 border rounded-2 bg-light">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentImage}
                          alt="Banner preview"
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                        <div className="flex-grow-1 overflow-hidden">
                          <span className="small text-truncate d-block text-muted" style={{ fontSize: '0.75rem' }}>
                            {currentImage.startsWith('data:') ? 'Base64 image attached' : currentImage}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger p-0"
                          onClick={() => setValue('image', '', { shouldValidate: true })}
                          title="Remove image"
                        >
                          <i className="bi bi-x-circle-fill fs-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="form-text small" style={{ fontSize: '0.75rem' }}>
                        Upload an image (PNG, JPG, SVG, WebP, max 2MB).
                      </div>
                    )}
                  </div>

                  {/* TinyMCE Rich Text Editor */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted d-block">
                      Page Content
                    </label>
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Compose rich CMS page content here..."
                        />
                      )}
                    />
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
                    {isSubmitting
                      ? 'Saving...'
                      : editingItem
                      ? 'Update CMS Page'
                      : 'Save CMS Page'}
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
