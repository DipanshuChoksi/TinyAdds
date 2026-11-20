import http, { type ApiResponse } from './http';
import type {
  AdminStateResponse,
  PublicStateResponse,
  CreateStatePayload,
  UpdateStatePayload,
} from '@/src/types/state';

/**
 * Fetch public active states (optional countryId filter)
 */
export async function getPublicStates(
  countryId?: number,
  page = 1,
  limit = 100
): Promise<ApiResponse<PublicStateResponse[]>> {
  return await http.get<PublicStateResponse[]>('/states', {
    params: { page, limit, ...(countryId !== undefined ? { countryId } : {}) },
  });
}

/**
 * Fetch a single public state by numeric ID
 */
export async function getPublicStateById(id: number): Promise<ApiResponse<PublicStateResponse>> {
  return await http.get<PublicStateResponse>(`/states/${id}`);
}

/**
 * Fetch states for admin panel (optional countryId filter) with pagination
 */
export async function getAdminStates(
  countryId?: number,
  page = 1,
  limit = 10,
  search = ''
): Promise<{ items: AdminStateResponse[]; meta?: { page: number; limit: number; total: number; totalPages: number } }> {
  const response = await http.get<AdminStateResponse[]>('/admin/states', {
    params: { countryId, page, limit, search: search || undefined },
  });
  return {
    items: response.data,
    meta: response.meta as { page: number; limit: number; total: number; totalPages: number } | undefined,
  };
}

/**
 * Fetch all states for dropdowns
 */
export async function getAdminStatesAll(countryId?: number, limit = 200): Promise<AdminStateResponse[]> {
  const res = await getAdminStates(countryId, 1, limit);
  return res.items;
}

/**
 * Create a new state via admin API
 */
export async function createAdminState(name: string, countryId: number): Promise<AdminStateResponse> {
  const payload: CreateStatePayload = { name, countryId, isActive: true };
  const response = await http.post<AdminStateResponse, CreateStatePayload>('/admin/states', payload);
  return response.data;
}

/**
 * Update an existing state via admin API
 */
export async function updateAdminState(
  id: number,
  data: UpdateStatePayload
): Promise<AdminStateResponse> {
  const response = await http.put<AdminStateResponse, UpdateStatePayload>(`/admin/states/${id}`, data);
  return response.data;
}

/**
 * Soft delete a state via admin API
 */
export async function deleteAdminState(id: number): Promise<void> {
  await http.delete(`/admin/states/${id}`);
}
