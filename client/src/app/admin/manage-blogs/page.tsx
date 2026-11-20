'use client';

import { useEffect, useState, useCallback } from 'react';
import ManageBlogsView from '@/components/admin/ManageBlogsView';
import { getAdminBlogs } from '@/lib/blogApi';
import type { AdminBlogResponse } from '@/src/types/blog';

export default function AdminManageBlogsPage() {
  const [blogs, setBlogs] = useState<AdminBlogResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(
    async (targetPage = page, targetSearch = searchQuery) => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAdminBlogs(targetPage, 10, targetSearch);
        setBlogs(res.items);
        if (res.meta) {
          setPage(res.meta.page);
          setTotalPages(res.meta.totalPages);
          setTotal(res.meta.total);
        }
      } catch (err) {
        console.error('Failed to load blogs from backend:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to backend');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    },
    [page, searchQuery]
  );

  useEffect(() => {
    loadData(page, searchQuery);
  }, [page, searchQuery, loadData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.trim());
    setPage(1);
  };

  if (loading && blogs.length === 0) {
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
            onClick={() => loadData(page)}
          >
            Retry
          </button>
        </div>
      )}
      <ManageBlogsView
        initialBlogs={blogs}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
        onRefresh={() => loadData(page)}
        onSearch={handleSearch}
      />
    </div>
  );
}
