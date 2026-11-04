'use client';

import { useEffect, useState } from 'react';
import ManagePackageView from '@/components/admin/ManagePackageView';
import {
  getAdminPackages,
  createAdminPackage,
  updateAdminPackage,
  deleteAdminPackage,
} from '@/lib/packageApi';
import type { AdminPackageResponse, CreatePackagePayload, UpdatePackagePayload } from '@/src/types/package';

export default function AdminManagePackagePage() {
  const [packages, setPackages] = useState<AdminPackageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setError(null);
        const data = await getAdminPackages();
        if (isMounted) {
          setPackages(data);
        }
      } catch (err) {
        console.error('Failed to load packages from backend:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to connect to backend');
          setPackages([]);
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

  const handleCreate = async (data: CreatePackagePayload): Promise<AdminPackageResponse> => {
    return await createAdminPackage(data);
  };

  const handleUpdate = async (
    id: string,
    data: UpdatePackagePayload
  ): Promise<AdminPackageResponse> => {
    return await updateAdminPackage(id, data);
  };

  const handleToggleStatus = async (id: string, isActive: boolean): Promise<void> => {
    await updateAdminPackage(id, { isActive });
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteAdminPackage(id);
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading packages...</span>
        </div>
        <p className="text-muted small">Fetching packages from backend...</p>
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

      <ManagePackageView
        key={packages.length}
        initialPackages={packages}
        onCreatePackage={handleCreate}
        onUpdatePackage={handleUpdate}
        onToggleStatus={handleToggleStatus}
        onDeletePackage={handleDelete}
      />
    </div>
  );
}
