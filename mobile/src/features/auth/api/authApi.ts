import axios from 'axios';
import { LoginRequest, RegisterRequest, User, UserRole } from '../types';

// Auth service doesn't use /api/v1 prefix, so we need a separate base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const AUTH_BASE_URL = API_BASE_URL.replace('/api/v1', '');

/**
 * Decode JWT token to extract user information
 * Note: This is a simple base64 decode, not cryptographic verification
 */
const decodeJWT = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export const authApi = {
    /**
     * Login user with email and password
     */
    login: async (
        credentials: LoginRequest
    ): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
        try {
            const response = await axios.post(`${AUTH_BASE_URL}/auth/login`, credentials);
            const { token, refreshToken, role } = response.data;

            // Decode JWT to extract user information
            const decoded = decodeJWT(token);

            const user: User = {
                id: decoded?.sub || decoded?.userId || '',
                email: decoded?.email || credentials.email,
                name: decoded?.name || '',
                role: role as UserRole,
                createdAt: ''
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
            const response = await axios.post(`${AUTH_BASE_URL}/auth/register`, data);
            const { token, refreshToken, role } = response.data;

            // Decode JWT to extract user information
            const decoded = decodeJWT(token);

            const user: User = {
                id: decoded?.sub || decoded?.userId || '',
                email: decoded?.email || data.email,
                name: decoded?.name || data.name,
                phone: data.phone,
                role: role as UserRole,
                createdAt: ''
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
