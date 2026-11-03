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
          <span
            className="badge rounded-pill text-uppercase fw-semibold mb-2"
            style={{ backgroundColor: 'var(--ta-primary-light)', color: 'var(--ta-primary)' }}
          >
            Editorial Management
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--ta-secondary)' }}>
            Manage Blogs
          </h1>
          <p className="text-muted small mb-0">
            Publish educational content, contractor tips, and local business spotlights.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary rounded-3 px-3 py-2"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-lg me-1" /> New Article
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-3 bg-white">
        <div className="input-group">
          <span className="input-group-text bg-light border-0">
            <i className="bi bi-search text-muted" />
          </span>
          <input
            type="text"
            className="form-control bg-light border-0"
            placeholder="Search blogs by title or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3 small text-muted fw-semibold" style={{ width: 80 }}>
                  Cover
                </th>
                <th className="py-3 small text-muted fw-semibold">Article Title</th>
                <th className="py-3 small text-muted fw-semibold">Tag</th>
                <th className="py-3 small text-muted fw-semibold">Date</th>
                <th className="px-4 py-3 small text-muted fw-semibold text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    No articles found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((blog) => (
                  <tr key={blog.slug}>
                    <td className="px-4">
                      <div
                        className="position-relative rounded-3 overflow-hidden"
                        style={{ width: 64, height: 44, backgroundColor: '#f0f0f0' }}
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
                      <div className="fw-semibold text-dark">{blog.title}</div>
                      <small className="text-muted">slug: /{blog.slug}</small>
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border">{blog.tag}</span>
                    </td>
                    <td className="small text-muted">{blog.date}</td>
                    <td className="px-4 text-end">
                      <div className="btn-group btn-group-sm">
                        <a
                          href={`/blogs/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-secondary"
                        >
                          <i className="bi bi-box-arrow-up-right me-1" /> View
                        </a>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
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
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <form onSubmit={handleCreate}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold" style={{ color: 'var(--ta-secondary)' }}>
                    Create Blog Post
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  />
                </div>
                <div className="modal-body py-3">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Title</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. 5 Tips to Choose the Right Contractor"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Category Tag</label>
                    <select
                      className="form-select rounded-3"
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
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-3"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-3">
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
