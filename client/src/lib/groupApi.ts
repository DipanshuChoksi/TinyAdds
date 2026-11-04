import http, { type ApiResponse } from './http';
import type {
  AdminGroupResponse,
  PublicGroupResponse,
  CreateGroupPayload,
  UpdateGroupPayload,
} from '@/src/types/group';

/**
 * Fetch public active groups
 */
export async function getPublicGroups(page = 1, limit = 100): Promise<ApiResponse<PublicGroupResponse[]>> {
  return await http.get<PublicGroupResponse[]>('/groups', {
    params: { page, limit },
  });
}

/**
 * Fetch a single public group by ID
 */
export async function getPublicGroupById(id: string): Promise<ApiResponse<PublicGroupResponse>> {
  return await http.get<PublicGroupResponse>(`/groups/${id}`);
}

/**
 * Fetch groups for admin panel
 */
export async function getAdminGroups(page = 1, limit = 100): Promise<AdminGroupResponse[]> {
  const response = await http.get<AdminGroupResponse[]>('/admin/groups', {
    params: { page, limit },
  });

  if (!response.success || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}

/**
 * Create a new group via admin API
 */
export async function createAdminGroup(name: string): Promise<AdminGroupResponse> {
  const payload: CreateGroupPayload = { name, isActive: true };
  const response = await http.post<AdminGroupResponse, CreateGroupPayload>('/admin/groups', payload);
  return response.data;
}

/**
 * Update an existing group via admin API
 */
export async function updateAdminGroup(
  id: string,
  data: UpdateGroupPayload
): Promise<AdminGroupResponse> {
  const response = await http.patch<AdminGroupResponse, UpdateGroupPayload>(`/admin/groups/${id}`, data);
  return response.data;
}

/**
 * Soft delete a group via admin API
 */
export async function deleteAdminGroup(id: string): Promise<void> {
  await http.delete(`/admin/groups/${id}`);
}
