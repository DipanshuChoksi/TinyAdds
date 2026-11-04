export interface PublicCityResponse {
  _id: string;
  id: number;
  name: string;
  countryId: number;
  stateId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCityResponse {
  _id: string;
  id: number;
  name: string;
  countryId: number;
  stateId: number;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCityPayload {
  name: string;
  countryId: number;
  stateId: number;
  isActive?: boolean;
}

export interface UpdateCityPayload {
  name?: string;
  countryId?: number;
  stateId?: number;
  isActive?: boolean;
}
