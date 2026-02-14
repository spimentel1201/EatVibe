import { apiClient } from '../../../core/api/client';
import { AuthResponse, LoginRequest, RegisterRequest, User, UserRole } from '../types';

export const authApi = {
    /**
     * Login user with email and password
     */
    login: async (
        credentials: LoginRequest
    ): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            const { token, refreshToken, role } = response.data;

            // Backend doesn't return full user object, construct it from response
            // TODO: Add endpoint to get user profile or decode from JWT
            const user: User = {
                id: '', // Will be populated from JWT decode or separate /me endpoint
                email: credentials.email,
                name: '',
                role: role as UserRole,
            };

            return { user, accessToken: token, refreshToken };
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },

    /**
     * Register a new user
     */
    register: async (
        data: RegisterRequest
    ): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
        try {
            const response = await apiClient.post('/auth/register', data);
            const { token, refreshToken, role } = response.data;

            const user: User = {
                id: '',
                email: data.email,
                name: data.name,
                phone: data.phone,
                role: role as UserRole,
            };

            return { user, accessToken: token, refreshToken };
        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    },

    /**
     * Logout user
     * Note: Backend doesn't have a logout endpoint, just clear local tokens
     */
    logout: async (): Promise<void> => {
        // No backend call needed, just clear local storage
        // The useAuth hook will handle clearing tokens
        return Promise.resolve();
    },
};
