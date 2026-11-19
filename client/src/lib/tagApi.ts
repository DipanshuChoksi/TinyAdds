import http, { type ApiResponse } from './http';
import type {
  AdminTagResponse,
  PublicTagResponse,
  CreateTagPayload,
  UpdateTagPayload,
} from '@/src/types/tag';

/**
 * Fetch public active tags
 */
export async function getPublicTags(): Promise<ApiResponse<PublicTagResponse[]>> {
  return await http.get<PublicTagResponse[]>('/tags');
}

/**
 * Create a new tag via public/client API (or admin)
 */
export async function createPublicTag(name: string): Promise<ApiResponse<PublicTagResponse>> {
  return await http.post<PublicTagResponse, CreateTagPayload>('/tags', { name, isActive: true });
}

/**
 * Fetch a single public tag by ID
 */
export async function getPublicTagById(id: string): Promise<ApiResponse<PublicTagResponse>> {
  return await http.get<PublicTagResponse>(`/tags/${id}`);
}

/**
 * Fetch tags for admin panel
 */
export async function getAdminTags(): Promise<AdminTagResponse[]> {
  const response = await http.get<AdminTagResponse[]>('/admin/tags');

  if (!response.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

/**
 * Create a new tag via admin API
 */
export async function createAdminTag(name: string): Promise<AdminTagResponse> {
  const payload: CreateTagPayload = { name, isActive: true };
  const response = await http.post<AdminTagResponse, CreateTagPayload>('/admin/tags', payload);
  return response.data;
}

/**
 * Update an existing tag via admin API
 */
export async function updateAdminTag(
  id: string,
  data: UpdateTagPayload
): Promise<AdminTagResponse> {
  const response = await http.patch<AdminTagResponse, UpdateTagPayload>(`/admin/tags/${id}`, data);
  return response.data;
}

/**
 * Soft delete a tag via admin API
 */
export async function deleteAdminTag(id: string): Promise<void> {
  await http.delete(`/admin/tags/${id}`);
}

// /**
//  * Restore a soft-deleted tag via admin API
//  */
// export async function restoreAdminTag(id: string): Promise<AdminTagResponse> {
//   const response = await http.patch<AdminTagResponse>(`/admin/tags/${id}/restore`);
//   return response.data;
// }
