import http, { type ApiResponse } from './http';
import type {
  AdminEmotionResponse,
  PublicEmotionResponse,
  CreateEmotionPayload,
  UpdateEmotionPayload,
} from '@/src/types/emotion';

/**
 * Fetch public active emotions
 */
export async function getPublicEmotions(page = 1, limit = 20): Promise<ApiResponse<PublicEmotionResponse[]>> {
  return await http.get<PublicEmotionResponse[]>('/emotions', {
    params: { page, limit },
  });
}

/**
 * Fetch a single public emotion by ID
 */
export async function getPublicEmotionById(id: string): Promise<ApiResponse<PublicEmotionResponse>> {
  return await http.get<PublicEmotionResponse>(`/emotions/${id}`);
}

/**
 * Fetch emotions for admin panel
 */
export async function getAdminEmotions(page = 1, limit = 100): Promise<AdminEmotionResponse[]> {
  const response = await http.get<AdminEmotionResponse[]>('/admin/emotions', {
    params: { page, limit },
  });

  if (!response.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

/**
 * Create a new emotion via admin API
 */
export async function createAdminEmotion(name: string, image = ''): Promise<AdminEmotionResponse> {
  const payload: CreateEmotionPayload = { name, image, isActive: true };
  const response = await http.post<AdminEmotionResponse, CreateEmotionPayload>('/admin/emotions', payload);
  return response.data;
}

/**
 * Update an existing emotion via admin API
 */
export async function updateAdminEmotion(
  id: string,
  data: UpdateEmotionPayload
): Promise<AdminEmotionResponse> {
  const response = await http.patch<AdminEmotionResponse, UpdateEmotionPayload>(`/admin/emotions/${id}`, data);
  return response.data;
}

/**
 * Soft delete an emotion via admin API
 */
export async function deleteAdminEmotion(id: string): Promise<void> {
  await http.delete(`/admin/emotions/${id}`);
}
