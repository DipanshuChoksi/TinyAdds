'use client';

import { useState } from 'react';
import type { AdminMasterItem, MasterEntityType } from '@/src/types';

export interface MasterCategoryMeta {
  label: string;
  singular: string;
  description: string;
  placeholder: string;
  icon?: string;
}

export const MASTER_CATEGORY_META: Record<MasterEntityType, MasterCategoryMeta> = {
  category: {
    label: 'Categories',
    singular: 'Category',
    description: 'Manage listing industries and categories across the platform.',
    placeholder: 'e.g. Automotive, Healthcare, Education...',
    icon: 'bi-grid',
  },
  group: {
    label: 'Groups',
    singular: 'Group',
    description: 'Manage search groups and high-level groupings for postings and listings.',
    placeholder: 'e.g. Property, Vehicles, Jobs, Services...',
    icon: 'bi-collection',
  },
  'search-category': {
    label: 'Search Categories',
    singular: 'Search Category',
    description: 'Manage specific search intentions and category actions across the platform.',
    placeholder: 'e.g. Buy, Sell, Rent, Auction, Finance...',
    icon: 'bi-search',
  },
  'banner-section': {
    label: 'Banner Sections',
    singular: 'Banner Section',
    description: 'Manage advertising banner placement zones across the platform.',
    placeholder: 'e.g. Home Top Banner, Sidebar Banner...',
    icon: 'bi-layout-text-window-reverse',
  },
  emotion: {
    label: 'Emotions',
    singular: 'Emotion',
    description: 'Manage emotional vibe and theme tags assigned to ads and listings.',
    placeholder: 'e.g. Happy, Exciting, Corporate, Surprise...',
    icon: 'bi-emoji-smile',
  },
  'manage-cms': {
    label: 'Manage CMS',
    singular: 'CMS Page',
    description: 'Manage static CMS pages, policies, terms, and custom portal content.',
    placeholder: 'e.g. Terms of Service, Privacy Policy...',
    icon: 'bi-file-earmark-richtext',
  },
  'manage-marquee': {
    label: 'Manage Marquee',
    singular: 'Marquee Notice',
    description: 'Manage ticker notices, announcements, and scrolling banner alerts.',
    placeholder: 'e.g. Diwali Offer 20% Off on Pro Plans...',
    icon: 'bi-broadcast',
  },
  'tax-master': {
    label: 'TaxMaster',
    singular: 'Tax Rate',
    description: 'Configure GST slabs, service taxes, and invoice tax rates.',
    placeholder: 'e.g. GST 18%, GST 5%, Exemption 0%...',
    icon: 'bi-receipt',
  },
  'success-stories': {
    label: 'Success Stories',
    singular: 'Success Story',
    description: 'Manage featured client reviews, case studies, and business success stories.',
    placeholder: 'e.g. Shree Sai Motors 300% Growth Story...',
    icon: 'bi-trophy',
  },
  user: {
    label: 'User',
    singular: 'User Account',
    description: 'Manage registered user classifications, vendor profiles, and portal accounts.',
    placeholder: 'e.g. Kishan Dave, Neha Joshi...',
    icon: 'bi-people',
  },
  country: {
    label: 'Country',
    singular: 'Country',
    description: 'Manage active geographic countries eligible for listings and services.',
    placeholder: 'e.g. India, United Arab Emirates, United States...',
    icon: 'bi-globe-americas',
  },
  state: {
    label: 'State',
    singular: 'State',
    description: 'Manage state and province subdivisions for locations.',
    placeholder: 'e.g. Gujarat, Maharashtra, Rajasthan...',
    icon: 'bi-map',
  },
  city: {
    label: 'City',
    singular: 'City',
    description: 'Manage operational cities and districts for local listings.',
    placeholder: 'e.g. Vadodara, Ahmedabad, Surat...',
    icon: 'bi-buildings',
  },
  tag: {
    label: 'Special Tags',
    singular: 'Tag',
    description: 'Manage special badges, vendor tags, and promotional highlights.',
    placeholder: 'e.g. Verified Vendor, Emergency 24x7...',
    icon: 'bi-tags',
  },
};

