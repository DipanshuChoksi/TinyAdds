import http, { type ApiResponse } from './http';
import type {
  AdminCityResponse,
  PublicCityResponse,
  CreateCityPayload,
  UpdateCityPayload,
} from '@/src/types/city';

/**
 * Fetch public active cities (optional filters: countryId, stateId, showOnHome, page, limit)
 */
export async function getPublicCities(
  countryId?: number,
  stateId?: number,
  page = 1,
  limit = 100,
  showOnHome?: boolean
): Promise<ApiResponse<PublicCityResponse[]>> {
  return await http.get<PublicCityResponse[]>('/cities', {
    params: {
      page,
      limit,
      ...(countryId !== undefined ? { countryId } : {}),
      ...(stateId !== undefined ? { stateId } : {}),
      ...(showOnHome !== undefined ? { showOnHome } : {}),
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
 * Fetch cities for admin panel (optional countryId, stateId, and search filters) with pagination
 */
export async function getAdminCities(
  countryId?: number,
  stateId?: number,
  page = 1,
  limit = 10,
  search?: string
): Promise<{ items: AdminCityResponse[]; meta?: { page: number; limit: number; total: number; totalPages: number } }> {
  const response = await http.get<AdminCityResponse[]>('/admin/cities', {
    params: {
      page,
      limit,
      ...(countryId !== undefined ? { countryId } : {}),
      ...(stateId !== undefined ? { stateId } : {}),
      ...(search && search.trim() ? { search: search.trim() } : {}),
    },
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
 * Create a new city via admin API
 */
export async function createAdminCity(
  name: string,
  countryId: number,
  stateId: number,
  showOnHome?: boolean,
  image?: string
): Promise<AdminCityResponse> {
  const payload: CreateCityPayload = {
    name,
    countryId,
    stateId,
    isActive: true,
    ...(showOnHome !== undefined ? { showOnHome } : {}),
    ...(image !== undefined ? { image } : {}),
  };
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
