import { Coordinates } from '@/core/api/types';

// Backend DTOs
export type RestaurantStatus = 'OPEN' | 'CLOSED' | 'BUSY';

export interface RestaurantResponse {
    id: string;
    ownerUserId: string;
    name: string;
    description: string;
    status: RestaurantStatus;
    rating: number;
    imageUrl: string;
    createdAt: string;
    categories: CategoryResponse[];
}

export interface CategoryResponse {
    id: string;
    name: string;
    sortOrder: number;
    menuItems: MenuItemResponse[];
}

export interface MenuItemResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    available: boolean;
    imageUrl: string;
}

// UI Models (Adapted from Backend)
export interface Restaurant {
    id: string;
    name: string;
    description: string;
    image: string; // mapped from imageUrl
    rating: number;
    reviewCount: number; // Mocked (backend missing)
    deliveryTime: string; // Mocked (backend missing)
    deliveryFee: number; // Mocked (backend missing)
    minimumOrder: number; // Mocked (backend missing)
    distance?: number; // Mocked (backend missing)
    isOpen: boolean; // mapped from status
    categories: string[]; // mapped from CategoryResponse names
    location: Coordinates; // Mocked (backend missing)
    address: string; // Mocked (backend missing)
}

// Category for UI (Simple list)
export interface Category {
    id: string;
    name: string;
    icon?: string; // Backend doesn't have icons yet
    slug?: string;
}

// Menu Item for UI
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string; // Mapped from parent category
    isAvailable: boolean; // mapped from available
    preparationTime?: number; // Mocked
    modifiers?: MenuModifier[]; // Mocked (backend missing)
}

export interface MenuModifier {
    id: string;
    name: string;
    required: boolean;
    minSelection: number;
    maxSelection: number;
    options: ModifierOption[];
}

export interface ModifierOption {
    id: string;
    name: string;
    price: number;
}

// Search and filter types
export interface RestaurantFilters {
    categoryId?: string;
    minRating?: number;
    maxDeliveryFee?: number;
    isOpen?: boolean;
    sortBy?: 'distance' | 'rating' | 'deliveryTime' | 'deliveryFee';
}

export interface RestaurantSearchParams extends Coordinates {
    radius?: number; // in kilometers
    filters?: RestaurantFilters;
}
