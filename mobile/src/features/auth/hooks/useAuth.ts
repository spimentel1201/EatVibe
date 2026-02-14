import { create } from 'zustand';
import { tokenStorage } from '@/core/storage/tokenStorage';
import { User, LoginRequest, RegisterRequest } from '../types';
import { authApi } from '../api/authApi';

export interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginRequest) => Promise<User>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

export const useAuth = create((set: any): AuthStore => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (credentials: LoginRequest): Promise<User> => {
        set({ isLoading: true, error: null });
        try {
            const { user, accessToken, refreshToken } = await authApi.login(credentials);

            // Save tokens to secure storage
            await tokenStorage.saveTokens(accessToken, refreshToken);

            set({
                user,
                isAuthenticated: true,
                isLoading: false,
            });

            console.log('✅ Login successful for', user.email);
            return user;
        } catch (error: any) {
            const errorMessage = error.message || 'Login failed';
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
            const { user, accessToken, refreshToken } = await authApi.register(userData);

            // Save tokens to secure storage
            await tokenStorage.saveTokens(accessToken, refreshToken);

            set({
                user,
                isAuthenticated: true,
                isLoading: false,
            });

            console.log('✅ Registration successful for', user.email);
        } catch (error: any) {
            const errorMessage = error.message || 'Registration failed';
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            // Call logout API (currently no-op in backend)
            await authApi.logout();

            // Clear tokens from secure storage
            await tokenStorage.clearTokens();

            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });

            console.log('✅ Logout successful');
        } catch (error: any) {
            const errorMessage = error.message || 'Logout failed';
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isLoading: true, error: null });
        try {
            const accessToken = await tokenStorage.getAccessToken();

            if (!accessToken) {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
                return;
            }

            // TODO: Add /me endpoint to backend to get current user
            // For now, we'll just check if token exists
            // In production, decode JWT or call /me endpoint
            set({
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error.message || 'Auth check failed',
            });
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));