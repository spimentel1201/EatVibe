// User types
export type UserRole = 'CONSUMER' | 'COURIER' | 'RESTAURANT' | 'ADMIN';

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    role: UserRole;
    createdAt?: string;
}

// Auth request types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    phone?: string;
}

export interface SocialLoginRequest {
    provider: 'GOOGLE' | 'APPLE';
    token: string;
}

// Auth response types
export interface AuthResponse {
    user: User;
    token: string; // Backend returns 'token' not 'accessToken'
    refreshToken: string;
    type: string; // e.g., 'Bearer'
    role: string; // User role from backend
}

export interface RefreshTokenResponse {
    token: string; // Backend returns 'token' not 'accessToken'
    refreshToken?: string;
    type: string;
    role: string;
}

// Auth state
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
