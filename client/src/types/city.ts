export interface PublicCityResponse {
  _id: string;
  id: number;
  name: string;
  countryId: number;
  stateId: number;
  showOnHome?: boolean;
  image?: string;
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
  showOnHome?: boolean;
  image?: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCityPayload {
  name: string;
  countryId: number;
  stateId: number;
  isActive?: boolean;
  showOnHome?: boolean;
  image?: string;
}

export interface UpdateCityPayload {
  name?: string;
  countryId?: number;
  stateId?: number;
  isActive?: boolean;
  showOnHome?: boolean;
  image?: string;
}
