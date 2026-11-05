import http, { type ApiResponse } from './http';
import type {
  AdminBannerSectionResponse,
  PublicBannerSectionResponse,
  CreateBannerSectionPayload,
  UpdateBannerSectionPayload,
} from '@/src/types/bannerSection';

/**
 * Fetch public active banner sections
 */
export async function getPublicBannerSections(page = 1, limit = 100): Promise<ApiResponse<PublicBannerSectionResponse[]>> {
  return await http.get<PublicBannerSectionResponse[]>('/banner-sections', {
    params: { page, limit },
  });
}

/**
 * Fetch a single public banner section by ID
 */
export async function getPublicBannerSectionById(id: string): Promise<ApiResponse<PublicBannerSectionResponse>> {
  return await http.get<PublicBannerSectionResponse>(`/banner-sections/${id}`);
}

/**
 * Fetch banner sections for admin panel
 */
export async function getAdminBannerSections(page = 1, limit = 100): Promise<AdminBannerSectionResponse[]> {
  const response = await http.get<AdminBannerSectionResponse[]>('/admin/banner-sections', {
    params: { page, limit },
  });

  if (!response.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

/**
 * Create a new banner section via admin API
 */
export async function createAdminBannerSection(name: string): Promise<AdminBannerSectionResponse> {
  const payload: CreateBannerSectionPayload = { name, isActive: true };
  const response = await http.post<AdminBannerSectionResponse, CreateBannerSectionPayload>('/admin/banner-sections', payload);
  return response.data;
}

/**
 * Update an existing banner section via admin API
 */
export async function updateAdminBannerSection(
  id: string,
  data: UpdateBannerSectionPayload
): Promise<AdminBannerSectionResponse> {
  const response = await http.patch<AdminBannerSectionResponse, UpdateBannerSectionPayload>(`/admin/banner-sections/${id}`, data);
  return response.data;
}

/**
 * Soft delete a banner section via admin API
 */
export async function deleteAdminBannerSection(id: string): Promise<void> {
  await http.delete(`/admin/banner-sections/${id}`);
}
