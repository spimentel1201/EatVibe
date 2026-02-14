import { apiClient } from '@/core/api/client';
import type {
    Restaurant,
    MenuItem,
    Category,
    RestaurantSearchParams,
    RestaurantResponse
} from '../types';

// Mappers
const mapRestaurantResponseToRestaurant = (response: RestaurantResponse): Restaurant => {
    return {
        id: response.id,
        name: response.name,
        description: response.description,
        image: response.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        rating: response.rating || 0,
        reviewCount: 100, // Mocked
        deliveryTime: '30-45 min', // Mocked
        deliveryFee: 5.0, // Mocked
        minimumOrder: 15.0, // Mocked
        distance: 2.5, // Mocked
        isOpen: response.status === 'OPEN' || response.status === 'BUSY',
        categories: response.categories?.map(c => c.name) || [],
        location: { latitude: -12.0464, longitude: -77.0428 }, // Mocked
        address: 'Av. Principal 123', // Mocked
    };
};

const mapMenuItemsFromRestaurant = (response: RestaurantResponse): MenuItem[] => {
    const items: MenuItem[] = [];
    response.categories?.forEach(category => {
        category.menuItems?.forEach(item => {
            items.push({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                image: item.imageUrl,
                category: category.name,
                isAvailable: item.available,
                preparationTime: 20 // Mocked
            });
        });
    });
    return items;
};

/**
 * Get restaurants by location
 */
export const getRestaurants = async (
    params: RestaurantSearchParams
): Promise<Restaurant[]> => {
    try {
        // Backend doesn't support filtering yet, so we fetch all and filter client-side
        // generic type <RestaurantResponse[]> might not work if axios types are not fully compatible, using 'any' cast as fallback
        const response = await apiClient.get('/restaurants');
        const allRestaurants: RestaurantResponse[] = response.data;

        let results = allRestaurants.map(mapRestaurantResponseToRestaurant);

        // Client-side filtering to respect params
        if (params.filters?.isOpen !== undefined) {
            results = results.filter(r => r.isOpen === params.filters?.isOpen);
        }

        if (params.filters?.categoryId) {
            // This is imperfect as we filter by string name vs ID, but sufficient for now
            // We'll need to fetch categories to map ID to name, or update filters to use names
        }

        // Sort results
        if (params.filters?.sortBy === 'distance') {
            results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        } else if (params.filters?.sortBy === 'rating') {
            results.sort((a, b) => b.rating - a.rating);
        }

        return results;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
};

/**
 * Get restaurant by ID (full details)
 */
export const getRestaurantDetails = async (id: string): Promise<RestaurantResponse | null> => {
    try {
        const response = await apiClient.get(`/restaurants/${id}`);
        return response.data as RestaurantResponse;
    } catch (error) {
        console.error(`Error fetching restaurant ${id}: `, error);
        return null;
    }
};

/**
 * Get restaurant by ID (UI Model)
 */
export const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
    const details = await getRestaurantDetails(id);
    if (!details) return null;
    return mapRestaurantResponseToRestaurant(details);
};

/**
 * Get menu items for a restaurant
 */
export const getMenu = async (restaurantId: string): Promise<MenuItem[]> => {
    const details = await getRestaurantDetails(restaurantId);
    if (!details) return [];
    return mapMenuItemsFromRestaurant(details);
};

/**
 * Get all categories
 * TODO: Implement backend endpoint
 */
export const getCategories = async (): Promise<Category[]> => {
    // Return mock categories for now until backend endpoint exists
    return [
        { id: '1', name: 'Hamburguesas', icon: '🍔', slug: 'hamburguesas' },
        { id: '2', name: 'Pizza', icon: '🍕', slug: 'pizza' },
        { id: '3', name: 'Sushi', icon: '🍣', slug: 'sushi' },
        { id: '4', name: 'Pollo', icon: '🍗', slug: 'pollo' },
        { id: '5', name: 'Vegano', icon: '🥗', slug: 'vegano' },
        { id: '6', name: 'Postres', icon: '🍰', slug: 'postres' },
        { id: '7', name: 'Bebidas', icon: '🥤', slug: 'bebidas' },
        { id: '8', name: 'Mexicana', icon: '🌮', slug: 'mexicana' },
    ];
};

