// Base API Response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    code: string;
    details?: Record<string, unknown>;
}

// Pagination types
export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Geolocation types
export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface LocationParams extends Coordinates {
    radius?: number; // in kilometers
}
