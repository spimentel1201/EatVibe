import { useQuery, UseQueryResult } from '@tanstack/react-query';
import * as restaurantApi from '../api/restaurantApi';
import { Category } from '../types';

/**
 * Hook to fetch all categories
 */
export const useCategories = (): UseQueryResult<Category[], Error> => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: restaurantApi.getCategories,
        staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
        gcTime: 60 * 60 * 1000, // 1 hour
    });
};
