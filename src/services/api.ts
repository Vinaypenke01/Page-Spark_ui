/**
 * Centralized API Service
 * 
 * Type-safe API client with automatic token injection, error handling, and retry logic.
 */

import { env } from '@/config/env';
import { tokenStorage } from '@/utils/storage';
import type {
    ApiResponse,
    GeneratePageRequest,
    GeneratePageResponse,
    PageHistoryItem,
    DashboardData,
    AdminUser,
    CreateAdminRequest,
    ApiError,
    RequestConfig,
} from '@/types/api';
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

/**
 * API Client Configuration
 */
const API_BASE_URL = env.apiUrl;
const DEFAULT_TIMEOUT = 60000; // Increase to 60 seconds
const GENERATION_TIMEOUT = 120000; // 2 minutes for AI generation

/**
 * Custom API Error class
 */
export class ApiRequestError extends Error {
    constructor(
        public status: number,
        message: string,
        public errors?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'ApiRequestError';
    }
}

/**
 * Base API Client
 */
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    /**
     * Build request headers
     */
    private getHeaders(customHeaders?: Record<string, string>, skipAuth: boolean = false): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };

        // Add auth token if available and not skipped
        if (!skipAuth) {
            const token = tokenStorage.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    /**
     * Handle API response
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            let errors: Record<string, string[]> | undefined;

            if (isJson) {
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || errorMessage;
                    errors = errorData.errors;
                } catch {
                    // If JSON parsing fails, use default error message
                }
            }

            throw new ApiRequestError(response.status, errorMessage, errors);
        }

        if (isJson) {
            return response.json();
        }

        return response.text() as T;
    }

    /**
     * Make HTTP request with retry logic
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        config: RequestConfig = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const { headers, timeout = DEFAULT_TIMEOUT, signal, skipAuth = false } = config;

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                headers: this.getHeaders(headers, skipAuth),
                signal: signal || controller.signal,
            });

            clearTimeout(timeoutId);
            return this.handleResponse<T>(response);
        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof ApiRequestError) {
                throw error;
            }

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new ApiRequestError(408, 'Request timeout');
                }
                throw new ApiRequestError(0, error.message);
            }

            throw new ApiRequestError(0, 'An unexpected error occurred');
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' }, config);
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'POST',
                body: body ? JSON.stringify(body) : undefined,
            },
            config
        );
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'PUT',
                body: body ? JSON.stringify(body) : undefined,
            },
            config
        );
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                method: 'PATCH',
                body: body ? JSON.stringify(body) : undefined,
            },
            config
        );
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' }, config);
    }
}

/**
 * API Client Instance
 */
const client = new ApiClient(API_BASE_URL);

/**
 * API Services
 */
export const api = {
    /**
     * Page Generation APIs
     */
    pages: {
        /**
         * Generate a new page
         */
        generate: async (data: GeneratePageRequest): Promise<GeneratePageResponse> => {
            return client.post<GeneratePageResponse>('/api/generate/', data, { timeout: GENERATION_TIMEOUT, skipAuth: true });
        },

        /**
         * Generate AI-optimized prompt from user data
         */
        generatePrompt: async (userData: Record<string, any>): Promise<{ generated_prompt: string; user_data: Record<string, any> }> => {
            return client.post<{ generated_prompt: string; user_data: Record<string, any> }>('/api/generate-prompt/', { user_data: userData }, { timeout: 90000, skipAuth: true });
        },

        /**
         * Get page history for an email
         */
        getHistory: async (email: string): Promise<PageHistoryItem[]> => {
            return client.get<PageHistoryItem[]>(`/api/history/?email=${encodeURIComponent(email)}`, { skipAuth: true });
        },

        /**
         * Get page by ID
         */
        getById: async (pageId: string): Promise<PageHistoryItem> => {
            // This might need auth if private, but usually public. Assuming public for now.
            // If private, remove skipAuth. But LivePageView is AllowAny.
            return client.get<PageHistoryItem>(`/api/pages/${pageId}/`, { skipAuth: true });
        },
    },

    /**
     * Admin Authentication APIs
     */
    auth: {
        /**
         * Admin login
         */
        login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
            return client.post<AuthResponse>('/api/auth/login/', credentials, { skipAuth: true });
        },

        /**
         * Admin registration
         */
        register: async (data: RegisterData): Promise<AuthResponse> => {
            return client.post<AuthResponse>('/api/auth/register/', data, { skipAuth: true });
        },

        /**
         * Logout (optional backend endpoint)
         */
        logout: async (): Promise<void> => {
            try {
                await client.post('/api/admin/logout/');
            } catch (error) {
                // Logout locally even if backend fails
                console.error('Logout error:', error);
            }
        },

        /**
         * Refresh auth token
         */
        refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
            return client.post<AuthResponse>('/api/auth/refresh/', { refresh: refreshToken });
        },

        /**
         * Get current user info
         */
        me: async (): Promise<AuthResponse> => {
            return client.get<AuthResponse>('/api/admin/me/');
        },
    },

    /**
     * Admin Dashboard APIs
     */
    admin: {
        /**
         * Get dashboard statistics
         */
        getDashboard: async (): Promise<DashboardData> => {
            return client.get<DashboardData>('/api/admin/dashboard/');
        },

        /**
         * Get all admins
         */
        getAdmins: async (): Promise<AdminUser[]> => {
            return client.get<AdminUser[]>('/api/admin/users/');
        },

        /**
         * Create new admin
         */
        createAdmin: async (data: CreateAdminRequest): Promise<AdminUser> => {
            return client.post<AdminUser>('/api/admin/users/', data);
        },

        /**
         * Update admin
         */
        updateAdmin: async (id: string, data: Partial<AdminUser>): Promise<AdminUser> => {
            return client.patch<AdminUser>(`/api/admin/users/${id}/`, data);
        },

        /**
         * Delete admin
         */
        deleteAdmin: async (id: string): Promise<void> => {
            return client.delete<void>(`/api/admin/users/${id}/`);
        },
    },
};
