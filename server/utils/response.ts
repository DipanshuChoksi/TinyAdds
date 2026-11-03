export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(
  data: T,
  meta?: { page?: number; limit?: number; total?: number; totalPages?: number }
): ApiResponse<T> {
  const res: ApiResponse<T> = {
    success: true,
    data,
  };
  if (meta) {
    res.meta = meta;
  }
  return res;
}

