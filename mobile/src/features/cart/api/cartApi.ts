import client from '@/core/api/client';
import { AddToCartRequest, CartResponse } from '../types';

export const cartApi = {
    addToCart: async (request: AddToCartRequest): Promise<CartResponse> => {
        const response = await client.post('/cart/items', request);
        return response.data;
    },

    getCart: async (customerId: string): Promise<CartResponse> => {
        const response = await client.get(`/cart/${customerId}`);
        return response.data;
    },

    clearCart: async (customerId: string): Promise<void> => {
        await client.delete(`/cart/${customerId}`);
    },

    // Helper to sync entire local cart to backend
    syncCart: async (customerId: string, restaurantId: string, items: any[]): Promise<void> => {
        // 1. Clear existing backend cart to ensure state matches local
        await cartApi.clearCart(customerId);

        // 2. Add all items sequentially (or parallel if backend supports concurrency well)
        // Using Promise.all for parallelism might be faster but check for race conditions if backend calculates totals incrementally
        // For Redis it should be fine.
        const promises = items.map(item => {
            const request: AddToCartRequest = {
                customerId,
                restaurantId,
                menuItemId: item.id,
                productName: item.name,
                price: item.price,
                quantity: item.quantity,
                specialInstructions: item.customizations?.join(', ') || '',
            };
            return cartApi.addToCart(request);
        });

        await Promise.all(promises);
    }
};
