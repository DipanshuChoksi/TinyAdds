'use client';

import { useEffect, useState } from 'react';
import MasterItemView from '@/components/admin/MasterItemView';
import {
  getAdminSearchCategories,
  createAdminSearchCategory,
  updateAdminSearchCategory,
  deleteAdminSearchCategory,
} from '@/lib/searchCategoryApi';
import type { AdminMasterItem } from '@/src/types';
import type { AdminSearchCategoryResponse } from '@/src/types/searchCategory';

function mapToMasterItem(sc: AdminSearchCategoryResponse): AdminMasterItem {
  return {
    id: sc._id,
    type: 'search-category',
    name: sc.name,
    status: sc.isActive ? 'active' : 'inactive',
    itemCount: 0,
  };
}

export default function AdminMasterSearchCategoriesPage() {
  const [items, setItems] = useState<AdminMasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setError(null);
        const data = await getAdminSearchCategories();
        if (isMounted) {
          setItems(data.map(mapToMasterItem));
        }
      } catch (err) {
        console.error('Failed to load search categories from backend:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to connect to backend');
          setItems([]);
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

  const handleCreate = async (name: string): Promise<AdminMasterItem> => {
    const created = await createAdminSearchCategory(name);
    return mapToMasterItem(created);
  };

  const handleUpdate = async (
    id: string,
    data: { name: string }
  ): Promise<AdminMasterItem> => {
    const updated = await updateAdminSearchCategory(id, { name: data.name });
    return mapToMasterItem(updated);
  };

  const handleToggleStatus = async (id: string, newStatus: 'active' | 'inactive'): Promise<void> => {
    await updateAdminSearchCategory(id, { isActive: newStatus === 'active' });
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteAdminSearchCategory(id);
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading search categories...</span>
        </div>
        <p className="text-muted small">Fetching search categories from backend...</p>
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

      <MasterItemView
        key={items.length}
        initialMasterItems={items}
        defaultCategory="search-category"
        onCreateItem={handleCreate}
        onUpdateItem={handleUpdate}
        onToggleStatus={handleToggleStatus}
        onDeleteItem={handleDelete}
      />
    </div>
  );
}
