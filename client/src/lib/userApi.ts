import http from './http';
import type { AdminUserResponse } from '@/src/types/user';

/**
 * Fetch users for admin panel with pagination and optional search
 */
export async function getAdminUsers(page = 1, limit = 100, search?: string): Promise<AdminUserResponse[]> {
  const response = await http.get<AdminUserResponse[]>('/admin/users', {
    params: {
      page,
      limit,
      ...(search && search.trim() ? { search: search.trim() } : {}),
    },
  });

  if (!response.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

/**
 * Fetch a single user by ID
 */
export async function getAdminUserById(id: string): Promise<AdminUserResponse> {
  const response = await http.get<AdminUserResponse>(`/admin/users/${id}`);
  return response.data;
}

/**
 * Soft delete a user via admin API
 */
export async function deleteAdminUser(id: string): Promise<void> {
  await http.delete(`/admin/users/${id}`);
}
