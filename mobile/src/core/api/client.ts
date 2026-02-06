import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Create Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
    async (config: any) => {
        try {
            const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error retrieving access token:', error);
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Response interceptor for 401 handling and token refresh
apiClient.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

                if (!refreshToken) {
                    // No refresh token available, redirect to login
                    await clearTokens();
                    throw new Error('No refresh token available');
                }

                // Attempt to refresh the access token
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Save new tokens
                await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
                if (newRefreshToken) {
                    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
                }

                // Retry the original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                await clearTokens();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Helper function to clear tokens
const clearTokens = async () => {
    try {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error clearing tokens:', error);
    }
};

export default apiClient;
export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };
