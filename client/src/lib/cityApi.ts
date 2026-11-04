import http, { type ApiResponse } from './http';
import type {
  AdminCityResponse,
  PublicCityResponse,
  CreateCityPayload,
  UpdateCityPayload,
} from '@/src/types/city';

/**
 * Fetch public active cities (optional countryId and stateId filters)
 */
export async function getPublicCities(
  countryId?: number,
  stateId?: number,
  page = 1,
  limit = 100
): Promise<ApiResponse<PublicCityResponse[]>> {
  return await http.get<PublicCityResponse[]>('/cities', {
    params: {
      page,
      limit,
      ...(countryId !== undefined ? { countryId } : {}),
      ...(stateId !== undefined ? { stateId } : {}),
    },
  });
}

/**
 * Fetch a single public city by numeric ID
 */
export async function getPublicCityById(id: number): Promise<ApiResponse<PublicCityResponse>> {
  return await http.get<PublicCityResponse>(`/cities/${id}`);
}

/**
 * Fetch cities for admin panel (optional countryId and stateId filters)
 */
export async function getAdminCities(
  countryId?: number,
  stateId?: number,
  page = 1,
  limit = 200
): Promise<AdminCityResponse[]> {
  const response = await http.get<AdminCityResponse[]>('/admin/cities', {
    params: {
      page,
      limit,
      ...(countryId !== undefined ? { countryId } : {}),
      ...(stateId !== undefined ? { stateId } : {}),
    },
  });

  if (!response.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

/**
 * Create a new city via admin API
 */
export async function createAdminCity(
  name: string,
  countryId: number,
  stateId: number
): Promise<AdminCityResponse> {
  const payload: CreateCityPayload = { name, countryId, stateId, isActive: true };
  const response = await http.post<AdminCityResponse, CreateCityPayload>('/admin/cities', payload);
  return response.data;
}

/**
 * Update an existing city via admin API
 */
export async function updateAdminCity(
  id: number,
  data: UpdateCityPayload
): Promise<AdminCityResponse> {
  const response = await http.put<AdminCityResponse, UpdateCityPayload>(`/admin/cities/${id}`, data);
  return response.data;
}

/**
 * Soft delete a city via admin API
 */
export async function deleteAdminCity(id: number): Promise<void> {
  await http.delete(`/admin/cities/${id}`);
}
