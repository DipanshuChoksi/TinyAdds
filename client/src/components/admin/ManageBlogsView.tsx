'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { BlogSummary } from '@/src/types';

interface ManageBlogsViewProps {
  initialBlogs: BlogSummary[];
}

export default function ManageBlogsView({ initialBlogs }: ManageBlogsViewProps) {
  const [blogs, setBlogs] = useState<BlogSummary[]>(initialBlogs);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Guide');

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.tag.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogs((prev) => prev.filter((b) => b.slug !== slug));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newEntry: BlogSummary = {
      slug: newSlug || `blog-${Date.now()}`,
      title: newTitle,
      tag: newTag,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: '/assets/img/blog/v1/01.jpg',
    };

    setBlogs([newEntry, ...blogs]);
    setNewTitle('');
    setShowCreateModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="lb-badge mb-2">
            Editorial Management
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--lb-ink)' }}>
            Manage Blogs
          </h1>
          <p className="small mb-0" style={{ color: 'var(--lb-text)' }}>
            Publish educational content, contractor tips, and local business spotlights.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn lb-btn-primary d-inline-flex align-items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-lg" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-card mb-4 p-3">
        <div className="position-relative">
          <i
            className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3"
            style={{ color: 'var(--lb-text)' }}
          />
          <input
            type="text"
            className="form-control admin-search-input ps-5"
            placeholder="Search blogs by title or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
              style={{ color: 'var(--lb-text)' }}
              onClick={() => setSearch('')}
            >
              <i className="bi bi-x-circle-fill" />
            </button>
          )}
        </div>
      </div>

      {/* Blogs Table */}
      <div className="admin-card overflow-hidden p-0 mb-4">
        <div className="table-responsive">
          <table className="table admin-table align-middle">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Cover</th>
                <th>Article Title</th>
                <th>Tag</th>
                <th>Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5" style={{ color: 'var(--lb-text)' }}>
                    <i className="bi bi-journal-x fs-1 d-block mb-2" style={{ color: 'var(--lb-primary)' }} />
                    No articles found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((blog) => (
                  <tr key={blog.slug}>
                    <td>
                      <div
                        className="position-relative rounded-3 overflow-hidden"
                        style={{ width: 64, height: 46, backgroundColor: 'var(--lb-soft)', border: '1px solid var(--lb-line)' }}
                      >
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-fit-cover"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold" style={{ color: 'var(--lb-ink)' }}>{blog.title}</div>
                      <small style={{ color: 'var(--lb-text)' }}>slug: /{blog.slug}</small>
                    </td>
                    <td>
                      <span
                        className="badge rounded-pill"
                        style={{ backgroundColor: 'var(--lb-soft)', color: 'var(--lb-primary)', border: '1px solid var(--lb-line)' }}
                      >
                        {blog.tag}
                      </span>
                    </td>
                    <td className="small" style={{ color: 'var(--lb-text)' }}>{blog.date}</td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <a
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn lb-btn-soft admin-pill-btn py-1 px-3"
                          style={{ fontSize: '0.8rem' }}
                        >
                          <i className="bi bi-box-arrow-up-right me-1" /> View
                        </a>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => handleDelete(blog.slug)}
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

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(59, 36, 24, 0.4)', backdropFilter: 'blur(3px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content admin-card border-0 shadow-lg p-0 overflow-hidden">
              <form onSubmit={handleCreate}>
                <div
                  className="modal-header border-0 p-4 pb-2 d-flex justify-content-between align-items-center"
                  style={{ borderBottom: '1px solid var(--lb-line)' }}
                >
                  <h5 className="modal-title fw-bold mb-0" style={{ color: 'var(--lb-ink)' }}>
                    Create Blog Post
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  />
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: 'var(--lb-ink)' }}>Title</label>
                    <input
                      type="text"
                      className="form-control rounded-4 p-3"
                      style={{ border: '1px solid var(--lb-line)' }}
                      placeholder="e.g. 5 Tips to Choose the Right Contractor"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold" style={{ color: 'var(--lb-ink)' }}>Category Tag</label>
                    <select
                      className="form-select rounded-4 p-3"
                      style={{ border: '1px solid var(--lb-line)' }}
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                    >
                      <option value="Guide">Guide</option>
                      <option value="Business">Business</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Spotlight">Spotlight</option>
                    </select>
                  </div>
                </div>
                <div
                  className="modal-footer border-0 p-3 px-4 d-flex justify-content-end gap-2"
                  style={{ backgroundColor: 'var(--lb-soft)' }}
                >
                  <button
                    type="button"
                    className="btn lb-btn-soft admin-pill-btn"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn lb-btn-primary admin-pill-btn">
                    Save Article
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
