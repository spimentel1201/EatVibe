import { useQuery } from '@tanstack/react-query';

import * as restaurantApi from '../api/restaurantApi';

/**
 * Hook to fetch restaurant details and menu
 */
export const useRestaurantDetail = (restaurantId: string) => {
    const restaurantQuery = useQuery({
        queryKey: ['restaurant', restaurantId],
        queryFn: () => restaurantApi.getRestaurantById(restaurantId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!restaurantId,
    });

    const menuQuery = useQuery({
        queryKey: ['menu', restaurantId],
        queryFn: () => restaurantApi.getMenu(restaurantId),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!restaurantId,
    });

    return {
        restaurant: restaurantQuery.data,
        menu: menuQuery.data,
        isLoading: restaurantQuery.isLoading || menuQuery.isLoading,
        error: restaurantQuery.error || menuQuery.error,
        refetch: () => {
            restaurantQuery.refetch();
            menuQuery.refetch();
        },
    };
};
