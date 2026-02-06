import apiClient from '@/core/api/client';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

// Mock user data
const mockUser: User = {
    id: '1',
    email: 'user@foodrush.com',
    name: 'Usuario Demo',
    phone: '+51999999999',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'CONSUMER',
    createdAt: new Date().toISOString(),
};

// Mock tokens
const mockAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ1c2VyQGZvb2RydXNoLmNvbSIsInJvbGUiOiJDT05TVU1FUiIsImlhdCI6MTUxNjIzOTAyMn0.mock';
const mockRefreshToken = 'mock_refresh_token_12345';

/**
 * Login with email and password
 * TODO: Replace with actual API call when backend is ready
 */
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (credentials.email === 'user@foodrush.com' && credentials.password === 'password') {
        return {
            user: mockUser,
            accessToken: mockAccessToken,
            refreshToken: mockRefreshToken,
        };
    }

    throw new Error('Credenciales inválidas');
};

/**
 * Register a new user
 * TODO: Replace with actual API call when backend is ready
 */
export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock validation
    if (userData.email && userData.password && userData.name) {
        const newUser: User = {
            id: Math.random().toString(36).substring(7),
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            role: 'CONSUMER',
            createdAt: new Date().toISOString(),
        };

        return {
            user: newUser,
            accessToken: mockAccessToken,
            refreshToken: mockRefreshToken,
        };
    }

    throw new Error('Datos de registro inválidos');
};

/**
 * Logout user
 * TODO: Add backend call to invalidate token when ready
 */
export const logout = async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // In production, call backend to invalidate token
    // await apiClient.post('/auth/logout');
};

/**
 * Get current user profile
 * TODO: Replace with actual API call when backend is ready
 */
export const getCurrentUser = async (): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUser;
};
