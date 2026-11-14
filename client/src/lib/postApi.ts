import http, { type ApiResponse } from "./http";

export interface PublicPost {
  id: string;
  title: string;
  image: string;
  banner: string;
  emotion: string;
  searchGroup: string;
  searchCategory: string;
  fromDate: string;
  tag: string;
  description: string;
  contactPerson: string;
  contactNo: string;
  email: string;
  address: string;
  status: string;
  createdAt: string;
}

export async function getPublicPosts(params?: {
  banner?: string;
  fromDate?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<PublicPost[]>> {
  return await http.get<PublicPost[]>("/posts", {
    params: {
      banner: params?.banner,
      fromDate: params?.fromDate,
      page: params?.page,
      limit: params?.limit,
    },
  });
}
