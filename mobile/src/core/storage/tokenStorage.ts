import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Token storage utilities for secure token management
 */
// Fallback in-memory storage for debugging/stability
const memoryStorage = new Map<string, string>();

/**
 * Token storage utilities for secure token management
 */
export const tokenStorage = {
    /**
     * Save access and refresh tokens
     */
    async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
        try {
            memoryStorage.set(ACCESS_TOKEN_KEY, accessToken);
            memoryStorage.set(REFRESH_TOKEN_KEY, refreshToken);
            // await Promise.all([
            //     SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
            //     SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
            // ]);
        } catch (error) {
            console.error('Error saving tokens:', error);
            throw error;
        }
    },

    /**
     * Get access token
     */
    async getAccessToken(): Promise<string | null> {
        try {
            return memoryStorage.get(ACCESS_TOKEN_KEY) || null;
            // return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        } catch (error) {
            console.error('Error getting access token:', error);
            return null;
        }
    },

    /**
     * Get refresh token
     */
    async getRefreshToken(): Promise<string | null> {
        try {
            return memoryStorage.get(REFRESH_TOKEN_KEY) || null;
            // return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Error getting refresh token:', error);
            return null;
        }
    },

    /**
     * Clear all tokens
     */
    async clearTokens(): Promise<void> {
        try {
            memoryStorage.delete(ACCESS_TOKEN_KEY);
            memoryStorage.delete(REFRESH_TOKEN_KEY);
            // await Promise.all([
            //     SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
            //     SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
            // ]);
        } catch (error) {
            console.error('Error clearing tokens:', error);
            throw error;
        }
    },

    /**
     * Check if user has valid tokens
     */
    async hasTokens(): Promise<boolean> {
        try {
            const accessToken = await this.getAccessToken();
            return !!accessToken;
        } catch (error) {
            return false;
        }
    },
};

export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };
