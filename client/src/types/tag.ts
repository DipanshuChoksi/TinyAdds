/**
 * Represents the public-facing tag response from GET /api/tags and GET /api/tags/:id
 */
export interface PublicTagResponse {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the admin tag response from GET /api/admin/tags, POST /api/admin/tags, PATCH /api/admin/tags/:id
 */
export interface AdminTagResponse {
  _id: string;
  name: string;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagPayload {
  name: string;
  isActive?: boolean;
}

/**
 * Payload for updating a tag via PATCH /api/admin/tags/:id
 */
export interface UpdateTagPayload {
  name?: string;
  isActive?: boolean;
}
