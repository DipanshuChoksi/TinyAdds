import http, { type ApiResponse } from './http';
import type {
  AdminCountryResponse,
  PublicCountryResponse,
  CreateCountryPayload,
  UpdateCountryPayload,
} from '@/src/types/country';

/**
 * Fetch public active countries
 */
export async function getPublicCountries(page = 1, limit = 100): Promise<ApiResponse<PublicCountryResponse[]>> {
  return await http.get<PublicCountryResponse[]>('/countries', {
    params: { page, limit },
  });
}

/**
 * Fetch a single public country by numeric ID
 */
export async function getPublicCountryById(id: number): Promise<ApiResponse<PublicCountryResponse>> {
  return await http.get<PublicCountryResponse>(`/countries/${id}`);
}

/**
 * Fetch countries for admin panel
 */
export async function getAdminCountries(page = 1, limit = 100): Promise<AdminCountryResponse[]> {
  const response = await http.get<AdminCountryResponse[]>('/admin/countries', {
    params: { page, limit },
  });

  if (!response.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

/**
 * Create a new country via admin API
 */
export async function createAdminCountry(name: string): Promise<AdminCountryResponse> {
  const payload: CreateCountryPayload = { name, isActive: true };
  const response = await http.post<AdminCountryResponse, CreateCountryPayload>('/admin/countries', payload);
  return response.data;
}

/**
 * Update an existing country via admin API
 */
export async function updateAdminCountry(
  id: number,
  data: UpdateCountryPayload
): Promise<AdminCountryResponse> {
  const response = await http.put<AdminCountryResponse, UpdateCountryPayload>(`/admin/countries/${id}`, data);
  return response.data;
}

/**
 * Soft delete a country via admin API
 */
export async function deleteAdminCountry(id: number): Promise<void> {
  await http.delete(`/admin/countries/${id}`);
}
