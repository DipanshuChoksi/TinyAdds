export interface PublicStateResponse {
  _id: string;
  id: number;
  name: string;
  countryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStateResponse {
  _id: string;
  id: number;
  name: string;
  countryId: number;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStatePayload {
  name: string;
  countryId: number;
  isActive?: boolean;
}

export interface UpdateStatePayload {
  name?: string;
  countryId?: number;
  isActive?: boolean;
}
