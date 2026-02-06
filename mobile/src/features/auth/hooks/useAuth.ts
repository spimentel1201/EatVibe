import { create } from 'zustand';
import { tokenStorage } from '@/core/storage/tokenStorage';
import * as authApi from '../api/authApi';
import { User, LoginRequest, RegisterRequest } from '../types';

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

export const useAuth = create<AuthStore>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authApi.login(credentials);

            // Save tokens
            await tokenStorage.saveTokens(response.accessToken, response.refreshToken);

            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authApi.register(userData);

            // Save tokens
            await tokenStorage.saveTokens(response.accessToken, response.refreshToken);

            set({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrarse';
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true });

        try {
            await authApi.logout();
            await tokenStorage.clearTokens();

            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error('Logout error:', error);
            // Clear local state even if API call fails
            await tokenStorage.clearTokens();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    },

    checkAuth: async () => {
        set({ isLoading: true });

        try {
            const accessToken = await tokenStorage.getAccessToken();

            if (!accessToken) {
                set({ isAuthenticated: false, isLoading: false });
                return;
            }

            // Fetch current user
            const user = await authApi.getCurrentUser();

            set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error('Auth check error:', error);
            await tokenStorage.clearTokens();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    },

    clearError: () => {
        set({ error: null });
    },
}));
