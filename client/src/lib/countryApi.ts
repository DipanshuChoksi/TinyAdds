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
 * Fetch countries for admin panel (list with pagination)
 */
export async function getAdminCountries(
  page = 1,
  limit = 10
): Promise<{ items: AdminCountryResponse[]; meta?: { page: number; limit: number; total: number; totalPages: number } }> {
  const response = await http.get<AdminCountryResponse[]>('/admin/countries', {
    params: { page, limit },
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
 * Fetch all countries for select dropdowns (large limit)
 */
export async function getAdminCountriesAll(limit = 200): Promise<AdminCountryResponse[]> {
  const res = await getAdminCountries(1, limit);
  return res.items;
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
