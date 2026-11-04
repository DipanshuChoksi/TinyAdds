export interface PublicCountryResponse {
  _id: string;
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCountryResponse {
  _id: string;
  id: number;
  name: string;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCountryPayload {
  name: string;
  isActive?: boolean;
}

export interface UpdateCountryPayload {
  name?: string;
  isActive?: boolean;
}