interface MasterItemViewProps {
  initialMasterItems: AdminMasterItem[];
  defaultCategory: MasterEntityType;
  pageTitle?: string;
  pageDescription?: string;
  onCreateItem?: (name: string, image?: string) => Promise<AdminMasterItem>;
  onUpdateItem?: (id: string, data: { name: string; image?: string }) => Promise<AdminMasterItem>;
  onToggleStatus?: (id: string, newStatus: 'active' | 'inactive') => Promise<void>;
  onDeleteItem?: (id: string) => Promise<void>;
}

export default function MasterItemView({
  initialMasterItems,
  defaultCategory,
  pageTitle,
  pageDescription,
  onCreateItem,
  onUpdateItem,
  onToggleStatus,
  onDeleteItem,
}: MasterItemViewProps) {
  const [items, setItems] = useState<AdminMasterItem[]>(initialMasterItems);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminMasterItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);

  const meta = MASTER_CATEGORY_META[defaultCategory] || MASTER_CATEGORY_META.category;
  const title = pageTitle ?? meta.label;
  const description = pageDescription ?? meta.description;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, SVG, WebP, etc.)');
      return;
    }

    // Validate size limit (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError('Image size exceeds 2MB. Please choose a smaller image.');
      return;
    }

    // Read and encode to Base64 Data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setImage('');
    setError(null);
    setFileError(null);
    setShowModal(true);
  };

  const openEditModal = (item: AdminMasterItem) => {
    setEditingItem(item);
    setName(item.name);
    setImage(item.image || '');
    setError(null);
    setFileError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setName('');
    setImage('');
    setError(null);
    setFileError(null);
  };

  const filtered = items.filter((item) => {
    const matchesCategory = item.type === defaultCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.slug ? item.slug.toLowerCase().includes(search.toLowerCase()) : false);
    return matchesCategory && matchesSearch;
  });

  const toggleStatus = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const nextStatus = item.status === 'active' ? 'inactive' : 'active';

    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: nextStatus } : i))
    );

    if (onToggleStatus) {
      try {
        await onToggleStatus(id, nextStatus);
      } catch (err: unknown) {
        console.error('Failed to toggle status:', err);
        // Revert on error
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: item.status } : i))
        );
        alert(err instanceof Error ? err.message : 'Failed to update status');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setIsSubmitting(true);

    try {
      if (editingItem) {
        // Handle Update
        if (onUpdateItem) {
          const updated = await onUpdateItem(editingItem.id, {
            name: name.trim(),
            image: image.trim(),
          });
          setItems((prev) =>
            prev.map((i) => (i.id === editingItem.id ? updated : i))
          );
        } else {
          setItems((prev) =>
            prev.map((i) =>
              i.id === editingItem.id
                ? { ...i, name: name.trim(), image: image.trim() }
                : i
            )
          );
        }
      } else {
        // Handle Create
        if (onCreateItem) {
          const created = await onCreateItem(name.trim(), image.trim());
          setItems((prev) => [...prev, created]);
        } else {
          const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

          const newItem: AdminMasterItem = {
            id: `mi-${Date.now()}`,
            name: name.trim(),
            slug,
            type: defaultCategory,
            status: 'active',
            itemCount: 0,
            image: image.trim(),
          };
          setItems((prev) => [...prev, newItem]);
        }
      }

      closeModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${meta.singular.toLowerCase()}?`)) return;

    const prevItems = items;
    setItems((prev) => prev.filter((i) => i.id !== id));

    if (onDeleteItem) {
      try {
        await onDeleteItem(id);
      } catch (err: unknown) {
        console.error('Failed to delete item:', err);
        setItems(prevItems);
        alert(err instanceof Error ? err.message : 'Failed to delete item');
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="h4 fw-bold mb-0" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
              {title}
            </h1>
          </div>
          <p className="small mb-0" style={{ color: '#64748b' }}>
            {description}
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-sm d-inline-flex align-items-center gap-2 py-1 px-3 text-white fw-medium rounded-pill shadow-sm"
            style={{ backgroundColor: 'var(--lb-primary)', fontSize: '0.82rem' }}
            onClick={openCreateModal}
          >
            <i className="bi bi-plus-lg" />
            <span>Add {meta.singular}</span>
          </button>
        </div>
      </div>

      {/* Search & Counter Card */}
      <div className="admin-card mb-4 p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="position-relative">
              <i
                className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: '#94a3b8' }}
              />
              <input
                type="text"
                className="form-control admin-search-input ps-5"
                placeholder={`Search ${meta.label.toLowerCase()} or slug...`}
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
          <div className="col-12 col-md-6 col-lg-7 d-flex justify-content-md-end align-items-center gap-2">
            <span
              className="badge rounded-pill fw-semibold"
              style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
            >
              {filtered.length} {filtered.length === 1 ? meta.singular : meta.label}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden p-0 mb-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th className="ps-4">Name</th>
                {defaultCategory === 'emotion' && <th>Image</th>}
                {defaultCategory !== 'emotion' && <th>Slug (URL Key)</th>}
                {defaultCategory !== 'emotion' && <th>Assigned Items</th>}
                <th>Status</th>
                <th className="text-end pe-4" style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={defaultCategory === 'emotion' ? 4 : 5} className="text-center py-5 text-muted">
                    <i className="bi bi-diagram-3 fs-2 d-block mb-2 text-secondary" />
                    No {meta.label.toLowerCase()} found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4 fw-semibold" style={{ color: '#0f172a' }}>
                      {item.name}
                    </td>
                    {defaultCategory === 'emotion' && (
                      <td>
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '32px',
                              height: '32px',
                              objectFit: 'contain',
                              borderRadius: '4px',
                              backgroundColor: '#fff',
                              border: '1px solid #e2e8f0',
                            }}
                          />
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>
                    )}
                    {defaultCategory !== 'emotion' && (
                      <td className="small" style={{ color: '#64748b' }}>
                        {item.slug ? `/${item.slug}` : '-'}
                      </td>
                    )}
                    {defaultCategory !== 'emotion' && (
                      <td>
                        <span
                          className="badge rounded-pill fw-normal"
                          style={{ backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}
                        >
                          {item.itemCount} records
                        </span>
                      </td>
                    )}
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
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => openEditModal(item)}
                          title={`Edit ${item.name}`}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => handleDelete(item.id)}
                          title={`Delete ${item.name}`}
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
              <form onSubmit={handleSubmit}>
                <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                    {editingItem ? `Edit ${meta.singular}` : `Add New ${meta.singular}`}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  />
                </div>
                <div className="modal-body p-4">
                  {error && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {error}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      {meta.singular} Name / Title *
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-2"
                      placeholder={meta.placeholder}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  {defaultCategory === 'emotion' && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">
                        Emotion Image / Icon
                      </label>

                      {/* File upload input */}
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

                      {/* Preview / Current Image */}
                      {image ? (
                        <div className="d-flex align-items-center gap-2 p-2 border rounded-2 bg-light">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt="Emotion preview"
                            style={{
                              width: '42px',
                              height: '42px',
                              objectFit: 'contain',
                              borderRadius: '4px',
                              backgroundColor: '#fff',
                              border: '1px solid #e2e8f0',
                            }}
                          />
                          <div className="flex-grow-1 overflow-hidden">
                            <span className="small text-truncate d-block text-muted" style={{ fontSize: '0.75rem' }}>
                              {image.startsWith('data:') ? 'Encoded Base64 Image' : image}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-danger p-0"
                            onClick={() => setImage('')}
                            title="Remove image"
                          >
                            <i className="bi bi-x-circle-fill fs-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="form-text small" style={{ fontSize: '0.75rem' }}>
                          Upload an image file (PNG, JPG, SVG, WebP, max 2MB). It will be encoded as Base64 and stored in the emotion image field.
                        </div>
                      )}
                    </div>
                  )}
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
                      ? `Update ${meta.singular}`
                      : `Save ${meta.singular}`}
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
