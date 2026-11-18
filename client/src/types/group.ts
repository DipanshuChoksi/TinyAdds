/**
 * Represents the public-facing group response
 */
export interface PublicGroupResponse {
  _id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the admin group response
 */
export interface AdminGroupResponse {
  _id: string;
  name: string;
  image?: string;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupPayload {
  name: string;
  image?: string;
  isActive?: boolean;
}

export interface UpdateGroupPayload {
  name?: string;
  image?: string;
  isActive?: boolean;
}
