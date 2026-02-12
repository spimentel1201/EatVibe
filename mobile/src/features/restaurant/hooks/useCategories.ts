import { useQuery } from '@tanstack/react-query';
import * as restaurantApi from '../api/restaurantApi';

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: restaurantApi.getCategories,
        staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
        gcTime: 60 * 60 * 1000, // 1 hour
    });
};

