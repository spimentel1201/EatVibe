import { create } from 'zustand';
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
            set({ user: null, isAuthenticated: false, isLoading: false, error: null });
            console.log('⚡ SIMULACION: Logout exitoso');
        } catch (error) {
            set({ isLoading: false });
        }
    },

    checkAuth: async () => {
        // En simulacion, arrancamos directo sin esperar
        set({ user: null, isAuthenticated: false, isLoading: false });
        console.log('⚡ SIMULACION: CheckAuth inmediato');
    },

    clearError: () => set({ error: null }),
}));