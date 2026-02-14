import client from '@/core/api/client';
import { CreateOrderRequest, OrderResponse, UpdateOrderStatusRequest } from '../types';

export const orderApi = {
    createOrder: async (request: CreateOrderRequest): Promise<OrderResponse> => {
        const response = await client.post('/orders', request);
        return response.data;
    },

    getOrderById: async (id: string): Promise<OrderResponse> => {
        const response = await client.get(`/orders/${id}`);
        return response.data;
    },

    getOrdersByCustomer: async (customerId: string): Promise<OrderResponse[]> => {
        const response = await client.get(`/orders/customer/${customerId}`);
        return response.data;
    },

    // For testing or future use
    updateStatus: async (id: string, status: UpdateOrderStatusRequest['status']): Promise<OrderResponse> => {
        const response = await client.patch(`/orders/${id}/status`, { status });
        return response.data;
    }
};
