/**
 * Custom Hook for API Requests
 * 
 * Provides loading, error, and data states for API calls.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    enabled?: boolean;
}

export interface UseApiReturn<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    reset: () => void;
}

/**
 * Hook for API requests with automatic cleanup
 */
export function useApi<T>(
    apiCall: () => Promise<T>,
    options: UseApiOptions<T> = {}
): UseApiReturn<T> {
    const { onSuccess, onError, enabled = true } = options;

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async () => {
        if (!enabled) return;

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setLoading(true);
        setError(null);

        try {
            const result = await apiCall();

            if (mountedRef.current) {
                setData(result);
                onSuccess?.(result);
            }
        } catch (err) {
            if (mountedRef.current) {
                const error = err instanceof Error ? err : new Error('An error occurred');
                setError(error);
                onError?.(error);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    }, [apiCall, enabled, onSuccess, onError]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();

        return () => {
            mountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        reset,
    };
}

/**
 * Hook for manual API calls (not automatic)
 */
export function useApiMutation<TData, TVariables = void>(
    apiCall: (variables: TVariables) => Promise<TData>,
    options: UseApiOptions<TData> = {}
) {
    const { onSuccess, onError } = options;

    const [data, setData] = useState<TData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(
        async (variables: TVariables) => {
            setLoading(true);
            setError(null);

            try {
                const result = await apiCall(variables);
                setData(result);
                onSuccess?.(result);
                return result;
            } catch (err) {
                const error = err instanceof Error ? err : new Error('An error occurred');
                setError(error);
                onError?.(error);
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [apiCall, onSuccess, onError]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return {
        data,
        loading,
        error,
        mutate,
        reset,
    };
}
