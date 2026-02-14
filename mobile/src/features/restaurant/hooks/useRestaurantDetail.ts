import { useQuery } from '@tanstack/react-query';
import * as restaurantApi from '../api/restaurantApi';
import type { CategoryResponse, MenuItemResponse } from '../types';

/**
 * Hook to fetch restaurant details and menu
 */
export const useRestaurantDetail = (restaurantId: string) => {
    // We use a single query to get the full restaurant details including the menu
    const query = useQuery({
        queryKey: ['restaurant-details', restaurantId],
        queryFn: () => restaurantApi.getRestaurantDetails(restaurantId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!restaurantId,
    });

    // Parse the data into restaurant and menu
    const restaurant = query.data ? {
        id: query.data.id,
        name: query.data.name,
        description: query.data.description,
        image: query.data.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        rating: query.data.rating || 0,
        reviewCount: 100, // Mocked
        deliveryTime: '30-45 min', // Mocked
        deliveryFee: 5.0, // Mocked
        minimumOrder: 15.0, // Mocked
        distance: 2.5, // Mocked
        isOpen: query.data.status === 'OPEN' || query.data.status === 'BUSY',
        categories: query.data.categories?.map((c: CategoryResponse) => c.name) || [],
        location: { latitude: -12.0464, longitude: -77.0428 }, // Mocked
        address: 'Av. Principal 123', // Mocked
    } : undefined;

    const menu = query.data ? (() => {
        const items: any[] = [];
        query.data.categories?.forEach((category: CategoryResponse) => {
            category.menuItems?.forEach((item: MenuItemResponse) => {
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
    })() : undefined;

    return {
        restaurant,
        menu,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
};
