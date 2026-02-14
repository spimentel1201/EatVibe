import { MenuItem } from '../../restaurant/types';

export interface CartItem extends MenuItem {
    quantity: number;
    customizations?: string[]; // Simplified for now, mapped to specialInstructions
}

export interface CartStore {
    items: CartItem[];
    restaurantId: string | null;
    addItem: (item: MenuItem, quantity: number, restaurantId: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

// Backend DTOs
export interface AddToCartRequest {
    customerId: string;
    restaurantId: string;
    menuItemId: string;
    productName: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
}

export interface CartResponse {
    id: string; // Redis key or similar
    customerId: string;
    restaurantId: string;
    items: CartItemResponse[];
    totalAmount: number;
}

export interface CartItemResponse {
    menuItemId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
}
