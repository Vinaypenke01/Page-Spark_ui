/**
 * Authentication Context
 * 
 * Global authentication state management with JWT token handling.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiRequestError } from '@/services/api';
import { tokenStorage, storage, StorageKey } from '@/utils/storage';
import type { AuthContextType, User, LoginCredentials, RegisterData, AuthState } from '@/types/auth';
import { toast } from 'sonner';

/**
 * Authentication Context
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Authentication Provider Props
 */
interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * Authentication Provider Component
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
    });

    /**
     * Initialize auth state from storage
     */
    useEffect(() => {
        const initializeAuth = async () => {
            const token = tokenStorage.getToken();
            const userData = storage.get<User>(StorageKey.USER_DATA);

            if (token && userData) {
                // Validate token by fetching user data
                try {
                    const response = await api.auth.me();
                    setState({
                        user: response.user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    // Token is invalid, clear storage
                    tokenStorage.clearAll();
                    setState({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            } else {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        };

        initializeAuth();
    }, []);

    /**
     * Login function
     */
    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setState((prev) => ({ ...prev, isLoading: true }));

            const response = await api.auth.login(credentials);

            // Store token and user data
            tokenStorage.setToken(response.token);
            if (response.refreshToken) {
                tokenStorage.setRefreshToken(response.refreshToken);
            }
            storage.set(StorageKey.USER_DATA, response.user);

            // Remember me functionality
            if (credentials.rememberMe) {
                storage.set(StorageKey.REMEMBER_ME, true);
            }

            // Update state
            setState({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
            });

            toast.success('Welcome back!', {
                description: `Logged in as ${response.user.email}`,
            });
        } catch (error) {
            setState((prev) => ({ ...prev, isLoading: false }));

            if (error instanceof ApiRequestError) {
                toast.error('Login failed', {
                    description: error.message,
                });
            } else {
                toast.error('Login failed', {
                    description: 'An unexpected error occurred',
                });
            }

            throw error;
        }
    }, []);

    /**
     * Register function
     */
    const register = useCallback(async (data: RegisterData) => {
        try {
            setState((prev) => ({ ...prev, isLoading: true }));

            const response = await api.auth.register(data);

            // Store token and user data
            tokenStorage.setToken(response.token);
            if (response.refreshToken) {
                tokenStorage.setRefreshToken(response.refreshToken);
            }
            storage.set(StorageKey.USER_DATA, response.user);

            // Update state
            setState({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
            });

            toast.success('Account created!', {
                description: 'Welcome to Page Spark',
            });
        } catch (error) {
            setState((prev) => ({ ...prev, isLoading: false }));

            if (error instanceof ApiRequestError) {
                toast.error('Registration failed', {
                    description: error.message,
                });
            } else {
                toast.error('Registration failed', {
                    description: 'An unexpected error occurred',
                });
            }

            throw error;
        }
    }, []);

    /**
     * Logout function
     */
    const logout = useCallback(async () => {
        try {
            // Call logout endpoint (optional)
            await api.auth.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Clear all auth data
            tokenStorage.clearAll();

            // Update state
            setState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });

            toast.success('Logged out successfully');
        }
    }, []);

    /**
     * Refresh token function
     */
    const refreshToken = useCallback(async () => {
        try {
            const currentRefreshToken = tokenStorage.getRefreshToken();

            if (!currentRefreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await api.auth.refreshToken(currentRefreshToken);

            // Update tokens
            tokenStorage.setToken(response.token);
            if (response.refreshToken) {
                tokenStorage.setRefreshToken(response.refreshToken);
            }

            // Update state
            setState((prev) => ({
                ...prev,
                token: response.token,
                user: response.user,
            }));
        } catch (error) {
            // If refresh fails, logout
            logout();
            throw error;
        }
    }, [logout]);

    /**
     * Update user data
     */
    const updateUser = useCallback((userUpdate: Partial<User>) => {
        setState((prev) => {
            if (!prev.user) return prev;

            const updatedUser = { ...prev.user, ...userUpdate };
            storage.set(StorageKey.USER_DATA, updatedUser);

            return {
                ...prev,
                user: updatedUser,
            };
        });
    }, []);

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        refreshToken,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
