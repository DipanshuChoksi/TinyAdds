/**
 * Represents the public-facing emotion response from GET /api/emotions and GET /api/emotions/:id
 */
export interface PublicEmotionResponse {
  _id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the admin emotion response from GET /api/admin/emotions, POST /api/admin/emotions, PUT /api/admin/emotions/:id
 */
export interface AdminEmotionResponse {
  _id: string;
  name: string;
  image?: string;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmotionPayload {
  name: string;
  image?: string;
  isActive?: boolean;
}

/**
 * Payload for updating an emotion via PUT or PATCH /api/admin/emotions/:id
 */
export interface UpdateEmotionPayload {
  name?: string;
  image?: string;
  isActive?: boolean;
}