/**
 * Represents the admin user response from GET /api/admin/users and GET /api/admin/users/:id
 */
export interface AdminUserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  profileImage: string;
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
