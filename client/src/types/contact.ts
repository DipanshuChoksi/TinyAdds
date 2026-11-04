/**
 * Represents the public contact submission payload
 */
export interface CreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Public response returned after submitting a contact message
 */
export interface PublicContactResponse {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

/**
 * Represents the admin contact/inquiry response from GET /api/admin/contacts
 */
export interface AdminContactResponse {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "pending" | "in_progress" | "resolved";
  isActive: boolean;
  isDisplay: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Admin update payload for inquiries (status or details)
 */
export interface UpdateContactPayload {
  status?: "pending" | "in_progress" | "resolved";
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  isActive?: boolean;
}
