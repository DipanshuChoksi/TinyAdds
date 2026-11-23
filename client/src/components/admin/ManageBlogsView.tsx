'use client';

import { useEffect, useState, useRef } from 'react';
import type { AdminBlogResponse } from '@/src/types/blog';
import Pagination from '@/components/ui/Pagination';
import BundledEditor from '@/components/BundledEditor';
import { useConfirm, useToast } from '@/components/ui/UiProvider';
import {
  createAdminBlog,
  updateAdminBlog,
  deleteAdminBlog,
} from '@/lib/blogApi';

interface ManageBlogsViewProps {
  initialBlogs: AdminBlogResponse[];
  page?: number;
  totalPages?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
}

const BASE_URL = (process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000') + "/";


export default function ManageBlogsView({
  initialBlogs,
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  onRefresh,
  onSearch,
}: ManageBlogsViewProps) {
  const confirm = useConfirm();
  const toast = useToast();
  const [blogs, setBlogs] = useState<AdminBlogResponse[]>(initialBlogs);
  const [search, setSearch] = useState('');

  // Keep blogs state in sync when initialBlogs changes (e.g. on page change)
  useEffect(() => {
    setBlogs(initialBlogs);
  }, [initialBlogs]);
  useEffect(() => {
    const timer = window.setTimeout(() => onSearch?.(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [onSearch, search]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<AdminBlogResponse | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenCreateModal = () => {
    setEditingBlog(null);
    setTitle('');
    setContent('');
    setBannerImage('');
    setIsActive(true);
    setFileError(null);
    setActionError(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (blog: AdminBlogResponse) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content || '');
    setBannerImage(blog.bannerImage || '');
    setIsActive(blog.isActive);
    setFileError(null);
    setActionError(null);
    setShowModal(true);
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
      setFileError('Image size exceeds 2MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBannerImage(reader.result);
      }
    };
    reader.onerror = () => {
      setFileError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleToggleStatus = async (blog: AdminBlogResponse) => {
    try {
      setActionError(null);
      const newStatus = !blog.isActive;
      const updated = await updateAdminBlog(blog._id, { isActive: newStatus });
      setBlogs((prev) => prev.map((b) => (b._id === blog._id ? updated : b)));
      toast.success(`Blog ${newStatus ? 'published' : 'unpublished'} successfully.`);
    } catch (err: unknown) {
      console.error('Failed to toggle status:', err);
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setActionError(message);
      toast.error(message);
    }
  };

  const handleDelete = async (blog: AdminBlogResponse) => {
    const confirmed = await confirm({
      title: 'Delete blog post?',
      message: `"${blog.title}" will be permanently deleted.`,
      icon: 'bi-trash3-fill',
      variant: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
    if (!confirmed) return;

    try {
      setActionError(null);
      await deleteAdminBlog(blog._id);
      setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
      onRefresh?.();
      toast.success('Blog post deleted successfully.');
    } catch (err: unknown) {
      console.error('Failed to delete blog:', err);
      const message = err instanceof Error ? err.message : 'Failed to delete blog post';
      setActionError(message);
      toast.error(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      setActionError(null);

      if (editingBlog) {
        const updated = await updateAdminBlog(editingBlog._id, {
          title: title.trim(),
          content: content.trim(),
          bannerImage: bannerImage.trim(),
          isActive,
        });
        setBlogs((prev) => prev.map((b) => (b._id === editingBlog._id ? updated : b)));
      } else {
        const created = await createAdminBlog({
          title: title.trim(),
          content: content.trim(),
          bannerImage: bannerImage.trim(),
          isActive,
        });
        setBlogs([created, ...blogs]);
      }

      setShowModal(false);
      onRefresh?.();
      toast.success(`Blog post ${editingBlog ? 'updated' : 'created'} successfully.`);
    } catch (err: unknown) {
      console.error('Failed to save blog:', err);
      const message = err instanceof Error ? err.message : 'Failed to save blog post';
      setActionError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h1 className="h4 fw-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>
            Manage Blogs
          </h1>
          <p className="small mb-0" style={{ color: '#64748b' }}>
            Publish educational content, contractor tips, and local business spotlights.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-sm d-inline-flex align-items-center gap-2 py-1 px-3 text-white fw-medium rounded-pill shadow-sm"
            style={{ backgroundColor: 'var(--lb-primary)', fontSize: '0.82rem' }}
            onClick={handleOpenCreateModal}
          >
            <i className="bi bi-plus-lg" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {actionError && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {actionError}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setActionError(null)}
          />
        </div>
      )}

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
                placeholder="Search blogs by title or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                  style={{ color: '#94a3b8' }}
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x-circle-fill" />
                </button>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-7 d-flex justify-content-md-end align-items-center">
            <span
              className="badge rounded-pill fw-semibold"
              style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
            >
              {total} {total === 1 ? 'Article' : 'Articles'}
            </span>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="admin-card overflow-hidden p-0 mb-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th className="ps-4" style={{ width: 80 }}>Banner</th>
                <th>Article Title</th>
                <th>Status</th>
                <th>Created Date</th>
                <th className="text-end pe-4" style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <i className="bi bi-journal-x fs-2 d-block mb-2 text-secondary" />
                    No articles found.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="ps-4">
                      <div
                        className="position-relative rounded-2 overflow-hidden d-flex align-items-center justify-content-center"
                        style={{ width: 56, height: 40, backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}
                      >
                        {blog.bannerImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={blog.bannerImage.startsWith("data:") ? blog.bannerImage :  BASE_URL + blog.bannerImage}
                            alt={blog.title}
                            className="w-100 h-100 object-fit-cover"
                          />
                        ) : (
                          <i className="bi bi-image text-muted" style={{ fontSize: '1.2rem' }} />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-truncate" style={{ color: '#0f172a', maxWidth: 350 }}>
                        {blog.title}
                      </div>
                      {/* <small style={{ color: '#64748b', fontSize: '0.74rem' }}>ID: {blog._id}</small> */}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(blog)}
                        className={`badge rounded-pill border-0 px-2.5 py-1 ${blog.isActive
                            ? 'bg-success-subtle text-success'
                            : 'bg-secondary-subtle text-secondary'
                          }`}
                        style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                        title="Click to toggle status"
                      >
                        <i className={`bi ${blog.isActive ? 'bi-check-circle-fill' : 'bi-dash-circle'} me-1`} />
                        {blog.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="small" style={{ color: '#64748b' }}>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center justify-content-end gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                          style={{ width: 34, height: 34 }}
                          onClick={() => handleOpenEditModal(blog)}
                          title="Edit article"
                          aria-label={`Edit ${blog.title}`}
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                          style={{ width: 34, height: 34 }}
                          onClick={() => handleDelete(blog)}
                          title="Delete article"
                          aria-label={`Delete ${blog.title}`}
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

        {/* Pagination */}
        {totalPages > 1 && onPageChange && (
          <div className="p-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
            <span className="small text-muted">
              Page {page} of {totalPages} {total > 0 && `(${total} total articles)`}
            </span>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              ariaLabel="Blog posts pagination"
            />
          </div>
        )}
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
              <form onSubmit={handleSubmit}>
                <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                    {editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="modal-body p-4">
                  {actionError && (
                    <div className="alert alert-danger small mb-3">
                      {actionError}
                    </div>
                  )}

                  {/* Title */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Title *</label>
                    <input
                      type="text"
                      className="form-control rounded-2"
                      placeholder="e.g. 5 Tips to Choose the Right Contractor"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      maxLength={300}
                    />
                  </div>

                  {/* Banner Image Upload & URL */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Banner Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    {!bannerImage ? (
                      <input
                        type="file"
                        className="form-control rounded-2 mb-2"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    ) : null}

                    {fileError && (
                      <div className="text-danger small mb-2" style={{ fontSize: '0.78rem' }}>
                        <i className="bi bi-exclamation-circle me-1" />
                        {fileError}
                      </div>
                    )}

                    <input
                      type="text"
                      className="form-control rounded-2"
                      placeholder="Or enter banner image URL (e.g. /assets/img/blog/...)"
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                    />

                    {bannerImage && (
                      <div className="mt-2 p-2 border rounded-2 bg-light d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={bannerImage.startsWith('data:') ? bannerImage : BASE_URL + bannerImage}
                            alt="Banner preview"
                            style={{
                              width: '90px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0',
                            }}
                          />
                          <span className="small text-muted text-truncate" style={{ maxWidth: 200 }}>
                            {bannerImage.startsWith('data:') ? 'Custom uploaded image' : bannerImage}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <i className="bi bi-arrow-repeat me-1" /> Update image
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setBannerImage('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            Remove image
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Content</label>
                    <BundledEditor
                      value={content}
                      onEditorChange={(newContent: string) => setContent(newContent)}
                      init={{
                        height: 350,
                        menubar: false,
                        branding: false,
                        promotion: false,
                        placeholder: "Write blog article content here...",
                        plugins: "lists link table code insertdatetime wordcount",
                        toolbar:
                          "undo redo | blocks | bold italic underline | bullist numlist | alignleft aligncenter alignright | link table | removeformat code",
                      }}
                    />
                  </div>

                  {/* Active status */}
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="blogActiveSwitch"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <label className="form-check-label small text-muted" htmlFor="blogActiveSwitch">
                      Active
                    </label>
                  </div>
                </div>

                <div className="modal-footer p-3 bg-light border-top">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-2"
                    onClick={() => setShowModal(false)}
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
                    {isSubmitting ? 'Saving...' : editingBlog ? 'Update Article' : 'Save Article'}
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
