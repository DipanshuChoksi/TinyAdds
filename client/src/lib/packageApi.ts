import http, { type ApiResponse } from './http';
import type {
  AdminPackageResponse,
  PublicPackageResponse,
  CreatePackagePayload,
  UpdatePackagePayload,
} from '@/src/types/package';

/**
 * Fetch public active packages
 */
export async function getPublicPackages(page = 1, limit = 50): Promise<ApiResponse<PublicPackageResponse[]>> {
  return await http.get<PublicPackageResponse[]>('/packages', {
    params: { page, limit },
  });
}

/**
 * Fetch a single public package by ID
 */
export async function getPublicPackageById(id: string): Promise<ApiResponse<PublicPackageResponse>> {
  return await http.get<PublicPackageResponse>(`/packages/${id}`);
}

/**
 * Fetch packages for admin panel
 */
export async function getAdminPackages(page = 1, limit = 100): Promise<AdminPackageResponse[]> {
  const response = await http.get<AdminPackageResponse[]>('/admin/packages', {
    params: { page, limit },
  });

  if (!response.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

/**
 * Create a new package via admin API
 */
export async function createAdminPackage(data: CreatePackagePayload): Promise<AdminPackageResponse> {
  const response = await http.post<AdminPackageResponse, CreatePackagePayload>('/admin/packages', data);
  return response.data;
}

/**
 * Update an existing package via admin API
 */
export async function updateAdminPackage(
  id: string,
  data: UpdatePackagePayload
): Promise<AdminPackageResponse> {
  const response = await http.patch<AdminPackageResponse, UpdatePackagePayload>(`/admin/packages/${id}`, data);
  return response.data;
}

/**
 * Soft delete a package via admin API
 */
export async function deleteAdminPackage(id: string): Promise<void> {
  await http.delete(`/admin/packages/${id}`);
}
