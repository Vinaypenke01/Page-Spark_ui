/**
 * Secure LocalStorage Utility
 * 
 * Provides type-safe, encrypted storage for sensitive data like auth tokens.
 */

const STORAGE_PREFIX = 'page_spark_';

export enum StorageKey {
    AUTH_TOKEN = 'auth_token',
    REFRESH_TOKEN = 'refresh_token',
    USER_DATA = 'user_data',
    REMEMBER_ME = 'remember_me',
}

/**
 * Simple XOR encryption for basic obfuscation
 * Note: This is NOT secure encryption. For production, use a proper encryption library.
 * This just prevents casual inspection of localStorage.
 */
function simpleEncrypt(text: string): string {
    if (!text) return '';
    const key = 'page_spark_secret_key_2026';
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(encrypted);
}

function simpleDecrypt(encrypted: string): string {
    try {
        const text = atob(encrypted);
        const key = 'page_spark_secret_key_2026';
        let decrypted = '';
        for (let i = 0; i < text.length; i++) {
            decrypted += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return decrypted;
    } catch {
        return '';
    }
}

/**
 * Storage utility class
 */
class SecureStorage {
    private getKey(key: StorageKey): string {
        return `${STORAGE_PREFIX}${key}`;
    }

    /**
     * Store a value in localStorage
     */
    set<T>(key: StorageKey, value: T, encrypt: boolean = false): void {
        try {
            if (value === undefined) return;
            const stringValue = JSON.stringify(value);
            const finalValue = encrypt ? simpleEncrypt(stringValue) : stringValue;
            localStorage.setItem(this.getKey(key), finalValue);
        } catch (error) {
            console.error('Failed to set storage item:', error);
        }
    }

    /**
     * Retrieve a value from localStorage
     */
    get<T>(key: StorageKey, decrypt: boolean = false): T | null {
        try {
            const item = localStorage.getItem(this.getKey(key));
            if (!item) return null;

            const stringValue = decrypt ? simpleDecrypt(item) : item;
            return JSON.parse(stringValue) as T;
        } catch (error) {
            console.error('Failed to get storage item:', error);
            return null;
        }
    }

    /**
     * Remove a value from localStorage
     */
    remove(key: StorageKey): void {
        try {
            localStorage.removeItem(this.getKey(key));
        } catch (error) {
            console.error('Failed to remove storage item:', error);
        }
    }

    /**
     * Clear all app-related storage
     */
    clear(): void {
        try {
            Object.values(StorageKey).forEach(key => {
                this.remove(key);
            });
        } catch (error) {
            console.error('Failed to clear storage:', error);
        }
    }

    /**
     * Check if a key exists
     */
    has(key: StorageKey): boolean {
        return localStorage.getItem(this.getKey(key)) !== null;
    }
}

/**
 * Singleton storage instance
 */
export const storage = new SecureStorage();

/**
 * Token management utilities
 */
export const tokenStorage = {
    setToken: (token: string) => storage.set(StorageKey.AUTH_TOKEN, token, true),
    getToken: () => storage.get<string>(StorageKey.AUTH_TOKEN, true),
    removeToken: () => storage.remove(StorageKey.AUTH_TOKEN),
    hasToken: () => storage.has(StorageKey.AUTH_TOKEN),

    setRefreshToken: (token: string) => storage.set(StorageKey.REFRESH_TOKEN, token, true),
    getRefreshToken: () => storage.get<string>(StorageKey.REFRESH_TOKEN, true),
    removeRefreshToken: () => storage.remove(StorageKey.REFRESH_TOKEN),

    clearAll: () => {
        storage.remove(StorageKey.AUTH_TOKEN);
        storage.remove(StorageKey.REFRESH_TOKEN);
        storage.remove(StorageKey.USER_DATA);
    },
};
