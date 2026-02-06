import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenStorage = {
    // Save access token
    async saveAccessToken(token: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving access token:', error);
            throw error;
        }
    },

    // Get access token
    async getAccessToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        } catch (error) {
            console.error('Error retrieving access token:', error);
            return null;
        }
    },

    // Save refresh token
    async saveRefreshToken(token: string): Promise<void> {
        try {
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving refresh token:', error);
            throw error;
        }
    },

    // Get refresh token
    async getRefreshToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        } catch (error) {
            console.error('Error retrieving refresh token:', error);
            return null;
        }
    },

    // Save both tokens
    async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
        try {
            await Promise.all([
                SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
                SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
            ]);
        } catch (error) {
            console.error('Error saving tokens:', error);
            throw error;
        }
    },

    // Remove all tokens
    async clearTokens(): Promise<void> {
        try {
            await Promise.all([
                SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
                SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
            ]);
        } catch (error) {
            console.error('Error clearing tokens:', error);
            throw error;
        }
    },
};
