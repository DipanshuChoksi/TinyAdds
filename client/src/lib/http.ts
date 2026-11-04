export interface HttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
  timeout?: number;
  credentials?: RequestCredentials;
}

/**
 * Standard API Response envelope matching backend standard
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

class HttpClient {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  }

  private async request<T, D = unknown>(
    method: string,
    url: string,
    data?: D,
    config: HttpRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const requestUrl = new URL(url.replace(/^\/+/, ""), `${this.baseURL.replace(/\/$/, "")}/`);
    Object.entries(config.params ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined) requestUrl.searchParams.set(key, String(value));
    });

    const headers = new Headers({ "Content-Type": "application/json" });
    new Headers(config.headers).forEach((value, key) => headers.set(key, value));
    const controller = config.timeout ? new AbortController() : undefined;
    const timeoutId = controller ? setTimeout(() => controller.abort(), config.timeout) : undefined;

    try {
      const response = await fetch(requestUrl, {
        method,
        headers,
        body: data === undefined ? undefined : JSON.stringify(data),
        signal: config.signal ?? controller?.signal,
        credentials: config.credentials ?? "include",
      });
      const result = (await response.json()) as ApiResponse<T>;
      if (!response.ok) {
        throw new Error(result?.error?.message || response.statusText || "An unexpected network error occurred");
      }
      return result;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error("An unexpected network error occurred");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  public get<T>(url: string, config?: HttpRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>("GET", url, undefined, config);
  }

  public post<T, D = unknown>(url: string, data?: D, config?: HttpRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T, D>("POST", url, data, config);
  }

  public put<T, D = unknown>(url: string, data?: D, config?: HttpRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T, D>("PUT", url, data, config);
  }

  public patch<T, D = unknown>(url: string, data?: D, config?: HttpRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T, D>("PATCH", url, data, config);
  }

  public delete<T>(url: string, config?: HttpRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", url, undefined, config);
  }
}

export const http = new HttpClient();
export default http;

