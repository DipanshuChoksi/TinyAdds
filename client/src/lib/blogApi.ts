import http, { type ApiResponse } from './http';
import type {
  AdminBlogResponse,
  PublicBlogResponse,
  CreateBlogPayload,
  UpdateBlogPayload,
} from '@/src/types/blog';

/**
 * Fetch public active blogs
 */
export async function getPublicBlogs(page = 1, limit = 20): Promise<ApiResponse<PublicBlogResponse[]>> {
  return await http.get<PublicBlogResponse[]>('/blogs', {
    params: { page, limit },
  });
}

/**
 * Fetch a single public blog by ID
 */
export async function getPublicBlogById(id: string): Promise<ApiResponse<PublicBlogResponse>> {
  return await http.get<PublicBlogResponse>(`/blogs/${id}`);
}

/**
 * Fetch blogs for admin panel
 */
export async function getAdminBlogs(
  page = 1,
  limit = 10,
  search = ''
): Promise<{ items: AdminBlogResponse[]; meta?: { page: number; limit: number; total: number; totalPages: number } }> {
  const params: { page: number; limit: number; search?: string } = { page, limit };
  if (search.trim()) {
    params.search = search.trim();
  }

  const response = await http.get<AdminBlogResponse[]>('/admin/blogs', { params });

  if (!response.success || !Array.isArray(response.data)) {
    return { items: [], meta: undefined };
  }

  return {
    items: response.data,
    meta: response.meta as { page: number; limit: number; total: number; totalPages: number } | undefined,
  };
}

/**
 * Fetch a single blog by ID via admin API
 */
export async function getAdminBlogById(id: string): Promise<AdminBlogResponse> {
  const response = await http.get<AdminBlogResponse>(`/admin/blogs/${id}`);
  return response.data;
}

/**
 * Create a new blog via admin API
 */
export async function createAdminBlog(data: CreateBlogPayload): Promise<AdminBlogResponse> {
  const response = await http.post<AdminBlogResponse, CreateBlogPayload>('/admin/blogs', data);
  return response.data;
}

/**
 * Update an existing blog via admin API
 */
export async function updateAdminBlog(
  id: string,
  data: UpdateBlogPayload
): Promise<AdminBlogResponse> {
  const response = await http.patch<AdminBlogResponse, UpdateBlogPayload>(`/admin/blogs/${id}`, data);
  return response.data;
}

/**
 * Soft delete a blog via admin API
 */
export async function deleteAdminBlog(id: string): Promise<void> {
  await http.delete(`/admin/blogs/${id}`);
}
