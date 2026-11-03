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
            style={{ color: '#94a3b8' }}
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
              style={{ color: '#94a3b8' }}
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
                <th className="ps-4" style={{ width: 80 }}>Cover</th>
                <th>Article Title</th>
                <th>Tag</th>
                <th>Date</th>
                <th className="text-end pe-4" style={{ width: '130px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <i className="bi bi-journal-x fs-2 d-block mb-2 text-secondary" />
                    No articles found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((blog) => (
                  <tr key={blog.slug}>
                    <td className="ps-4">
                      <div
                        className="position-relative rounded-2 overflow-hidden"
                        style={{ width: 56, height: 40, backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}
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
                      <div className="fw-semibold" style={{ color: '#0f172a' }}>{blog.title}</div>
                      <small style={{ color: '#64748b', fontSize: '0.74rem' }}>slug: /{blog.slug}</small>
                    </td>
                    <td>
                      <span
                        className="badge rounded-pill fw-normal"
                        style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                      >
                        {blog.tag}
                      </span>
                    </td>
                    <td className="small" style={{ color: '#64748b' }}>{blog.date}</td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center justify-content-end gap-1">
                        <a
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-secondary rounded-2 py-1 px-2"
                          style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                        >
                          <i className="bi bi-box-arrow-up-right me-1" /> View
                        </a>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-2 py-1 px-2"
                          style={{ fontSize: '0.75rem' }}
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
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <form onSubmit={handleCreate}>
                <div className="modal-header p-3 px-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h6 className="modal-title fw-bold mb-0" style={{ color: '#0f172a' }}>
                    Create Blog Post
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  />
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Title</label>
                    <input
                      type="text"
                      className="form-control rounded-2"
                      placeholder="e.g. 5 Tips to Choose the Right Contractor"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Category Tag</label>
                    <select
                      className="form-select rounded-2"
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
                <div className="modal-footer p-3 bg-light border-top">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-2"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm text-white rounded-2 px-3"
                    style={{ backgroundColor: 'var(--lb-primary)' }}
                  >
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
