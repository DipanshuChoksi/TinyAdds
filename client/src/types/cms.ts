/**
 * Represents the public-facing CMS response from GET /api/cms and GET /api/cms/:slug
 */
export interface PublicCmsResponse {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the admin CMS response from GET /api/admin/cms, POST /api/admin/cms, PATCH /api/admin/cms/:id
 */
export interface AdminCmsResponse {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCmsPayload {
  title: string;
  slug?: string;
  content?: string;
  image?: string;
  isActive?: boolean;
}

export interface UpdateCmsPayload {
  title?: string;
  slug?: string;
  content?: string;
  image?: string;
  isActive?: boolean;
}
