export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'READY_FOR_PICKUP'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED';

export interface CreateOrderRequest {
    customerId: string;
    restaurantId: string;
    deliveryAddressId: string;
    deliveryFee: number;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}

export interface OrderResponse {
    id: string;
    customerId: string; // UUID
    restaurantId: string; // UUID
    courierId?: string; // UUID, nullable
    status: OrderStatus;
    totalAmount: number;
    deliveryFee: number;
    restaurantName: string; // Added for UI convenience, check if backend provides it or we need to fetch
    items: OrderItemResponse[];
    createdAt: string;
    updatedAt: string;
    estimatedDeliveryTime?: string;
}

export interface OrderItemResponse {
    id: string;
    menuItemId: string; // UUID
    productName: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
}
