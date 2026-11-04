/**
 * Represents the public-facing package response
 */
export interface PublicPackageResponse {
  _id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  listingLimit: number;
  features: string[];
  isPopular?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the admin package response
 */
export interface AdminPackageResponse {
  _id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  listingLimit: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackagePayload {
  name: string;
  price: number;
  period?: 'month' | 'year';
  listingLimit: number;
  features?: string[];
  isPopular?: boolean;
  isActive?: boolean;
}

export interface UpdatePackagePayload {
  name?: string;
  price?: number;
  period?: 'month' | 'year';
  listingLimit?: number;
  features?: string[];
  isPopular?: boolean;
  isActive?: boolean;
}
