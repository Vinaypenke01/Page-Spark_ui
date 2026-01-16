/**
 * Environment Configuration
 * 
 * Centralized, type-safe access to environment variables with validation.
 * All environment variables must be prefixed with VITE_ to be accessible.
 */

interface EnvConfig {
    // API Configuration
    apiUrl: string;

    // App Configuration
    appName: string;
    appVersion: string;
    appDescription: string;

    // Feature Flags
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
    enableDebugMode: boolean;

    // Environment Detection
    isDevelopment: boolean;
    isProduction: boolean;
    isTest: boolean;
}

/**
 * Validates and returns environment configuration
 * @throws Error if required environment variables are missing
 */
function validateEnv(): EnvConfig {
    // Required variables
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
        throw new Error(
            'Missing required environment variable: VITE_API_URL\n' +
            'Please create a .env file based on .env.example'
        );
    }

    // Optional variables with defaults
    const appName = import.meta.env.VITE_APP_NAME || 'Page Spark';
    const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
    const appDescription = import.meta.env.VITE_APP_DESCRIPTION || 'AI-Powered Live Page Generator';

    // Feature flags
    const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    const enableErrorReporting = import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true';
    const enableDebugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';

    // Environment detection
    const mode = import.meta.env.MODE;
    const isDevelopment = mode === 'development';
    const isProduction = mode === 'production';
    const isTest = mode === 'test';

    return {
        apiUrl,
        appName,
        appVersion,
        appDescription,
        enableAnalytics,
        enableErrorReporting,
        enableDebugMode,
        isDevelopment,
        isProduction,
        isTest,
    };
}

/**
 * Validated environment configuration
 * Import this to access environment variables throughout the app
 * 
 * @example
 * import { env } from '@/config/env';
 * 
 * fetch(`${env.apiUrl}/api/generate/`, ...);
 */
export const env = validateEnv();

/**
 * Log environment configuration in development mode
 */
if (env.isDevelopment && env.enableDebugMode) {
    console.log('🔧 Environment Configuration:', {
        apiUrl: env.apiUrl,
        appName: env.appName,
        appVersion: env.appVersion,
        mode: import.meta.env.MODE,
    });
}
