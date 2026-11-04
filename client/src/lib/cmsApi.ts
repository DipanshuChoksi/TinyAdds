import http, { type ApiResponse } from './http';
import type {
  AdminCmsResponse,
  PublicCmsResponse,
  CreateCmsPayload,
  UpdateCmsPayload,
} from '@/src/types/cms';

/**
 * Fetch public active CMS pages
 */
export async function getPublicCms(page = 1, limit = 20): Promise<ApiResponse<PublicCmsResponse[]>> {
  return await http.get<PublicCmsResponse[]>('/cms', {
    params: { page, limit },
  });
}

/**
 * Fetch a single public CMS page by slug
 */
export async function getPublicCmsBySlug(slug: string): Promise<ApiResponse<PublicCmsResponse>> {
  return await http.get<PublicCmsResponse>(`/cms/${slug}`);
}

/**
 * Fetch CMS pages for admin panel
 */
export async function getAdminCms(page = 1, limit = 100): Promise<AdminCmsResponse[]> {
  const response = await http.get<AdminCmsResponse[]>('/admin/cms', {
    params: { page, limit },
  });

  if (!response.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

/**
 * Create a new CMS page via admin API
 */
export async function createAdminCms(data: CreateCmsPayload): Promise<AdminCmsResponse> {
  const response = await http.post<AdminCmsResponse, CreateCmsPayload>('/admin/cms', data);
  return response.data;
}

/**
 * Update an existing CMS page via admin API
 */
export async function updateAdminCms(
  id: string,
  data: UpdateCmsPayload
): Promise<AdminCmsResponse> {
  const response = await http.patch<AdminCmsResponse, UpdateCmsPayload>(`/admin/cms/${id}`, data);
  return response.data;
}

/**
 * Soft delete a CMS page via admin API
 */
export async function deleteAdminCms(id: string): Promise<void> {
  await http.delete(`/admin/cms/${id}`);
}
