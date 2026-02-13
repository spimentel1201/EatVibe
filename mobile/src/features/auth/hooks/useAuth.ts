import { create } from 'zustand';
import { tokenStorage } from '@/core/storage/tokenStorage';
import { User, LoginRequest, RegisterRequest } from '../types';

export interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

// MOCK / SIMULATION MODE ENABLED
export const useAuth = create((set: any): AuthStore => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
            // SIMULACION: Retraso de 1 segundo
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock tokens (en producción vendrían del backend)
            const mockAccessToken = 'mock_access_token_' + Date.now();
            const mockRefreshToken = 'mock_refresh_token_' + Date.now();

            // Guardar tokens en SecureStore
            await tokenStorage.saveTokens(mockAccessToken, mockRefreshToken);

            // Usuario falso para pruebas
            const mockUser: User = {
                id: 'user-123',
                email: credentials.email,
                name: 'Usuario Demo',
                role: 'CONSUMER',
                phone: '555-0123',
                createdAt: new Date().toISOString()
            };

            set({
                user: mockUser,
                isAuthenticated: true,
                isLoading: false
            });
            console.log('⚡ SIMULACION: Login exitoso para', credentials.email);
            console.log('⚡ Tokens guardados en SecureStore');
        } catch (error) {
            set({
                isLoading: false,
                error: 'Error simulado (nunca debería pasar aquí)'
            });
        }
    },

    register: async (userData: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock tokens
            const mockAccessToken = 'mock_access_token_' + Date.now();
            const mockRefreshToken = 'mock_refresh_token_' + Date.now();

            // Guardar tokens
            await tokenStorage.saveTokens(mockAccessToken, mockRefreshToken);

            const mockUser: User = {
                id: 'user-new-123',
                email: userData.email,
                name: userData.name,
                role: 'CONSUMER',
                phone: userData.phone,
                createdAt: new Date().toISOString()
            };

            set({
                user: mockUser,
                isAuthenticated: true,
                isLoading: false
            });
            console.log('⚡ SIMULACION: Registro exitoso');
            console.log('⚡ Tokens guardados en SecureStore');
        } catch (error) {
            set({
                isLoading: false,
                error: 'Error al registrar'
            });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            // Limpiar tokens del SecureStore
            await tokenStorage.clearTokens();

            set({ user: null, isAuthenticated: false, isLoading: false, error: null });
            console.log('⚡ SIMULACION: Logout exitoso');
            console.log('⚡ Tokens eliminados de SecureStore');
        } catch (error) {
            set({ isLoading: false });
        }
    },

    checkAuth: async () => {
        set({ isLoading: true });
        console.log('🔐 checkAuth: Iniciando verificación...');

        try {
            // FORCE CLEANUP: Limpiar tokens viejos para evitar conflictos
            await tokenStorage.clearTokens();
            console.log('🧹 Tokens limpiados forzosamente para debugging');

            // Safety timeout: If SecureStore takes too long, abort.
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Auth check timed out')), 5000)
            );

            // Verificar si hay tokens guardados con timeout
            const hasTokens = await Promise.race([
                tokenStorage.hasTokens(),
                timeoutPromise
            ]);

            console.log('🔐 checkAuth: Tokens encontrados?', hasTokens);

            if (hasTokens) {
                // En simulación, restaurar usuario mock si hay tokens
                const mockUser: User = {
                    id: 'user-123',
                    email: 'demo@eatvibe.com',
                    name: 'Usuario Demo',
                    role: 'CONSUMER',
                    phone: '555-0123',
                    createdAt: new Date().toISOString()
                };

                set({
                    user: mockUser,
                    isAuthenticated: true,
                    isLoading: false
                });
                console.log('⚡ SIMULACION: Sesión restaurada desde tokens');
            } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
                console.log('⚡ SIMULACION: No hay tokens, usuario no autenticado');
            }
        } catch (error) {
            console.error('🔐 checkAuth ERROR:', error);
            // En caso de error o timeout, asumimos logout para no bloquear la app
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
}));