'use client';

import { useEffect, useState } from 'react';
import ManageBlogsView from '@/components/admin/ManageBlogsView';
import { getAdminBlogs } from '@/lib/blogApi';
import type { AdminBlogResponse } from '@/src/types/blog';

export default function AdminManageBlogsPage() {
  const [blogs, setBlogs] = useState<AdminBlogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setError(null);
        const data = await getAdminBlogs();
        if (isMounted) {
          setBlogs(data);
        }
      } catch (err) {
        console.error('Failed to load blogs from backend:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to connect to backend');
          setBlogs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading blogs...</span>
        </div>
        <p className="text-muted small">Fetching blogs from backend...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-warning d-flex align-items-center justify-content-between mb-4">
          <div>
            <i className="bi bi-exclamation-triangle-fill me-2" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      <ManageBlogsView initialBlogs={blogs} />
    </div>
  );
}
