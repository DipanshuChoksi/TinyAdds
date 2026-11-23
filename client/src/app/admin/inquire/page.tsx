'use client';

import { useEffect, useState, useCallback } from 'react';
import InquireView from '@/components/admin/InquireView';
import { getAdminContacts } from '@/lib/contactApi';
import type { AdminContactResponse } from '@/src/types/contact';
import type { AdminInquiry } from '@/src/types';

function mapContactToAdminInquiry(contact: AdminContactResponse): AdminInquiry {
  return {
    id: contact._id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone || '',
    subject: contact.subject || '',
    message: contact.message,
    date: contact.createdAt ? new Date(contact.createdAt).toISOString().split('T')[0] : '',
    status: contact.status || 'pending',
  };
}

export default function AdminInquirePage() {
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async (targetPage = page, targetSearch = searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminContacts({
        page: targetPage,
        limit: 10,
        search: targetSearch,
      });
      setInquiries(res.items.map(mapContactToAdminInquiry));
      if (res.pagination) {
        setPage(res.pagination.page);
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      }
    } catch (err: unknown) {
      console.error('Failed to load inquiries:', err);
      setError(
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to load inquiries from server.'
      );
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    loadData(page, searchQuery);
  }, [page, searchQuery, loadData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query.trim());
    setPage(1);
  }, []);

  if (loading && !hasLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading inquiries...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between p-4 my-4" role="alert">
          <div>
            <h5 className="alert-heading mb-1">Failed to load inquiries</h5>
            <p className="mb-0">{error}</p>
          </div>
          <button className="btn btn-outline-danger" onClick={() => loadData(page)}>
            <i className="bi bi-arrow-clockwise me-1" /> Retry
          </button>
        </div>
      )}
      <InquireView
        initialInquiries={inquiries}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
      />
    </div>
  );
}
