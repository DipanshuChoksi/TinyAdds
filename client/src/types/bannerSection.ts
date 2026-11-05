/**
 * Represents the public-facing banner section response
 */
export interface PublicBannerSectionResponse {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the admin banner section response
 */
export interface AdminBannerSectionResponse {
  _id: string;
  name: string;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerSectionPayload {
  name: string;
  isActive?: boolean;
}

export interface UpdateBannerSectionPayload {
  name?: string;
  isActive?: boolean;
}
