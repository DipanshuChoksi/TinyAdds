import http, { type ApiResponse } from './http';
import type {
  AdminSearchCategoryResponse,
  PublicSearchCategoryResponse,
  CreateSearchCategoryPayload,
  UpdateSearchCategoryPayload,
} from '@/src/types/searchCategory';

/**
 * Fetch public active search categories
 */
export async function getPublicSearchCategories(page = 1, limit = 100): Promise<ApiResponse<PublicSearchCategoryResponse[]>> {
  return await http.get<PublicSearchCategoryResponse[]>('/search-categories', {
    params: { page, limit },
  });
}

/**
 * Fetch a single public search category by ID
 */
export async function getPublicSearchCategoryById(id: string): Promise<ApiResponse<PublicSearchCategoryResponse>> {
  return await http.get<PublicSearchCategoryResponse>(`/search-categories/${id}`);
}

/**
 * Fetch search categories for admin panel
 */
export async function getAdminSearchCategories(page = 1, limit = 100): Promise<AdminSearchCategoryResponse[]> {
  const response = await http.get<AdminSearchCategoryResponse[]>('/admin/search-categories', {
    params: { page, limit },
  });

  if (!response.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

/**
 * Create a new search category via admin API
 */
export async function createAdminSearchCategory(name: string): Promise<AdminSearchCategoryResponse> {
  const payload: CreateSearchCategoryPayload = { name, isActive: true };
  const response = await http.post<AdminSearchCategoryResponse, CreateSearchCategoryPayload>('/admin/search-categories', payload);
  return response.data;
}

/**
 * Update an existing search category via admin API
 */
export async function updateAdminSearchCategory(
  id: string,
  data: UpdateSearchCategoryPayload
): Promise<AdminSearchCategoryResponse> {
  const response = await http.patch<AdminSearchCategoryResponse, UpdateSearchCategoryPayload>(`/admin/search-categories/${id}`, data);
  return response.data;
}

/**
 * Soft delete a search category via admin API
 */
export async function deleteAdminSearchCategory(id: string): Promise<void> {
  await http.delete(`/admin/search-categories/${id}`);
}
