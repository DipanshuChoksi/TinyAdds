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
  emotion: {
    label: 'Emotions',
    singular: 'Emotion',
    description: 'Manage emotional vibe and theme tags assigned to ads and listings.',
    placeholder: 'e.g. Happy, Exciting, Corporate, Surprise...',
    icon: 'bi-emoji-smile',
  },
  employee: {
    label: 'Employee',
    singular: 'Employee',
    description: 'Manage internal staff, operations managers, and admin employees.',
    placeholder: 'e.g. Rajesh Sharma, Priya Patel...',
    icon: 'bi-person-badge',
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
  area: {
    label: 'Area',
    singular: 'Area',
    description: 'Manage sub-localities, pincode clusters, and delivery zones.',
    placeholder: 'e.g. Alkapuri, Gotri Road, Adajan...',
    icon: 'bi-geo-alt',
  },
  'inquire-contact-us': {
    label: 'Inquire Contact Us',
    singular: 'Contact Inquire Channel',
    description: 'Manage contact inquiry departments, routing subjects, and support channels.',
    placeholder: 'e.g. General Inquiries, Portal Technical Support...',
    icon: 'bi-envelope-at',
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
}

export default function MasterItemView({
  initialMasterItems,
  defaultCategory,
  pageTitle,
  pageDescription,
}: MasterItemViewProps) {
  const [items, setItems] = useState<AdminMasterItem[]>(initialMasterItems);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');

  const meta = MASTER_CATEGORY_META[defaultCategory] || MASTER_CATEGORY_META.category;
  const title = pageTitle ?? meta.label;
  const description = pageDescription ?? meta.description;

  const filtered = items.filter((item) => {
    const matchesCategory = item.type === defaultCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
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
      type: defaultCategory,
      status: 'active',
      itemCount: 0,
    };

    setItems([...items, newItem]);
    setName('');
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Delete this ${meta.singular.toLowerCase()}?`)) {
      setItems((prev) => prev.filter((i) => i.id !== id));
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
            onClick={() => setShowModal(true)}
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
                <th>Slug (URL Key)</th>
                <th>Assigned Items</th>
                <th>Status</th>
                <th className="text-end pe-4" style={{ width: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
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
                    <td className="small" style={{ color: '#64748b' }}>/{item.slug}</td>
                    <td>
                      <span
                        className="badge rounded-pill fw-normal"
                        style={{ backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}
                      >
                        {item.itemCount} records
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
                        title={`Delete ${item.name}`}
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
                    Add New {meta.singular}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">
                      {meta.singular} Name / Title
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
                    Save {meta.singular}
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
