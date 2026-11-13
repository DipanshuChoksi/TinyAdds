/**
 * Public Blog API response
 */
export interface PublicBlogResponse {
  _id: string;
  title: string;
  content: string;
  bannerImage: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin Blog API response
 */
export interface AdminBlogResponse {
  _id: string;
  title: string;
  content: string;
  bannerImage: string;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload for creating a blog
 */
export interface CreateBlogPayload {
  title: string;
  content?: string;
  bannerImage?: string;
  isActive?: boolean;
}

/**
 * Payload for updating a blog
 */
export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  bannerImage?: string;
  isActive?: boolean;
}
