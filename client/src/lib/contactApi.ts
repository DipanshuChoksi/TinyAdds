import http, { type ApiResponse } from './http';
import type {
  AdminContactResponse,
  PublicContactResponse,
  CreateContactPayload,
  UpdateContactPayload,
} from '@/src/types/contact';

/**
 * Public: Submit a contact / inquiry message
 */
export async function submitContact(payload: CreateContactPayload): Promise<ApiResponse<PublicContactResponse>> {
  return await http.post<PublicContactResponse, CreateContactPayload>('/contacts', payload);
}

/**
 * Admin: Fetch customer inquiries with optional status and search filter
 */
export async function getAdminContacts(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<{ items: AdminContactResponse[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
  const queryParams: Record<string, string | number> = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 50,
  };

  if (params?.status && params.status !== 'all') {
    queryParams.status = params.status;
  }
  if (params?.search && params.search.trim()) {
    queryParams.search = params.search.trim();
  }

  const response = await http.get<AdminContactResponse[]>('/admin/contacts', {
    params: queryParams,
  });

  if (!response.success || !Array.isArray(response.data)) {
    return { items: [], pagination: undefined };
  }

  return {
    items: response.data,
    pagination: response.meta as { page: number; limit: number; total: number; totalPages: number } | undefined,
  };
}

/**
 * Admin: Get contact inquiry detail by ID
 */
export async function getAdminContactById(id: string): Promise<AdminContactResponse> {
  const response = await http.get<AdminContactResponse>(`/admin/contacts/${id}`);
  return response.data;
}

/**
 * Admin: Update contact inquiry (e.g. status or notes)
 */
export async function updateAdminContact(
  id: string,
  data: UpdateContactPayload
): Promise<AdminContactResponse> {
  const response = await http.put<AdminContactResponse, UpdateContactPayload>(`/admin/contacts/${id}`, data);
  return response.data;
}

/**
 * Admin: Soft delete contact inquiry
 */
export async function deleteAdminContact(id: string): Promise<void> {
  await http.delete(`/admin/contacts/${id}`);
}
