// User types
export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    role: 'CONSUMER' | 'COURIER' | 'RESTAURANT' | 'ADMIN';
    createdAt: string;
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
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
}

// Auth state
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
