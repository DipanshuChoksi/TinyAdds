import http, { type ApiResponse } from "./http";

export interface PublicPost {
  id: string;
  title: string;
  image: string;
  banner: {name : string, _id: string} | null;
  emotion: {name : string, _id: string} | null;
  searchGroup: {name : string, _id: string} | null;
  searchCategory: {name : string, _id: string} | null;
  fromDate: string;
  tag: string;
  description: string;
  contactPerson: string;
  contactNo: string;
  email: string;
  address: string;
  cityId?: number | null;
  cityName?: string;
  status: string;
  createdAt: string;
}

export async function getPublicPosts(params?: {
  banner?: string;
  searchGroup?: string;
  searchCategory?: string;
  emotion?: string;
  cityId?: number;
  search?: string;
  fromDate?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PublicPost[]>> {
  return await http.get<PublicPost[]>("/posts", {
    params: {
      banner: params?.banner,
      searchGroup: params?.searchGroup,
      searchCategory: params?.searchCategory,
      emotion: params?.emotion,
      cityId: params?.cityId,
      search: params?.search,
      fromDate: params?.fromDate,
      page: params?.page,
      limit: params?.limit,
    },
  });
}

export async function getPublicPostById(id: string): Promise<ApiResponse<PublicPost>> {
  return await http.get<PublicPost>(`/posts/${id}`);
}
