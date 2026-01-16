/**
 * Error Boundary Component
 * 
 * Catches React errors and prevents the entire app from crashing.
 * Displays a fallback UI when an error occurs.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { env } from '@/config/env';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Class Component
 * (Must be a class component as hooks don't support error boundaries yet)
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    /**
     * Update state when an error is caught
     */
    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return {
            hasError: true,
            error,
        };
    }

    /**
     * Log error details
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        if (env.isDevelopment) {
            console.error('Error Boundary caught an error:', error);
            console.error('Error Info:', errorInfo);
        }

        // Call optional error handler
        this.props.onError?.(error, errorInfo);

        // In production, you would send this to an error reporting service
        if (env.enableErrorReporting && env.isProduction) {
            // Example: Send to Sentry, LogRocket, etc.
            // sendErrorReport(error, errorInfo);
        }

        // Update state with error info
        this.setState({
            errorInfo,
        });
    }

    /**
     * Reset error state
     */
    resetError = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <ErrorFallback
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    resetError={this.resetError}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * Default Error Fallback Component
 */
interface ErrorFallbackProps {
    error: Error | null;
    errorInfo: ErrorInfo | null;
    resetError: () => void;
}

function ErrorFallback({ error, errorInfo, resetError }: ErrorFallbackProps) {
    const isDev = env.isDevelopment;

    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl shadow-xl border border-border p-8 max-w-2xl w-full">
                {/* Error Icon */}
                <div className="flex items-center justify-center mb-6">
                    <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                        <svg
                            className="h-10 w-10 text-destructive"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Error Message */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Oops! Something went wrong
                    </h1>
                    <p className="text-muted-foreground">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                </div>

                {/* Error Details (Development Only) */}
                {isDev && error && (
                    <div className="mb-6 space-y-4">
                        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                            <h2 className="text-sm font-semibold text-destructive mb-2">
                                Error Message:
                            </h2>
                            <p className="text-sm text-foreground font-mono break-all">
                                {error.message}
                            </p>
                        </div>

                        {errorInfo?.componentStack && (
                            <details className="bg-muted/50 border border-border rounded-lg p-4">
                                <summary className="text-sm font-semibold text-foreground cursor-pointer">
                                    Component Stack (Click to expand)
                                </summary>
                                <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-64">
                                    {errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={resetError}
                        className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                    >
                        Go to Homepage
                    </button>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-muted-foreground mt-6">
                    If this problem persists, please{' '}
                    <a href="mailto:support@pagespark.com" className="text-primary hover:underline">
                        contact support
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}

export default ErrorBoundary;
