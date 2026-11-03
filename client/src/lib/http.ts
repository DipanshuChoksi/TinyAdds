import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from "axios";

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
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor (e.g. for injecting Auth tokens or headers)
    this.instance.interceptors.request.use(
      (config) => {
        // Can read localStorage/cookies in browser if token exists
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ApiResponse>) => {
        const message =
          error.response?.data?.error?.message ||
          error.message ||
          "An unexpected network error occurred";
        return Promise.reject(new Error(message));
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}

export const http = new HttpClient();
export default http;

