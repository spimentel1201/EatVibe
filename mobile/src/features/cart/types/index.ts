import { MenuItem } from '../../restaurant/types';

export interface CartItem extends MenuItem {
    quantity: number;
    customizations?: string[]; // Simplified for now
}

export interface CartStore {
    items: CartItem[];
    restaurantId: string | null;
    addItem: (item: MenuItem, quantity: number) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}
