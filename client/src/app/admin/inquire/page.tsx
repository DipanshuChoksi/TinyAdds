'use client';

import { useEffect, useState, useCallback } from 'react';
import InquireView from '@/components/admin/InquireView';
import { getAdminContacts, updateAdminContact, deleteAdminContact } from '@/lib/contactApi';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminContacts({ limit: 100 });
      setInquiries(res.items.map(mapContactToAdminInquiry));
    } catch (err: unknown) {
      console.error('Failed to load inquiries:', err);
      setError(
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to load inquiries from server.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    try {
      await updateAdminContact(id, { status: newStatus });
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err: unknown) {
      alert(
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to update inquiry status'
      );
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await deleteAdminContact(id);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      alert(
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Failed to delete inquiry'
      );
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading inquiries...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center justify-content-between p-4 my-4" role="alert">
        <div>
          <h5 className="alert-heading mb-1">Failed to load inquiries</h5>
          <p className="mb-0">{error}</p>
        </div>
        <button className="btn btn-outline-danger" onClick={loadData}>
          <i className="bi bi-arrow-clockwise me-1" /> Retry
        </button>
      </div>
    );
  }

  return (
    <InquireView
      initialInquiries={inquiries}
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
    />
  );
}
