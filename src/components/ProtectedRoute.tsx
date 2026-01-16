/**
 * Protected Route Component
 * 
 * Wrapper component for routes that require authentication.
 * Redirects to login if user is not authenticated.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireRole?: 'admin' | 'super_admin';
    redirectTo?: string;
}

/**
 * Loading component while checking authentication
 */
function LoadingAuth() {
    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Verifying authentication...</p>
            </div>
        </div>
    );
}

/**
 * Protected Route Component
 */
export function ProtectedRoute({
    children,
    requireRole,
    redirectTo = '/admin/login',
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading) {
        return <LoadingAuth />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        // Save the attempted URL for redirect after login
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role-based access if required
    if (requireRole && user?.role !== requireRole) {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
                <div className="bg-card rounded-2xl shadow-xl border border-border p-8 max-w-md text-center">
                    <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="h-8 w-8"
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
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Access Denied
                    </h1>
                    <p className="text-muted-foreground">
                        You don't have permission to access this page. This page requires{' '}
                        <strong>{requireRole}</strong> role.
                    </p>
                </div>
            </div>
        );
    }

    // User is authenticated and has correct role
    return <>{children}</>;
}

/**
 * Hook to check if user has required permission
 */
export function useRequireAuth(requireRole?: 'admin' | 'super_admin') {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return false;
    }

    if (requireRole && user?.role !== requireRole) {
        return false;
    }

    return true;
}
