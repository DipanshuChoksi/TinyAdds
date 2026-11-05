/**
 * Represents the public-facing search category response
 */
export interface PublicSearchCategoryResponse {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the admin search category response
 */
export interface AdminSearchCategoryResponse {
  _id: string;
  name: string;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSearchCategoryPayload {
  name: string;
  isActive?: boolean;
}

export interface UpdateSearchCategoryPayload {
  name?: string;
  isActive?: boolean;
}
