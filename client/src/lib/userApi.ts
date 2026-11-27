import http from './http';
import type { AdminUserResponse } from '@/src/types/user';

/**
 * Fetch users for admin panel with pagination and optional search
 */
export async function getAdminUsers(
  page = 1,
  limit = 10,
  search?: string,
  userType?: 'user' | 'admin'
): Promise<{ items: AdminUserResponse[]; meta?: { page: number; limit: number; total: number; totalPages: number } }> {
  const response = await http.get<AdminUserResponse[]>('/admin/users', {
    params: {
      page,
      limit,
      ...(search && search.trim() ? { search: search.trim() } : {}),
      ...(userType ? { userType } : {}),
    },
  });

  if (!response.success || !Array.isArray(response.data)) {
    return { items: [], meta: undefined };
  }

  return {
    items: response.data,
    meta: response.meta as { page: number; limit: number; total: number; totalPages: number } | undefined,
  };
}

/**
 * Fetch a single user by ID
 */
export async function getAdminUserById(id: string): Promise<AdminUserResponse> {
  const response = await http.get<AdminUserResponse>(`/admin/users/${id}`);
  return response.data;
}

/**
 * Update user status via admin API
 */
export async function updateAdminUserStatus(id: string, isActive: boolean): Promise<AdminUserResponse> {
  const response = await http.patch<AdminUserResponse>(`/admin/users/${id}`, { isActive });
  return response.data;
}

/**
 * Soft delete a user via admin API
 */
export async function deleteAdminUser(id: string): Promise<void> {
  await http.delete(`/admin/users/${id}`);
}

/**
 * Create a new admin user via admin API
 */
export async function createAdminUser(payload: {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}): Promise<AdminUserResponse> {
  const response = await http.post<AdminUserResponse>('/admin/users', payload);
  return response.data;
}
