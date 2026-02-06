import { useQuery } from '@tanstack/react-query';
import * as restaurantApi from '../api/restaurantApi';
import { Restaurant, RestaurantSearchParams } from '../types';

/**
 * Hook to fetch restaurants by location
 */
export const useRestaurants = (params: RestaurantSearchParams) => {
    return useQuery({
        queryKey: ['restaurants', params],
        queryFn: () => restaurantApi.getRestaurants(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        enabled: !!params.latitude && !!params.longitude,
    });
};

/**
 * Hook to fetch a single restaurant by ID
 */
export const useRestaurant = (id: string) => {
    return useQuery({
        queryKey: ['restaurant', id],
        queryFn: () => restaurantApi.getRestaurantById(id),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!id,
    });
};

