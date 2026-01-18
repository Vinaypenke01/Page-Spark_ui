/**
 * API Type Definitions
 */

// Common API Response structure
export interface ApiResponse<T = unknown> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
}

// Page Generation Types
export interface GeneratePageRequest {
    prompt: string;
    email: string;
    page_type?: string;
    theme?: string;
    user_data?: Record<string, any>;
}

export interface GeneratePageResponse {
    page_id: string;
    live_url: string;
    email: string;
    created_at: string;
}

// Page History Types
export interface PageHistoryItem {
    id: string;
    email: string;
    prompt: string;
    pageType: string;
    theme?: string;
    liveUrl: string;
    url: string; // Alias for liveUrl (for compatibility)
    createdAt: string;
    views: number;
}

// Admin Dashboard Types
export interface DashboardStats {
    totalPages: number;
    pagesToday: number;
    totalViews: number;
    uniqueUsers: number;
    conversionRate: number;
}

export interface PopularPageType {
    type: string;
    count: number;
    percentage: number;
}

export interface DashboardData {
    stats: DashboardStats;
    recentPages: PageHistoryItem[];
    popularTypes: PopularPageType[];
}

// Admin User Management Types
export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'super_admin';
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
}

export interface CreateAdminRequest {
    email: string;
    password: string;
    confirmPassword: string;
    role: 'admin' | 'super_admin';
}

// Error Response Types
export interface ApiError {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
    timestamp: string;
}

// Request Configuration Types
export interface RequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    timeout?: number;
    signal?: AbortSignal;
    skipAuth?: boolean;
}
