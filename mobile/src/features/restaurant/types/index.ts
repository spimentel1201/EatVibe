import { Coordinates } from '@/core/api/types';

// Restaurant types
export interface Restaurant {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    reviewCount: number;
    deliveryTime: string; // e.g., "25-35 min"
    deliveryFee: number;
    minimumOrder: number;
    distance?: number; // in kilometers
    isOpen: boolean;
    categories: string[];
    location: Coordinates;
    address: string;
}

// Category types
export interface Category {
    id: string;
    name: string;
    icon: string;
    slug: string;
}

// Menu Item types
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
    isAvailable: boolean;
    preparationTime?: number; // in minutes
    modifiers?: MenuModifier[];
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
